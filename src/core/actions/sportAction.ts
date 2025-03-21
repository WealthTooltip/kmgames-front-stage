/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:53:30
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/actions/sportAction.ts
 * @Description: 体育相关
 */
// import * as BASE_ACTIONS from '@actions/baseAction';
import {TUserSettings, TGuardQuerys, TDisplayTypes, TGameResultPageInfo} from '@core/reducers/_reduxStore.d';
import {TOrder} from '@core/services/Table';
import {ERequestMethods} from '@core/middleware/_httpMiddlewareTypes';
import * as ESport from '@constants/enum/sport';
import TYPES from '@core/types';
import {mapMatchDetailStatistics} from '@core/services/dataPurification';
import {IProps, IResAPI, IResBase} from './_actionTypes.d';
import G from '@constants/global';
import errorCodeMap from '@core/middleware/msgCode';
import ACTIONS from '@actions/index';
import {Series} from '@core/apis/models/dashboard/get-betting-record';

// 获取赛事统计
export const getMatchStatistics = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.SPORT.GET_MATCH_STATISTICS,
  payload: {
    key: ESport.EPollIntervalGuardKeys.MATCH_STATISTICS,
    method: ERequestMethods.GET,
    params,
    // mock: mocks.matchStatistics(),
  },
  cb,
});

// 设置各类轮询的条件
export interface ISetPollIntervalGuard extends IProps {
  key: ESport.EPollIntervalGuardKeys;
  event: ESport.EPollIntervalGuardEvent;
  querys?: TGuardQuerys;
  callback?: Function;
  payload?: any;
}
export const setPollIntervalGuard = ({key, event, querys, callback}: ISetPollIntervalGuard): IResBase => ({
  type: TYPES.SPORT.SET_POLL_INTERVAL_GUARD,
  key,
  event,
  querys,
  callback,
});
// 移除所有轮询守卫
export const removeAllPollIntervalGuard = (): IResBase => ({
  type: TYPES.SPORT.REMOVE_ALL_POLL_INTERVAL_GUARD,
});

// 赛事列表更新时间
export const updateMatchListUpdateTime = (tag?: number): IResBase => ({
  type: TYPES.SPORT.UPDATE_MATCH_LIST_UPDATE_TIME,
  tag,
});

// 详情更新时间
interface IUpdateMatchDetailUpdateTime extends IProps {
  tag?: number;
  matchId?: number;
}
export const updateMatchDetailUpdateTime = ({tag, matchId}: IUpdateMatchDetailUpdateTime): IResBase => ({
  type: TYPES.SPORT.UPDATE_MATCH_DETAIL_UPDATE_TIME,
  tag,
  matchId,
  relations: ({dispatch}) => {
    if (matchId) dispatch(getMatchDetailSta({matchId}));
  },
});

// 更新比赛统计更新时间
export const updateMatchStatisticsUpdateTime = (tag?: number): IResBase => ({
  type: TYPES.SPORT.UPDATE_MATCH_STATISTICS_UPDATE_TIME,
  tag,
});

// 更新用户设置
export const updateUserSettings = <K extends keyof TUserSettings>(key: K, value: TUserSettings[K]): IResBase => ({
  type: TYPES.SPORT.UPDATE_USER_SETTINGS,
  data: {key, value},
});

// 添加订单
export const addOrder = ({data}: {data: TOrder}): IResBase => ({
  type: TYPES.SPORT.ADD_ORDER,
  data,
});

// 删除订单
export const removeOrder = ({data}: IProps): IResBase => ({
  type: TYPES.SPORT.REMOVE_ORDER,
  data,
});

// 删除所有订单
export const removeAllOrder = (): IResBase => ({
  type: TYPES.SPORT.REMOVE_ALL_ORDER,
});

// show confirmed orders
export const showConfirmedOrder = (): IResBase => ({
  type: TYPES.SPORT.SHOW_CONFIRMED_ORDER,
});

// close confirmed orders
export const closeConfirmedOrder = (): IResBase => ({
  type: TYPES.SPORT.CLOSE_CONFIRMED_ORDER,
});

