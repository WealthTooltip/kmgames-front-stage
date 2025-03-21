/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13 19:32:39
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/reducers/reduxStore.d.ts
 * @Description:
 */
// eslint-ignore Missing semicolon
import {ETHEME} from '@views/kmg/desktop/configs';
import {TMatch, TOrder} from '@core/services/Table';
import * as ESport from '../constants/enum/sport';
import {PopupTypeEnum} from '@core/constants/enum/common';
import {Series, TBettingOrder} from '@core/apis/models/dashboard/get-betting-record';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
import {TGameResultDetailItem, TGameResultVideoItem} from '@core/apis/models/sport/get-game-result';

// base 状态节点
export type TBase = {
  loading: {
    display: boolean;
    text?: string | null;
  };
  modal: {
    display: boolean;
    title?: string;
    content?: any;
    actions?: Array<any>;
    type?: PopupTypeEnum
  },
  toast: {
    types: 'info' | 'success' | 'error';
    text: string;
  },
  fullScreen: boolean;
  serverTime: number;
  isInsideMatchList: boolean;
  toggleSeries: boolean;
  mobile: {
    navigation: number;
    orderHistoryStatus: -1 | 0 | 1;
  }
};

export type TUser = {
  token?: string;
  info: {
    userName: string,
    totalBalance: number,
    orderCount: number,
  },
  currentOddType: ESport.EOddType;
  theme: ETHEME;
};

export type TMatchListQuery = {
  pageSize?: number;
  pageNum: number;
  leagueId?: number;
  qt: ESport.EMatchTypes;
  sortBy: ESport.ESortBy;
  sportId: ESport.ESportType | ESport.EESportType;
  di?: number;
}

export type TMatchListByLeagueIdsQuery = {
  qt: ESport.EMatchTypes;
  leagueIds: Array<number>;
  sportId: number;
  di: number;
}

// 类型联合
export type TGuardQuerys = TMatchListQuery | TMatchListByLeagueIdsQuery | Array<{ matchId: number; betItemsId: number }> | { qt: ESport.EMatchTypes } | { [key: string]: any }

export type TPollIntervalGuard = {
  key: string;
  status: ESport.EPollIntervalGuardStatus
  querys?: TGuardQuerys
  callback?: Function,
  seed?: number
};

// 联赛表
export type TLeague = {
  // 联赛id
  leagueId: number;
  // 联赛名称
  leagueName: string;
  // 联赛图标
  leagueIcon: string;
  // 是否收藏
  isFavorite?: boolean;
  // 赛事ID
  sportId: number;
}

export type TMatchStatistic = {
  sportId: number;
  sportName: string;
  count: number;
}

export type TLeagueStatistic = TLeague & {
  // 数量
  count: number;
  countGroup: {
    [key in ESport.EMatchTypes]?: number;
  },
  // 状态
  state?: ESport.EMatchTypes;
  matchIds: {
    [key in ESport.EMatchTypes]?: number[];
  }
  allMatchIds: number[];
  eids: number[];
}

/**
 * Types for Game Result Data
 */
export type TGameResultCommon = {
  // League Name 联赛名称
  ln: string;
  // Match Id 赛事id
  mid: number;
  // Match Name 赛事名称
  mn: string[];
  // Begin Time 开始事件
  bt: string;
};

export type TGameResultGoal = {
  [EGameResult.Q1G]: number[];
  [EGameResult.Q2G]: number[];
  [EGameResult.Q3G]?: number[];
  [EGameResult.Q4G]?: number[];
  [EGameResult.FTG]: number[];
  [EGameResult.OTG]: number[];
  [EGameResult.FG]: number[];
};

export type TGameFootballDetail = Omit<TGameResultGoal, EGameResult.Q3G | EGameResult.Q4G> & {
  // Red Card 红牌
  [EGameResult.H1RC]: number[];
  [EGameResult.H2RC]: number[];
  [EGameResult.FTRC]: number[];
  // Yellow Card 黄牌
  [EGameResult.H1YC]: number[];
  [EGameResult.H2YC]: number[];
  [EGameResult.FTYC]: number[];
  // Corner Kick 角球
  [EGameResult.H1CK]: number[];
  [EGameResult.H2CK]: number[];
  [EGameResult.FTCK]: number[];
};

export type TGameBasketBallDetail = Omit<TGameResultGoal, EGameResult.FTG | EGameResult.OTG>;

export type TGameResultStatistic = TGameResultCommon & {
  details: TGameFootballDetail | TGameBasketBallDetail
};

// 賽果列表頁面參數
export type TGameResultPageInfo = {
  sportId?: number;
  beginTime?: string;
  endTime?: string;
  leagueName?: string;
  matchName?: string;
  pageNum?: number;
  pageSize?: number;
  ip?: number;
}
/**
 * End of Types for Game Result Data
 */

export type TSport = {
  pollIntervalGuard: { [key in ESport.EPollIntervalGuardKeys]?: TPollIntervalGuard };
  isVisiableDetail: boolean;
  display: {
    matchStatistics: Array<TMatchStatistic>;
    leagueStatistics: Array<TLeagueStatistic>;
    gameResultStatistics: Array<TGameResultStatistic>;
    gameResultDetail: {details: Array<TGameResultDetailItem>} & {videos?: Array<TGameResultVideoItem>};
    matchListUpdateTime: number;
    detailUpdateTime: number;
    detailStatisticsUpdateTime: number;
    displayType: 'skeleton' | 'empty' | 'list';
    currentMatchId?: number;
    currentLeagueId?: Array<{key: ESport.EMatchTypes, id: number}>;
    matchSourceList: any[];
    earlyGroup: number[];
    di: number;
    fullScreen: boolean;
    zoomStatus: boolean;
    favoriteIds: number[];
    pagePath: string;
  },
  userSettings: {
    matchType: ESport.EMatchTypes;
    sportId: ESport.ESportType | ESport.EESportType;
    sid: ESport.EESportType;
    gameBettingType: ESport.EGameBettingType | null;
    sortBy: ESport.ESortBy;
    collapseLeagueIds: Array<string>;
    gameResultPageInfo: TGameResultPageInfo;
    gameResultPageTotal?: number;
  };
  bet: {
    orders: { [key: string]: TOrder },
    orderTags: Array<string>,
    confirmOrders: Array<TBettingOrder>
  },
  settingMenu: {
    isOpen: boolean,
  },
  handicaptutorial: {
    isClicked: boolean,
  },
  seriesList: Array<Series>
}

// 用户设置
export type TUserSettings = TSport['userSettings'];

// 显示状态
export type TDisplayTypes = TSport['display']['displayType'];

// 赛事统计
export type TMatchStatistics = TSport['display']['matchStatistics'];

// 入口 以下不校验ESLINT
export type TStore = {
  base: TBase;
  user: TUser;
  sport: TSport;
}

export default TStore;
