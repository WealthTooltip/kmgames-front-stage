/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/actions/userAction.ts
 * @Description: 用户相关的ACTIONS
 */
import {ERequestMethods} from '@core/middleware/_httpMiddlewareTypes';
import TYPES from '@core/types';
import {IProps, IResAPI, IResBase} from './_actionTypes.d';

// 登录
export const login = ({data, cb}: IProps): IResAPI => ({
  type: TYPES.USER.LOGIN,
  payload: {
    key: 'user/login',
    data,
    method: ERequestMethods.POST,
    loading: true,
  },
  cb,
});

// 设置TOKEN
export const setToken = ({data}: IProps): IResBase => ({
  type: TYPES.USER.SET_TOKEN,
  token: data,
});

// 注册
export const register = ({data, cb} :IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'user/register', data, method: ERequestMethods.POST, loading: true,
  },
  cb,
});

// 获取用户个人信息
export const getUserInfo = ({cb}: IProps): IResAPI => ({
  type: TYPES.USER.GET_USER_INFO,
  payload: {
    key: 'user/get-user-info',
    method: ERequestMethods.GET,
  },
  cb,
});

export const userAutoLogin = ({cb}: IProps): IResAPI => ({
  type: TYPES.USER.GET_USER_INFO,
  payload: {
    key: 'user/auto-login',
    method: ERequestMethods.POST,
  },
  cb,
});

// 注销登出
export const logout = (): IResBase => ({
  type: TYPES.USER.LOGOUT,
});

// 设置盘口类型
export const setOddType = ({data}: IProps): IResAPI => ({
  type: TYPES.USER.SET_CURRENT_ODDTYPE,
  payload: data,
});

// 设置网页主题色
export const setTheme = ({data}: IProps): IResAPI => ({
  type: TYPES.USER.SET_THEME,
  payload: data,
});