// close confirmed orders
export const addConfirmedOrders = (data:Array<TOrder>): IResBase => ({
  type: TYPES.SPORT.ADD_CONFIRMED_ORDERS,
  data,
});
// close confirmed orders
export const removeConfirmedOrders = (): IResBase => ({
  type: TYPES.SPORT.REMOVE_CONFIRMED_ORDERS,
});

// 修改订单
export const updateOrder = ({data}: IProps): IResBase => ({
  type: TYPES.SPORT.UPDATE_ORDER,
  data,
});

export const handleSettingMenu = (): IResBase => ({
  type: TYPES.SPORT.HANDLE_SETTING_MENU,
});

// open & close handicap-tutorial

export const handleHandicapTutorial = (): IResBase => ({
  type: TYPES.SPORT.HANDLE_HANDICAP_TUTORIAL,
});
export const switchVisiabelByDetail = (flag: boolean): IResBase => ({
  type: TYPES.SPORT.VISIABLE_DETAIL,
  data: flag,
});
// 修改订单单注金额
export interface IUpdateOrderMoney extends IProps {
  tag: string;
  money: string | number;
  overAmountLimit?: boolean;
}
export interface IUpdateOrderEditEnable extends IProps {
  tag: string;
  inReservationStatus?: boolean;
  reservationOdd?: number;
}
export const updateOrderMoney = ({tag, money, overAmountLimit = false}: IUpdateOrderMoney): IResBase => ({
  type: TYPES.SPORT.UPDATE_ORDER_MONEY,
  tag,
  money,
  overAmountLimit,
});
export const updateOrderReserve = ({tag, inReservationStatus, reservationOdd}: IUpdateOrderEditEnable): IResBase => ({
  type: TYPES.SPORT.UPDATE_ORDER_RESERVE,
  tag,
  inReservationStatus,
  reservationOdd,
});
export const updateOrderReserveOdd = ({tag, reservationOdd}: IUpdateOrderEditEnable): IResBase => ({
  type: TYPES.SPORT.UPDATE_ORDER_RESERVE_ODD,
  tag,
  reservationOdd,
});
// 修改列表显示状态
export const updateDisplayType = (displayType: TDisplayTypes): IResBase => ({
  type: TYPES.SPORT.UPDATE_DISPLAY_TYPE,
  data: displayType,
});

// Full Screen
export const updateDisplayFullScreen = (fullScreen: boolean): IResBase => ({
  type: TYPES.SPORT.UPDATE_DISPLAY_FULL_SCREEN,
  data: fullScreen,
});


// 修改是否大屏显示
export const updateDisplayZoomStatus = (zoomStatus: boolean): IResBase => ({
  type: TYPES.SPORT.UPDATE_DISPLAY_ZOOM_STATAUS,
  data: zoomStatus,
});

// 变更当前详情赛事
export interface IUpdateCurrentMatch extends IProps {
  matchId: number;
}
export const updateCurrentMatch = ({matchId}: IUpdateCurrentMatch): IResBase => {
  return {
    type: TYPES.SPORT.UPDATE_CURRENT_MATCH,
    matchId,
  };
};

// 获取赛事详情
export const getMatchDetail = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: ESport.EPollIntervalGuardKeys.MATCH_DETAIL,
    urlParams: [params.matchId],
    method: ERequestMethods.GET,
  },
  cb,
});

// 获取赛事统计详情
interface IGetMatchDetailSta extends IProps {
  matchId: number;
}
export const getMatchDetailSta = ({matchId}: IGetMatchDetailSta): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/get-match-detail-statistics',
    urlParams: [matchId],
    method: ERequestMethods.GET,
  },
  continue: ({res, dispatch}) => {
    if (res.data?.d) {
      const sData = JSON.parse(res.data.d);
      for (const key in sData) {
        if (Array.isArray(sData[key]) && !sData[key].length) delete sData[key];
      }
      const mData: any = mapMatchDetailStatistics(sData);
      for (const key in mData) {
        if ((Array.isArray(mData[key]) && !mData[key].length) || mData[key] === undefined) delete mData[key];
      }
      const data = {...G.GET('MATCH_STATISTICS'), ...mData};
      G.SET('MATCH_STATISTICS', data);
      dispatch(updateMatchStatisticsUpdateTime());
    } else {
      G.SET('MATCH_STATISTICS', null);
      dispatch(updateMatchStatisticsUpdateTime());
    }
  },
});

