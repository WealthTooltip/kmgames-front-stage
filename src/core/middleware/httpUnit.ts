/*
 * @Description: 请求中间件
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2024-01-11 13:32:13
 * @LastEditors: Passion.KMG
 */
import {IPayload, ERequestMethods, EResponseErrors, IRequest} from '@core/middleware/_httpMiddlewareTypes';
import {Dispatch} from 'redux';
import ACTIONS from '@actions/index';
import axios from 'axios';
import md5 from 'md5';
import {getURL} from '@core/apis';
import store from '@helpers/storage';
import G from '@constants/global';
import {PopupTypeEnum} from '@core/constants/enum/common';

export class HTTP {
  private request: IRequest;

  private cache: IPayload['cache'];

  private loading: boolean | string;

  private key: string;

  private dispatch: Dispatch;

  private timeout: number;

  private timeoutCallback: Function;

  private retry: number;

  private maxRetry: number;

  private callback: Function;

  private dataFix: IPayload['dataFix'];

  private fieldFix: IPayload['fieldFix'];

  constructor(_params: IPayload, dispatch: Dispatch) {
    const {
      key = '',
      urlParams = [],
      params = null,
      data = null,
      method = ERequestMethods.GET,
      loading = false,
      cache = null,
      timeout = 30,
      timeoutCallback = null,
      maxRetry = 1000,
      headers = null,
      dataFix = [],
      fieldFix = [],
    } = _params;
    this.request = {
      url: getURL(key, urlParams),
      data,
      params,
      method,
      headers,
      nonce: this.nonceKey(key),
    };
    this.key = key;
    this.loading = loading;
    this.dispatch = dispatch;
    this.cache = cache;
    this.timeout = timeout;
    (this.timeoutCallback = timeoutCallback), (this.maxRetry = maxRetry);
    this.retry = 0;
    this.dataFix = dataFix;
    this.fieldFix = fieldFix;
  }

