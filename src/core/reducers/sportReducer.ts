/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:53:53
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/reducers/sportReducer.ts
 * @Description:
 */
import * as ESport from '@constants/enum/sport';
import TYPES from '@core/types/index';
import {multiplyAndFix} from '@helpers/unit';
import {mapMatchStatistics, mapBettingOdds, mapLeagueStatistics, mapGameResultStatistics} from '@core/services/dataPurification';
import {sportActionTypes} from '@actions/_actionTypes.d';
import {getViewOddFn} from '@core/hooks/sports/useOddTransfer';
import {findLeagueIdsWithCountGreaterThanN} from '@helpers/unit';
import initialState from './initialState';
import {TSport} from './_reduxStore.d';
import {subtractDecimals} from '@core/utils/math';
import CONFIG from '@this/configs';
import store from '@helpers/storage';
import {initGameResultPageInfo} from '@core/hooks/sports/useGamesResultInit';
import storage from '@core/helpers/storage';

export default function user(state = initialState.sport, action: sportActionTypes): TSport {
  switch (action.type) {
    // 比赛统计
    case TYPES.SPORT.GET_MATCH_STATISTICS: {
      return {
        ...state,
        display: {
          ...state.display,
          matchStatistics: mapMatchStatistics(action.res),
        },
      };
    }
    /** 设置轮询守卫 */
    case TYPES.SPORT.SET_POLL_INTERVAL_GUARD: {
      const {pollIntervalGuard} = state;
      // 增加轮询守卫
      if (ESport.EPollIntervalGuardEvent.ADD === action.event) {
        if (pollIntervalGuard[action.key]) {
          console.warn(`轮询守卫${action.key}已存在`);
          return state;
        }
        return {
          ...state,
          pollIntervalGuard: {
            ...pollIntervalGuard,
            [action.key]: {
              key: action.key,
              status: ESport.EPollIntervalGuardStatus.RUNNING,
              querys: action.querys,
              callback: action.callback ? action.callback : null,
            },
          },
        };
      }
      // 其他操作都需要验验证守卫是否存在
      if (!pollIntervalGuard[action.key]) {
        console.warn(`轮询守卫${action.key}不存在`);
        return state;
      }
      // 暂停, 运行轮询守卫
      if (
        ESport.EPollIntervalGuardEvent.PAUSE === action.event ||
        ESport.EPollIntervalGuardEvent.START === action.event
      ) {
        return {
          ...state,
          pollIntervalGuard: {
            ...state.pollIntervalGuard,
            [action.key]: {
              ...state.pollIntervalGuard[action.key],
              status:
                action.event === ESport.EPollIntervalGuardEvent.PAUSE ?
                  ESport.EPollIntervalGuardStatus.PAUSE :
                  ESport.EPollIntervalGuardStatus.RUNNING,
            },
          },
        };
      }
      // 删除轮询守卫
      if (ESport.EPollIntervalGuardEvent.REMOVE === action.event) {
        return {...state, pollIntervalGuard: _.omit(pollIntervalGuard, action.key)};
      }
      // 更新轮询守卫的querys
      if (ESport.EPollIntervalGuardEvent.UPDATE_QUERYS === action.event) {
        return {
          ...state,
          pollIntervalGuard: {
            ...state.pollIntervalGuard,
            [action.key]: {
              ...state.pollIntervalGuard[action.key],
              querys: {
                ...state.pollIntervalGuard[action.key].querys,
                ...action.querys,
              },
            },
          },
        };
      }
      return state;
    }
    // 移除所有轮询守卫
    case TYPES.SPORT.REMOVE_ALL_POLL_INTERVAL_GUARD: {
      return {...state, pollIntervalGuard: {}};
    }
    // 更新赛事列表更新时间
    case TYPES.SPORT.UPDATE_MATCH_LIST_UPDATE_TIME: {
      return {
        ...state,
        display: {
          ...state.display,
          matchListUpdateTime: !_.isUndefined(action.tag) ? (action as any).tag : _.now(),
        },
      };
    }
    // 更新详情更新时间
    case TYPES.SPORT.UPDATE_MATCH_DETAIL_UPDATE_TIME: {
      return {
        ...state,
        display: {
          ...state.display,
          detailUpdateTime: !_.isUndefined(action.tag) ? (action as any).tag : _.now(),
        },
      };
    }
    // 更新比赛统计更新时间
    case TYPES.SPORT.UPDATE_MATCH_STATISTICS_UPDATE_TIME: {
      return {
        ...state,
        display: {
          ...state.display,
          detailStatisticsUpdateTime: !_.isUndefined(action.tag) ? (action as any).tag : _.now(),
        },
      };
    }
    // 更新用户设置
    case TYPES.SPORT.UPDATE_USER_SETTINGS: {
      if (action.data.key === 'gameBettingType') {
        store.set('CUR_GAME_BETTING_TYPE', action.data.value);
      }

      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          [action.data.key]: action.data.value,
        },
      };
    }
    // 添加订单
    case TYPES.SPORT.ADD_ORDER: {
      // 找出mkId相同的订单, 如果有, 则先删除再添加
      const order = _.find(state.bet.orders, (item) => item.mkId === action.data.mkId);
      // 从state.bet.orders对象中移除订单
      const orders = _.omit(state.bet.orders, order ? order.tag : '');
      // 所有将被添加的新订单
      const newOrders = {...orders, [action.data.tag]: action.data};
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: newOrders,
          orderTags: order ?
            [action.data.tag, ..._.filter(state.bet.orderTags, (item) => item !== order.tag)] :
            [action.data.tag, ...state.bet.orderTags],
        },
        // 更新赔率轮询守卫
        pollIntervalGuard: {
          ...state.pollIntervalGuard,
          [ESport.EPollIntervalGuardKeys.BETTING_ODDS]: {
            ...state.pollIntervalGuard[ESport.EPollIntervalGuardKeys.BETTING_ODDS],
            key: ESport.EPollIntervalGuardKeys.BETTING_ODDS,
            status: ESport.EPollIntervalGuardStatus.RUNNING,
            querys: _.map(newOrders, (it) => ({
              matchId: it.matchId,
              betItemsId: Number(it.id),
            })),
          },
        },
      };
    }
    // 移除订单
    case TYPES.SPORT.REMOVE_ORDER: {
      // 移除后是否为空
      const isEmpty = _.isEmpty(_.omit(state.bet.orders, action.data.tag));
      // 被移除订单的id
      const {id} = state.bet.orders[action.data.tag];
      // 如果空订单，则移除轮询守卫
      let _pollIntervalGuard;
      if (isEmpty) {
        _pollIntervalGuard = _.omit(state.pollIntervalGuard, ESport.EPollIntervalGuardKeys.BETTING_ODDS);
      } else {
        // 更新轮询守卫的querys
        _pollIntervalGuard = {
          ...state.pollIntervalGuard,
          [ESport.EPollIntervalGuardKeys.BETTING_ODDS]: {
            ...state.pollIntervalGuard[ESport.EPollIntervalGuardKeys.BETTING_ODDS],
            querys: _.filter(
                state.pollIntervalGuard[ESport.EPollIntervalGuardKeys.BETTING_ODDS].querys,
                (item: any) => item.betItemsId !== Number(id),
            ),
          },
        };
      }
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: _.omit(state.bet.orders, action.data.tag),
          orderTags: _.filter(state.bet.orderTags, (item) => item !== action.data.tag),
        },
        pollIntervalGuard: _pollIntervalGuard,
      };
    }
    // 添加已提交确认的订单列表
    case TYPES.SPORT.ADD_CONFIRMED_ORDERS: {
      return {
        ...state,
        bet: {
          ...state.bet,
          confirmOrders: action.data,
        },
      };
    }
    // 移除已提交确认的订单列表
    case TYPES.SPORT.REMOVE_CONFIRMED_ORDERS: {
      return {
        ...state,
        bet: {
          ...state.bet,
          confirmOrders: [],
        },
      };
    }
    // 移除所有订单
    case TYPES.SPORT.SHOW_CONFIRMED_ORDER: {
      return {
        ...state,
        bet: {
          ...state.bet,
        },
      };
    }
    // 移除所有订单
    case TYPES.SPORT.CLOSE_CONFIRMED_ORDER: {
      return {
        ...state,
        bet: {
          ...state.bet,
        },
      };
    }
    // 移除所有订单
    case TYPES.SPORT.REMOVE_ALL_ORDER: {
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: {},
          orderTags: [],
        },
        // 移除赔率轮询守卫
        pollIntervalGuard: _.omit(state.pollIntervalGuard, ESport.EPollIntervalGuardKeys.BETTING_ODDS),
      };
    }
    // 更新订单
    case TYPES.SPORT.UPDATE_ORDER: {
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: {
            ...state.bet.orders,
            [action.data.tag]: {
              ...state.bet.orders[action.data.tag],
              ...action.data,
            },
          },
        },
      };
    }
    // 更新订单预约状态
    case TYPES.SPORT.UPDATE_ORDER_RESERVE: {
      const {od, reservationOdd, inReservationStatus, money} = state.bet.orders[action.tag];
      const viewOdd = getViewOddFn(inReservationStatus ? reservationOdd : od, inReservationStatus ? state.bet.orders[action.tag].currentOddType : state.bet.orders[action.tag].oddBetType, 1);
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: {
            ...state.bet.orders,
            [action.tag]: {
              ...state.bet.orders[action.tag],
              inReservationStatus: action.inReservationStatus,
              reservationOdd: action.reservationOdd,
              reservationMarkOdd: action.reservationOdd,
              reserveAlert: false,
              maxWin: subtractDecimals(multiplyAndFix(Number(money), Number(viewOdd)), Number(money)),
            },
          },
        },
      };
    }
    // 更新订单预约赔率
    case TYPES.SPORT.UPDATE_ORDER_RESERVE_ODD: {
      const viewOdd = getViewOddFn(action.reservationOdd, state.bet.orders[action.tag].currentOddType, 1);
      const money = state.bet.orders[action.tag].money;
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: {
            ...state.bet.orders,
            [action.tag]: {
              ...state.bet.orders[action.tag],
              reservationOdd: action.reservationOdd,
              reserveAlert: action.reservationOdd < state.bet.orders[action.tag].reservationMarkOdd,
              maxWin: subtractDecimals(multiplyAndFix(Number(money), Number(viewOdd)), Number(money)),
            },
          },
        },
      };
    }
    // 更新订单金额
    case TYPES.SPORT.UPDATE_ORDER_MONEY: {
      const {od, reservationOdd, inReservationStatus} = state.bet.orders[action.tag];
      const viewOdd = getViewOddFn(inReservationStatus ? reservationOdd : od, inReservationStatus ? state.bet.orders[action.tag].currentOddType : state.bet.orders[action.tag].oddBetType, 1);
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: {
            ...state.bet.orders,
            [action.tag]: {
              ...state.bet.orders[action.tag],
              money: Number(action.money),
              overAmountLimit: action.overAmountLimit,
              maxWin: subtractDecimals(multiplyAndFix(Number(action.money), Number(viewOdd)), Number(action.money)),
            },
          },
        },
      };
    }
    // 更新列表显示状态
    case TYPES.SPORT.UPDATE_DISPLAY_TYPE: {
      return {
        ...state,
        display: {
          ...state.display,
          displayType: action.data,
        },
      };
    }
    // Full Screen Mode
    case TYPES.SPORT.UPDATE_DISPLAY_FULL_SCREEN: {
      return {
        ...state,
        display: {
          ...state.display,
          fullScreen: action.data,
        },
      };
    }
    // 修改是否为大屏显示
    case TYPES.SPORT.UPDATE_DISPLAY_ZOOM_STATAUS: {
      return {
        ...state,
        display: {
          ...state.display,
          zoomStatus: action.data,
        },
      };
    }
    // 更新当前详情赛事
    case TYPES.SPORT.UPDATE_CURRENT_MATCH: {
      return {
        ...state,
        display: {
          ...state.display,
          currentMatchId: action.matchId ?? null,
        },
      };
    }
    // 更新投注栏赔率信息
    case TYPES.SPORT.UPDATE_BETTING_ODDS: {
      return {
        ...state,
        bet: {
          ...state.bet,
          orders: mapBettingOdds(action.res, state.bet.orders),
        },
      };
    }
    // 获取联赛列表
    case TYPES.SPORT.GET_LEAGUE_LIST: {
      const leagues = storage.get('LEAGUE_EXT_INFO') || {};
      const leagueStatistics = mapLeagueStatistics(action.res || [], state.userSettings.sportId);
      // 如果展开的联赛列表为空，则展开前N条
      let collapseLeagueIds: TSport['userSettings']['collapseLeagueIds'] = _.cloneDeep(
          state.userSettings.collapseLeagueIds,
      );
      // 所有当前列表的联赛Id
      collapseLeagueIds = collapseLeagueIds.filter((i) => _.includes(i, 'fav') ? i : leagueStatistics.find((j) => j.leagueId === Number(i.split('#')[1])));
      leagueStatistics.forEach((item) => {
        item.leagueIcon = leagues[item.leagueId] || '';
      });
      if (state.display.leagueStatistics.length === 0) {
        const leagueCollapse = findLeagueIdsWithCountGreaterThanN(
            leagueStatistics,
            CONFIG.SPORT.DEFAULT_EXPAND_MATCH_COUNT,
        );
        collapseLeagueIds = leagueCollapse.map((i) => `${i.state}#${i.id}`);
      }
      return {
        ...state,
        display: {
          ...state.display,
          leagueStatistics,
        },
        userSettings: {
          ...state.userSettings,
          collapseLeagueIds,
        },
      };
    }
    // 更新联赛列表
    case TYPES.SPORT.UPDATE_LEAGUE_LIST: {
      return {
        ...state,
        display: {
          ...state.display,
          leagueStatistics: action.data,
        },
      };
    }
    // 变更当前选中的联赛Id
    case TYPES.SPORT.UPDATE_CURRENT_LEAGUE_ID: {
      let currentLeagueId = _.cloneDeep(state.display.currentLeagueId) || [];
      if (_.find(currentLeagueId, {id: action.id, key: action.matchType})) {
        // 如果已经存在，则删除
        currentLeagueId = _.filter(currentLeagueId, (item) => item.id !== action.id || item.key !== action.matchType);
      } else {
        currentLeagueId.push({id: action.id, key: action.matchType});
      }
      // 展开收起的联赛列表
      const collapseLeagueIds = _.cloneDeep(state.userSettings.collapseLeagueIds);
      if (state.userSettings.matchType === ESport.EMatchTypes.EARLY) {
        collapseLeagueIds.push(`${ESport.EMatchTypes.UPCOMING}#${action.id}`);
      } else {
        if (action.matchType === ESport.EMatchTypes.IN_PLAY) {
          collapseLeagueIds.push(`${ESport.EMatchTypes.IN_PLAY}#${action.id}`);
        } else {
          collapseLeagueIds.push(`${ESport.EMatchTypes.UPCOMING}#${action.id}`);
        }
      }
      return {
        ...state,
        display: {
          ...state.display,
          currentLeagueId,
        },
        userSettings: {
          ...state.userSettings,
          collapseLeagueIds: _.uniq(collapseLeagueIds),
        },
      };
    }
    // 删除所有当前选中的联赛
    case TYPES.SPORT.REMOVE_ALL_CURRENT_LEAGUE_ID: {
      return {
        ...state,
        display: {
          ...state.display,
          currentLeagueId: null,
        },
      };
    }
    case TYPES.SPORT.GET_EARLY_GROUP_COUNT:
    case TYPES.SPORT.SET_EARLY_GROUP_DATA: {
      return {
        ...state,
        display: {
          ...state.display,
          earlyGroup: action.res,
        },
      };
    }
    case TYPES.USER.LOGOUT: {
      return {...initialState.sport};
    }
    case TYPES.SPORT.GET_SOURCE_LIST: {
      return {
        ...state,
        display: {
          ...state.display,
          matchSourceList: action.data,
        },
      };
    }
    // 设置收藏列表
    case TYPES.SPORT.SET_FAVORITE_MATCH_IDS: {
      let favoriteIds = _.cloneDeep(state.display.favoriteIds);
      if (action.operation === 'set') {
        favoriteIds = action.ids || [];
      }
      // 添加或删除
      if (action.operation === 'add') {
        favoriteIds = _.uniq([...favoriteIds, ...action.ids]);
      }
      if (action.operation === 'del') {
        favoriteIds = _.difference(favoriteIds, action.ids);
      }
      return {
        ...state,
        display: {
          ...state.display,
          favoriteIds,
        },
      };
    }
    case TYPES.SPORT.SET_FULLSCREEN: {
      return {
        ...state,
        display: {
          ...state.display,
          fullScreen: action.data === undefined ? !state.display.fullScreen : action.data,
        },
      };
    }
    case TYPES.SPORT.GET_GAME_RESULT_LIST: {
      const gameResultStatistics = mapGameResultStatistics(action.res.list, state.userSettings.sportId);
      const {total} = action.res;

      return {
        ...state,
        display: {
          ...state.display,
          gameResultStatistics,
        },
        userSettings: {
          ...state.userSettings,
          gameResultPageTotal: total,
        },
      };
    }
    case TYPES.SPORT.GET_GAME_RESULT_DETAIL: {
      return {
        ...state,
        display: {
          ...state.display,
          gameResultDetail: {details: action.res},
        },
      };
    }
    case TYPES.SPORT.UPDATE_GAME_RESULT_PAGE_INFO: {
      return {
        ...state,
        userSettings: {
          ...state.userSettings,
          gameResultPageInfo: action.res,
        },
      };
    }
    case TYPES.SPORT.RESET_GAME_RESULT_PAGE_INFO: {
      return {
        ...state,
        display: {
          ...state.display,
          gameResultStatistics: [],
        },
        userSettings: {
          ...state.userSettings,
          gameResultPageInfo: initGameResultPageInfo,
        },
      };
    }
    case TYPES.SPORT.HANDLE_SETTING_MENU: {
      return {
        ...state,
        settingMenu: {
          ...state.settingMenu,
          isOpen: !state.settingMenu.isOpen,
        },
      };
    }
    case TYPES.SPORT.UPDATE_PAGE_PATH: {
      return {
        ...state,
        display: {
          ...state.display,
          pagePath: action.data,
        },
      };
    }
    case TYPES.SPORT.HANDLE_HANDICAP_TUTORIAL: {
      return {
        ...state,
        handicaptutorial: {
          ...state.handicaptutorial,
          isClicked: !state.handicaptutorial.isClicked,
        },
      };
    }
    case TYPES.SPORT.VISIABLE_DETAIL: {
      return {
        ...state,
        isVisiableDetail: action.data,
      };
    }
    // 更新订单预约赔率
    case TYPES.SPORT.UPDATE_SERISE: {
      return {
        ...state,
        seriesList: action.data,
      };
    }
    default:
      return state;
  }
}
