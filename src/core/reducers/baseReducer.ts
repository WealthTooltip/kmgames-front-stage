/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/reducers/baseReducer.ts
 * @Description: 基础状态
 */
import TYPES from '@core/types/index';
import initialState from './initialState';

export default function base(state = initialState.base, action: any) {
  switch (action.type) {
    // 打开 LOADING
    case TYPES.BASE.LOADING_OPEN: {
      const update = {
        display: true,
        text: action.text || null,
      };
      return {...state, loading: update};
    }
    // 关闭 LOADING
    case TYPES.BASE.LOADING_CLOSE: {
      const update = {
        display: false,
        text: '',
      };
      return {...state, loading: update};
    }
    // 打开 Toast
    case TYPES.BASE.TOAST_OPEN: {
      const update = {
        types: action.types,
        text: action.text,
      };
      return {...state, toast: update};
    }
    // 打开弹出层 MODAL
    case TYPES.BASE.MODAL_OPEN: {
      const {
        title, content, actions, type, top,
      } = action.options;
      const update = {
        display: true,
        title,
        content,
        top,
        type,
        actions,
      };
      return {...state, modal: update};
    }
    // 关闭弹出层 MODAL
    case TYPES.BASE.MODAL_CLOSE: {
      const update = {
        display: false,
      };
      return {...state, modal: update};
    }
    // 更新服务器时间
    case TYPES.BASE.UPDATE_SERVER_TIME: {
      return {...state, serverTime: action.data};
    }
    case TYPES.BASE.TOGGLE_FULLSCREEN: {
      return {...state, fullScreen: !state.fullScreen};
    }
    case TYPES.BASE.UPDATE_IS_INSIDE_MATCH_LIST: {
      return {...state, isInsideMatchList: action.data};
    }
    case TYPES.BASE.TOGGLE_MOBILE_ORDER_HISTORY: {
      return {...state, mobile: action.data};
    }
    case TYPES.BASE.SET_SERIER_WAY: {
      return {...state, toggleSeries: action.data};
    }
    // 登出
    case TYPES.USER.LOGOUT: {
      return initialState;
    }
    // 清空导航数据
    default:
      return state;
  }
}