  /**
   * 发送请求
   * @param callback 回调函数
   */
  public sendHttp = ({callback, mock}: {callback: Function; mock?: any}) => {
    // 测试数据
    if (mock) {
      const mockRes = {...mock};
      try {
        console.log('#### USING MOCK DATA:', mockRes);
        callback(mockRes);
      } catch (e) {
        console.log('#### MOCK DATA CATCH ERROR! ####');
      }
      return;
    }
    // 正常请求
    this.callback = callback;
    if (this.loading) {
      this.dispatch(ACTIONS.BASE.openLoading({text: typeof this.loading === 'string' ? this.loading : ''}));
    }
    const domain = localStorage.getItem('__debug_domain__') || (__DEV__ ? false : process.env.DOMAIN) || '/';
    const requestData = this.request.data;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'accessToken': store.get('AUTH'),
      'Accept-Language': 'zh',
    };
    // 中断前一次未完成的请求
    if (G.GET('REQUEST_CANCLE_TOKEN') && typeof G.GET('REQUEST_CANCLE_TOKEN')[this.key] === 'function') {
      G.GET('REQUEST_CANCLE_TOKEN')[this.key](`--新请求【${this.key}】已发出--`);
    }
    const t = this;
    const {CancelToken} = axios;
    // 去请求
    axios({
      url: `${domain}${this.request.url}`,
      method: this.request.method,
      data: requestData,
      params: this.request.params,
      headers: this.request.headers ? {...headers, ...this.request.headers} : headers,
      timeout: this.timeout * 1000,
      cancelToken: new CancelToken((c) => {
        G.SET('REQUEST_CANCLE_TOKEN', {...G.GET('REQUEST_CANCLE_TOKEN'), [t.key]: c});
      }),
    })
        .then((res: any) => res.data)
        .then(this.fieldFixCheck)
        .then(this.dataFixCheck)
        .then((res: any) => {
          if (this.loading) {
            this.dispatch(ACTIONS.BASE.closeLoading());
          }
          // console.log('httpUnit.ts文件 125==============行打印=', res);
          callback(res);
        })
        .catch(this.errorHandler);
  };

  // 获取是否缓存
  public isCache = () => !!this.cache;

  // 获取缓存对象
  public getCache = () => this.cache;

  // 获取缓存键值
  public cacheKey = () => md5(`${this.request.url}`).substr(0, 16);

  // 获取nonce - 后端防重复请求
  private nonceKey = (api: string) => md5(`${api}-${_.now()}-${_.random(999)}`);

  // 字段矫正（用于将不规范的字段转换成规范的字段）
  private fieldFixCheck = (res: any) => {
    if (!this.fieldFix || this.fieldFix.length === 0) {
      return res;
    }
    const result = {...res};
    _.each(this.fieldFix, (item: {old: string; new: string}): any => {
      if (_.isUndefined(res[item.old])) {
        return true;
      }
      result[item.new] = res[item.old];
      delete result[item.old];
    });
    return result;
  };

  // 数据矫正（用于将不规范的数据转换成规范的数据）
  private dataFixCheck = (res: any) => {
    if (!this.dataFix || this.dataFix.length === 0) {
      return res;
    }
    let result = {...res};
    _.each(this.dataFix, (item: any): any => {
      if (_.get(res, item.key) != item.old) {
        return true;
      }
      result = _.set(res, item.key, item.new);
    });
    return result;
  };

  // 错误检查
  private errorHandler = (error: any) => {
    // 关闭LOADING
    this.loading && this.dispatch(ACTIONS.BASE.closeLoading());
    if (axios.isCancel(error)) {
      if (__DEV__) {
        console.log('请求被取消：', error.message);
        console.log(`--新请求【${this.key}】已发出--`);
      }
      return;
    }
    // 响应码错误
    if (error.response && error.response.status !== 200) {
      this.dispatch(
          ACTIONS.BASE.openToast({
            text: `${'网络错误'} - ${error.response.status} / ${md5(this.key).substr(0, 6)}`,
            types: 'error',
          }),
      );
      return;
    }
    // 断网或超时，回调优先
    if ((_.includes(error.message, 'Network Error') || _.includes(error.message, 'timeout')) && this.timeoutCallback) {
      this.timeoutCallback();
      return;
    }
    // 断网
    if (_.includes(error.message, 'Network Error')) {
      this.dispatch(
          ACTIONS.BASE.openAlert({
            title: '网络连接中断',
            content: '网络连接已断开，请检查您的网络',
            btnText: '刷新页面',
            type: PopupTypeEnum.ALERT3,
            cb: () => location.reload(),
          }),
      );
      return;
    }
    // 超时
    if (_.includes(error.message, 'timeout')) {
      // GET请求自动重试
      if (this.request.method === 'GET') {
        // 到达最大重试次数
        if (this.retry == this.maxRetry) {
          return;
        }
        // 重试提示
        if (this.retry < this.maxRetry) {
          this.dispatch(
              ACTIONS.BASE.openToast({text: `'网络慢，重试中'（${md5(this.key).substr(0, 4)}）`, types: 'error'}),
          );
          this.sendHttp({callback: this.callback});
          this.retry++;
        }
      }
      // POST, PUT 需要用户自主选择是否重新提交
      if (_.includes(['POST', 'PUT'], this.request.method)) {
        this.dispatch(
            ACTIONS.BASE.openConfirm({
              title: '确认',
              content: '网络慢未收到服务器应答，是否要重试？',
              actions: [
                {
                  text: '重试',
                  // cb: () => this.sendHttp({callback: this.callback}),
                  cb: () => location.reload(),
                },
              ],
            }),
        );
      }
    }
    // 登录超时错误，被踢下线，禁止登录等
    if (
      _.includes(error.message, EResponseErrors.NO_AUTH) ||
      _.includes(error.message, EResponseErrors.KICKED) ||
      _.includes(error.message, EResponseErrors.REJECT)
    ) {
      this.dispatch(ACTIONS.BASE.openToast({text: '登录已过期，请重新登录', types: 'error'}));
      this.dispatch(ACTIONS.USER.logout());
      return;
    }
    // 请求太频繁
    if (error.message === EResponseErrors.TOO_MANY_REQ) {
      this.dispatch(ACTIONS.BASE.openToast({text: '请求太频繁，请稍后再试', types: 'error'}));
      return;
    }
    // 重复提交
    if (error.message === EResponseErrors.SAME_REQ) {
      return;
    }
    // 其他错误
    throw Error(error.message);
  };
}