// 获取最新的赔率信息
export const getLatestOdds = ({data}: IProps): IResAPI => ({
  type: TYPES.SPORT.UPDATE_BETTING_ODDS,
  payload: {
    key: ESport.EPollIntervalGuardKeys.BETTING_ODDS,
    method: ERequestMethods.POST,
    data,
  },
});

// 提交订单
export const submitOrder = ({data, headers, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  passError: true,
  payload: {
    key: 'sport/submit-order',
    data,
    method: ERequestMethods.POST,
    loading: true,
    headers,
  },
  cb,
});

// 取消预约
export const cancelOrder = ({data, headers, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/cancel-order',
    data,
    method: ERequestMethods.POST,
    loading: true,
    headers,
  },
  cb,
});

// 下单令牌,防重复提单
export const getBetorderToken = ({data, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/betorder-auth-order',
    data,
    method: ERequestMethods.POST,
    loading: true,
  },
  cb,
});

// 获取联赛列表
export const getLeagueList = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.SPORT.GET_LEAGUE_LIST,
  payload: {
    key: ESport.EPollIntervalGuardKeys.LEAGUE_STATISTICS,
    data: {
      ...params,
      qt: params.qt !== ESport.EMatchTypes.EARLY ? ESport.EMatchTypes.TODAY : params.qt,
      di: params.qt !== ESport.EMatchTypes.EARLY ? null : params.di,
    },
    method: ERequestMethods.POST,
  },
  cb,
});

// 更新联赛列表
export const updateLeagueList = ({data}: IProps): IResBase => ({
  type: TYPES.SPORT.UPDATE_LEAGUE_LIST,
  data,
});

// 变更当前选中的联赛Id
export interface IUpdateCurrentLeagueId extends IProps {
  matchType?: ESport.EMatchTypes;
  id: number;
}
export const toggleSelectLeague = ({matchType, id}: IUpdateCurrentLeagueId): IResBase => ({
  type: TYPES.SPORT.UPDATE_CURRENT_LEAGUE_ID,
  matchType,
  id,
});

export const removeAllSelectLeague = (): IResBase => ({
  type: TYPES.SPORT.REMOVE_ALL_CURRENT_LEAGUE_ID,
});

// 获取比赛额外信息
export const getExtMatchInfos = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/get-video-source-list',
    params: {...params, sid: 5},
    method: ERequestMethods.GET,
    fieldFix: [{old: 'st1', new: 'code'}],
    dataFix: [{key: 'code', old: 1, new: 0}],
  },
  cb,
});

// 获取比赛视频信息
export const getMatchVideos = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/get-match-video',
    method: ERequestMethods.GET,
    params: {...params, sid: 5},
    fieldFix: [{old: 'st1', new: 'code'}],
    dataFix: [{key: 'code', old: 1, new: 0}],
  },
  cb,
});

// 收藏比赛
export const addFavorites = (data: number[]): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  relations: ({dispatch}) => {
    dispatch(setFavoriteMatchIds({operation: 'add', ids: data}));
  },
  payload: {
    key: 'sport/match-favorites-add',
    method: ERequestMethods.POST,
    data: data,
  },
  passError: true,
  continue: ({res, dispatch}) => {
    if (res.code !== 0) {
      // 回滚
      dispatch(ACTIONS.BASE.openToast({text: errorCodeMap[Number(res.code)] || res.msg, types: 'error'}));
      dispatch(
          setFavoriteMatchIds({
            operation: 'del',
            ids: data,
          }),
      );
    }
  },
});

// 取消收藏比赛
export const delFavorites = (data: number[]): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  relations: ({dispatch}) => {
    dispatch(setFavoriteMatchIds({operation: 'del', ids: data}));
  },
  payload: {
    key: 'sport/match-favorites-del',
    method: ERequestMethods.POST,
    data: data,
  },
  passError: false,
  continue: ({res, dispatch}) => {
    if (res.code !== 0) {
      // 回滚
      dispatch(ACTIONS.BASE.openToast({text: errorCodeMap[Number(res.code)] || res.msg, types: 'error'}));
      dispatch(
          setFavoriteMatchIds({
            operation: 'add',
            ids: data,
          }),
      );
    }
  },
});

