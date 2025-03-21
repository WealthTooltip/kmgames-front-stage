/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13 18:37:02
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/actions/_actionTypes.d.ts
 * @Description:
 */
import {Dispatch} from 'redux';
import {IPayload} from '@core/middleware/_httpMiddlewareTypes';
import {ISetPollIntervalGuard, IUpdateOrderMoney, IUpdateCurrentMatch, ISetFavoriteMatchIds, IUpdateCurrentLeagueId, IUpdateOrderEditEnable} from './sportAction';
import TStore from '@core/reducers/_reduxStore';

export interface IProps {
  type? : string,
  params? : any,
  data? : any,
  urlParams? : Array<string> // url参数
  cb? : Function, // 视图层回调
  loading? : boolean, // 是否显示loading
  headers?:{[any:string]: string} | null,
}

export interface IResBase {
  type : string,
  relations? : ({dispatch, store}: { dispatch: Dispatch, store: TStore }) => void, // 联动actoins
  [key : string]: any
}

export interface IResAPI extends IResBase {
  payload : IPayload,
  cb? : Function, // 视图层回调
  passError? : boolean, // 不由框架处理错误，通过回调处理
  continue? : ({res, dispatch}: { res: any, dispatch: Dispatch }) => void// action 层回调
}

export type sportActionTypes = ISetPollIntervalGuard &
                               IUpdateOrderMoney &
                               IUpdateOrderEditEnable &
                               IUpdateCurrentMatch &
                               ISetFavoriteMatchIds &
                               IUpdateCurrentLeagueId &
                               { res: any }
