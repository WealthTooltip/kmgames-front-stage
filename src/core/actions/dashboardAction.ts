/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:53:30
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 * @FilePath: /KMG/src/core/actions/sportAction.ts
 * @Description: 报表相关
 */

import {ERequestMethods} from '@core/middleware/_httpMiddlewareTypes';
// import * as mocks from '@mocks/sports/index';
import TYPES from '@core/types';
import {IProps, IResAPI} from './_actionTypes';

// 获取历史注单信息
export const getSportBetRecord = ({data, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'dash/get-betting-record',
    data,
    method: ERequestMethods.POST,
    cache: {expires: 5 * 60, forward: true},
  },
  cb,
});
// 获取历史注单信息
export const getSportBetHistory = ({data, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'dash/get-betting-history',
    data,
    method: ERequestMethods.POST,
    cache: {expires: 5 * 60, forward: true},
  },
  cb,
});
// 获取历史注单信息
export const getReservationLength = ({cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'dash/get-betting-reserve-length',
    data: {
      pageNum: 1,
      pageSize: 50,
      isReserve: '1',
    },
    method: ERequestMethods.POST,
    cache: {expires: 5 * 60, forward: true},
  },
  cb,
});