// 获取用户收藏列表
export const getFavorites = (): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/match-favorites-list',
    method: ERequestMethods.POST,
  },
  continue: ({res, dispatch}) => {
    dispatch(
        setFavoriteMatchIds({
          operation: 'set',
          ids: _.chain(res.data)
              .map('matchIds')
              .flatten()
              .map((i) => Number(i))
              .value(),
        }),
    );
  },
});

// 设置用户收藏列表
export interface ISetFavoriteMatchIds extends IProps {
  ids: number[];
  operation: 'add' | 'del' | 'set';
}
export const setFavoriteMatchIds = ({ids, operation}: ISetFavoriteMatchIds): IResBase => ({
  type: TYPES.SPORT.SET_FAVORITE_MATCH_IDS,
  ids,
  operation,
});

// 更新今日组信息
export const setEarlyGroupData = ({data}: IProps): IResBase => ({
  type: TYPES.SPORT.SET_EARLY_GROUP_DATA,
  data,
});

// 根据联赛ids获取赛事列表
interface IGetMatchListByLeagueIds extends IProps {
  data: {
    qt: ESport.EMatchTypes;
    leagueIds: number[];
    sportId: number;
    di?: number;
    sortBy?: ESport.ESortBy;
    category?: ESport.EGameType;
  };
}
export const getMatchListByLeagueIds = ({data, cb}: IGetMatchListByLeagueIds): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/get-match-list-by-league-ids',
    method: ERequestMethods.POST,
    data: {
      ...data,
      qt: data.qt !== ESport.EMatchTypes.EARLY ? 'today' : data.qt,
      di: data.qt !== ESport.EMatchTypes.EARLY ? null : data.di,
    },
  },
  cb,
});

// 根据比赛Ids获取赛事列表
interface IGetMatchListByMatchIds extends IProps {
  data: number[];
}
export const getMatchListByMatchIds = ({data, cb}: IGetMatchListByMatchIds): IResAPI => ({
  type: TYPES.BASE.HTTP_ONLY,
  payload: {
    key: 'sport/get-match-list-by-match-ids',
    method: ERequestMethods.POST,
    data,
  },
  cb,
});

// 通过赛事类型获取早盘数量
export const getEarlyGroupCount = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.SPORT.GET_EARLY_GROUP_COUNT,
  payload: {
    key: 'sport/get-early-market-data',
    method: ERequestMethods.GET,
    params,
  },
  cb,
});

// 全屏显示
export const toggleFullScreen = ({data}: IProps): IResBase => ({
  type: TYPES.SPORT.SET_FULLSCREEN,
  data,
});

// 获取赛果列表
export const getGameResultList = ({params, cb}: IProps): IResAPI => {
  return ({
    type: TYPES.SPORT.GET_GAME_RESULT_LIST,
    payload: {
      key: ESport.EPollIntervalGuardKeys.GAME_RESULT_STATISTICS,
      data: params,
      method: ERequestMethods.POST,
    },
    cb,
  });
};

// 获取一个赛果信息
export const getGameResultDetail = ({params, cb}: IProps): IResAPI => ({
  type: TYPES.SPORT.GET_GAME_RESULT_DETAIL,
  payload: {
    key: ESport.ENonPollKeys.GAME_RESULT_DETAIL,
    params,
    method: ERequestMethods.GET,
  },
  cb,
});

// 改修賽果頁面渲染信息
export const updateGameResultPageInfo = (pageInfo: TGameResultPageInfo) => {
  return ({
    type: TYPES.SPORT.UPDATE_GAME_RESULT_PAGE_INFO,
    res: pageInfo,
  });
};

export const resetGameResultPageInfo = () => {
  return ({
    type: TYPES.SPORT.RESET_GAME_RESULT_PAGE_INFO,
  });
};

/** 修改当前路径地址 */
export const updatePagePath = (data: string) => ({
  type: TYPES.SPORT.UPDATE_PAGE_PATH,
  data,
});
/** 修改当前路径地址 */
export const updateSeriseData = (data: Array<Series>) => ({
  type: TYPES.SPORT.UPDATE_SERISE,
  data,
});
