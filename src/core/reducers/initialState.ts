/*
 * @Description: REDUX 初始化状态
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2024-01-16 17:47:05
 * @LastEditors: Galen.GE
 */
import {ETHEME} from '@views/kmg/desktop/configs';
import storage from '@helpers/storage';
import * as ESport from '../constants/enum/sport';
import ESportsCategory from '@constants/enum/sport/sportsCategory';
import TStore, {TBase, TUser, TSport} from './_reduxStore.d';
import dayjs from 'dayjs';
import {dateFormat} from '@views/kmg/desktop/components/DateRangePicker';

const base: TBase = {
  loading: {display: false},
  modal: {display: false},
  toast: {types: 'info', text: ''},
  fullScreen: false,
  serverTime: _.now(),
  isInsideMatchList: true,
  toggleSeries: false,
  mobile: {
    navigation: -1,
    orderHistoryStatus: -1,
  },
};

const user: TUser = {
  token: null,
  info: {
    userName: 'GUEST',
    totalBalance: 0,
    orderCount: 0,
  },
  currentOddType: storage.get('ODD_TYPE') || 1,
  theme: storage.get('CUR_THEME') ?? ETHEME.LIGHT,
};

const sport: TSport = {
  pollIntervalGuard: {},
  isVisiableDetail: false,
  display: {
    matchStatistics: ESportsCategory.map((i) => ({sportId: i.sportId, sportName: i.name, count: 0})),
    leagueStatistics: [],
    matchListUpdateTime: 0,
    detailUpdateTime: 0,
    detailStatisticsUpdateTime: 0,
    matchSourceList: [],
    displayType: 'skeleton',
    currentMatchId: null,
    currentLeagueId: null,
    earlyGroup: [],
    fullScreen: false,
    zoomStatus: false,
    di: 0,
    favoriteIds: [],
    gameResultStatistics: [],
    gameResultDetail: {details: []},
    pagePath: '/',
  },
  userSettings: {
    matchType: ESport.EMatchTypes.IN_PLAY,
    sportId: ESport.ESportType.FOOTBALL,
    sid: ESport.EESportType.LOL,
    gameBettingType: storage.get('CUR_GAME_BETTING_TYPE') ?? null,
    sortBy: ESport.ESortBy.TIME,
    collapseLeagueIds: [],
    gameResultPageInfo: {
      sportId: 1,
      pageNum: 1,
      pageSize: 10,
      beginTime: dayjs().subtract(7, 'day').format(dateFormat),
      endTime: dayjs().format(dateFormat)},
  },
  bet: {
    orders: {},
    orderTags: [],
    confirmOrders: [],
  },
  settingMenu: {
    isOpen: false,
  },
  handicaptutorial: {
    isClicked: false,
  },
  seriesList: [],
};

const store: TStore = {
  base,
  user,
  sport,
};

export default store;
