/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/middleware/request.ts
 * @Description: 请求中间件
 */

import {IResAPI} from '@core/actions/_actionTypes';
import storage from '@helpers/storage';
import ACTIONS from '@actions/index';
import {HTTP} from './httpUnit';
import errorCodeMap from './msgCode';

export default (store: any) => (next: any) => (action: IResAPI) => {
  if (!action.payload || !action.payload.key) {
    return next(action);
  }

  // 请求实例
  const requestIns = new HTTP({...action.payload, cb: action.cb}, store.dispatch);

  // 先取缓存
  const resCache = storage.getAny(requestIns.cacheKey());
  if (requestIns.isCache() && (resCache && !action.payload.mock)) {
    // 缓存非绑定用户，或者绑定用户与当前用户一致
    if (resCache || (!requestIns.getCache()?.isUserBind || (_.get(resCache, '__USERID__') == store.getState().user.info?.UserId) && !requestIns.getCache()?.cacheClear)) {
      // reducers
      next({
        ...action,
        res: resCache.data,
      });
      // callbacks
      typeof action.cb === 'function' && action.cb(storage.getAny(requestIns.cacheKey()), action);
      // 是否追加下一次请求
      if (!requestIns.getCache().forward) {
        return;
      }
    }
  }

  // 发送请求
  requestIns.sendHttp({
    mock: action.payload.mock,
    callback: (data: any) => {
      // 错误处理
      if (data.code !== 0 && !action.passError) {
        store.dispatch(ACTIONS.BASE.openToast({text: errorCodeMap[Number(data.code)] || data.msg, types: 'error'}));
        return;
      }
      // 缓存（仅支持在接口正常情况下缓存数据）
      if (requestIns.isCache() && data.code === 0 && !action.payload.mock) {
        const extendUserBind = requestIns.getCache()?.isUserBind ? {__USERID__: store.getState().user.info?.UserId} : {};
        storage.setAny(
            requestIns.cacheKey(),
            {...data, ...extendUserBind},
            requestIns.getCache()?.expires || 3600,
        );
      }
      if (data.ts) {
        next(ACTIONS.BASE.updateServerTime({data: data.ts}));
      }
      // next
      next({
        ...action,
        res: data.data,
        response: data,
      });
      // ACTION层回调
      if (action.continue && typeof action.continue === 'function') {
        if (data.code !== 0) {
          store.dispatch(ACTIONS.BASE.openToast({text: errorCodeMap[Number(data.code)] || data.msg, types: 'error'}));
        }
        action.continue({res: data, dispatch: store.dispatch});
      }
      // 视图层回调
      if (action.cb && typeof action.cb === 'function') {
        action.cb(data, action, store.dispatch);
      }
    },
  });
};
