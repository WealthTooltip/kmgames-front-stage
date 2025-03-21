/*
 * @Description: 用户相关状态管理
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-15 15:56:49
 * @LastEditors: Passion.KMG
 */

import TYPES from '@core/types/index';
import store from '@helpers/storage';
import initialState from './initialState';

export default function user(state = initialState.user, action: any) {
  switch (action.type) {
    // 设置TOKEN
    case TYPES.USER.SET_TOKEN: {
      store.set('AUTH', action.token);
      sessionStorage.setItem('token', action.token);
      return {...state, token: action.token};
    }
    // 个人信息
    case TYPES.USER.GET_USER_INFO: {
      return {...state, info: action.res};
    }
    case TYPES.USER.LOGOUT: {
      store.remove('AUTH');
      store.remove('USER-PROFILE');
      store.remove('CUR_GAME_BETTING_TYPE');
      return initialState.user;
    }
    case TYPES.USER.SET_CURRENT_ODDTYPE: {
      store.set('ODD_TYPE', action.payload);
      return {...state, currentOddType: action.payload};
    }
    case TYPES.USER.SET_THEME: {
      store.set('CUR_THEME', action.payload);
      return {...state, theme: action.payload};
    }
    default:
      return state;
  }
}
