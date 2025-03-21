/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/actions/baseAction.ts
 * @Description: 基础类
 */
import {ERequestMethods, IPayload, ICache} from '@core/middleware/_httpMiddlewareTypes';
import {$t} from '@helpers/i18n';
import TYPES from '@core/types';
import {IResBase, IResAPI, IProps} from './_actionTypes.d';
import {PopupTypeEnum} from '@core/constants/enum/common';

// 打开LOADING
export const openLoading = ({text = ''}: { text?: String } = {}): IResBase => ({
  type: TYPES.BASE.LOADING_OPEN,
  text,
});

// 关闭LOADING
export const closeLoading = (): IResBase => ({
  type: TYPES.BASE.LOADING_CLOSE,
});

// 关闭弹出层
export const closeModal = (): IResBase => ({
  type: TYPES.BASE.MODAL_CLOSE,
});

export const toggleFullScreen = (): IResBase => ({
  type: TYPES.BASE.TOGGLE_FULLSCREEN,
});

// 打开Toast
interface IOpenToast{
  text: string,
  types?: 'info' | 'success' | 'error'
}
export const openToast = ({text = '', types = 'info'}: IOpenToast): IResBase => ({
  type: TYPES.BASE.TOAST_OPEN,
  types,
  text,
});

// 打开弹出层
interface IAlert {
  title?: string,
  content: string | object | Array<string>, // HTML 文本内容，可以是字符串，也可以是DOM
  btnText?: string,
  type?: number,
  keepOpen?: boolean, // 点击按钮后保持打开
  cb?: Function,
  className?:string
}
export const openAlert = ({
  title = $t('温馨提示'), content, className = '', keepOpen = false, btnText = $t('我知道了'), cb, type,
}: IAlert): IResBase => ({
  type: TYPES.BASE.MODAL_OPEN,
  options: {
    title,
    content,
    type,
    className,
    actions: [{
      text: btnText,
      keepOpen,
      cb,
    }],
  },
});

// 打开确认框
interface IConfirm extends IAlert{
  actions: Array<{
    text: string,
    type?: 'default' | 'cancel' | 'destructive',
    keepOpen?: boolean // 点击按钮后保持打开
    cb?: Function
  }>
}
export const openConfirm = ({title = '确认', content, actions}: IConfirm): IResBase => ({
  type: TYPES.BASE.MODAL_OPEN,
  options: {
    title,
    content,
    type: PopupTypeEnum.CONFIRM,
    actions: actions.length === 1 ? _.concat({text: '取消', type: 'cancel'}, actions) : actions,
  },
});

/**
 * @description: 通用请求，仅用于一次性请求，动态请求，并且不操作store
 * @param {string} uri
 */
interface ICommonRequest extends IPayload {
  uri: string
}
export const commonRequest = ({
  uri, cache, data, method = ERequestMethods.GET, loading = false, ...params
}: ICommonRequest): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'base/common-request', urlParams: [uri], data, cache, method, loading,
  },
  ...params,
});

/**
 * 请求示例，使用 https://www.free-api.com/use/626
 * @param param0
 * @returns
 */
interface IReqDemo extends IProps {
  cache?: ICache,
  mock?: any,
  passError?: boolean
}
export const requestDemo = ({
  loading, cache, mock, passError = false, cb,
}: IReqDemo): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'base/demo', mock, cache, method: ERequestMethods.GET, loading,
  },
  passError,
  cb,
});


export const updateServerTime = ({data}: IProps): IResBase => ({
  type: TYPES.BASE.UPDATE_SERVER_TIME,
  data,
});

export const updateIsInsideMatchList = (isInside: boolean): IResBase => ({
  type: TYPES.BASE.UPDATE_IS_INSIDE_MATCH_LIST,
  data: isInside,
});
export const toggleMobileOrderHistory = (navigation: number, orderHistoryStatus: number): IResBase => ({
  type: TYPES.BASE.TOGGLE_MOBILE_ORDER_HISTORY,
  data: {
    navigation,
    orderHistoryStatus,
  },
});
// 切换串关
export const toggleSerierWay = ({data}: IProps): IResBase => ({
  type: TYPES.BASE.SET_SERIER_WAY,
  data,
});
