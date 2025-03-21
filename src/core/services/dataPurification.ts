/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 15:03:22
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/services/dataPurification.ts
 * @Description: 接口数据 MAPPING 与 数据清洗
 */
import {TMatchDetail, TPlayTypeDetail, TBetItemLine} from '@core/apis/models/sport/get-match-list.d';
import {MatchDetailStatistics, IMatchDetailApi} from '@core/apis/models/sport/get-match-detail-statistics';
import {TMatchStatistics} from '@core/apis/models/sport/get-match-statistics';
import {TBetItem} from '@core/apis/models/sport/get-betting-odds';
import {TLeagueStatisticsItem} from '@core/apis/models/sport/get-league-statistics';
import {TMatch, TOrder} from '@core/services/Table.d';
import * as ESport from '../constants/enum/sport';
import {TLeague, TMatchStatistics as matchStatisticsType, TLeagueStatistic, TGameResultStatistic, TGameResultCommon, TGameFootballDetail} from '@core/reducers/_reduxStore.d';
import G from '@constants/global';
import {TKeys} from '@constants/global';
import {subtractDecimals} from '@core/utils/math';
import {multiplyAndFix} from '@core/helpers/unit';
import {getViewOddFn} from '@core/hooks/sports/useOddTransfer';
import {assertHomeAwayScore} from '@core/utils';
import {TGameResultStatisticsItem} from '@core/apis/models/sport/get-game-result';
import {strSpliter} from '@core/hooks/misc';
import dayjs from 'dayjs';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
/**
 * @description: 将接口数据映射到本地数据
 * @param matchList
 */
const DX_BALL = ['FT_OU', 'HT_OU', 'Q1_OU', 'Q2_OU', 'Q3_OU', 'Q4_OU', 'FTS_OU', 'S1_OU', 'S2_OU', 'S3_OU'];
export const mapMatchList = (matchList: Array<TMatchDetail>, type: 'match-list' | 'match-detail' | 'favorite-list'): {
  matches: Array<TMatch>;
  leagues: Array<TLeague>;
  updateTime: number
} => {
  let sortNo = 0;
  let cacheKey: TKeys = 'MATCH_LIST_ODDS';
  if (type === 'match-detail') {
    cacheKey = 'MATCH_DETAIL_ODDS';
  }
  if (type === 'favorite-list') {
    cacheKey = 'FAVORITE_MATCH_ODDS';
  }
  const prevOdds = G.GET(cacheKey) || {};
  const curOdds: any = {};
  const matches: Array<TMatch> = [];
  const leagues: Array<TLeague> = [];
  const updateTime = new Date().getTime();
  _.each(matchList, (item: TMatchDetail): void | boolean => {
    if (!item.md) {
      return true;
    }
    const match: TMatch = {
      updateTime,
      sortNo,
      matchId: item.md.mid,
      pmId: item.md.pmid,
      pdId: item.md.pdid,
      mid1: item.md.mid1,
      matchName: item.md.mn,
      leagueId: item.md.lid,
      leagueName: item.md.ln,
      sportId: item.md.sid,
      isLive: !!item.md.ip,
      playTypeCount: item.md.bc, // 缺失
      isFavorite: false,
      isNe: item.md.isNe === 1,
      hasCorner: !!item.md.hcn,
      round: item.md.me?.r,
      teams: {
        home: {
          name: item.md.ht?.tn,
          icon: '',
          isHandicap: item.ptds?.filter((ptd) => ptd.kc === 'FT_AH' && ptd.ctid === 0).some((ptd) => ptd.hcl[0].bil.some((b) => (b.h.startsWith('-') && b.hoa.toUpperCase() === 'HOME'))),
        },
        away: {
          name: item.md.at?.tn,
          icon: '',
          isHandicap: item.ptds?.filter((ptd) => ptd.kc === 'FT_AH' && ptd.ctid === 0).some((ptd) => ptd.hcl[0].bil.some((b) => (b.h.startsWith('-') && b.hoa.toUpperCase() === 'AWAY'))),
        },
      },
      matchClock: {
        receiveTime: _.now(),
        startTime: Number(item.md.bt),
        second: item.md.me?.t ? Number(item.md.me?.t.split(':')[0]) * 60 + Number(Number(item.md.me?.t.split(':')[1])) : 0, // 缺失
        playTime: item.ptds?.length > 0 ? item.md.me?.t : 'FT',
        period: (item.md.ip === 1 && !item.md.me?.pd) ? 'LIVE' : item.md?.s === 'over' ? 'FT' : item.md.me?.pd,
        isRunning: item.md.ip === 1, // 缺失
        isCountDown: false, // 缺失
      },
      score: {
        home: item.md.me?.hs,
        away: item.md.me?.as,
        homeRedCard: item.md.me?.hr,
        awayRedCard: item.md.me?.ar,
        homeYellowCard: item.md.me?.hy,
        awayYellowCard: item.md.me?.ay,
        homeCorner: item.md.me?.hc,
        awayCorner: item.md.me?.ac,
        periodScore: JSON.parse(item.md.me?.ps || '[]').map((item: {h: number; a: number; c: string;}) => ({
          home: item.h,
          away: item.a,
          period: item.c,
        })),
      },
      animation: [], // 缺失
      live: item.md.u ? [item.md.u] : [],
      playGroup: JSON.parse(item.md.me?.hf || '[]').map((item: {id: number, n: string}) => ({id: item.id, name: item.n})),
      playTypes: (item.ptds || []).map((odd: TPlayTypeDetail) => ({
        code: odd.kc,
        playGroupIds: JSON.parse(odd.hf || '[]'),
        name: odd.bn,
        period: odd.bn, // 目前与名称保持一致，应该为某个枚举值
        ctid: odd.ctid,
        mks: odd.hcl.map((market) => ({ // 目前只做一条线
          mkId: market.sbim,
          allowParlay: true, // 缺失
          ops: market.bil.map((od: TBetItemLine) => ({
            win: od.w,
            ctid: odd.ctid,
            matchId: item.md.mid,
            matchName: item.md.mn,
            matchDate: Number(item.md.bt),
            leagueId: item.md.lid,
            leagueName: item.md.ln,
            teams: {
              home: {
                name: item.md.ht?.tn,
                icon: '', // 缺失
              },
              away: {
                name: item.md.at?.tn,
                icon: '', // 缺失
              },
            },
            score: {
              home: item.md.me?.hs,
              away: item.md.me?.as,
              homeRedCard: item.md.me?.hr,
              awayRedCard: item.md.me?.ar,
              homeYellowCard: item.md.me?.hy,
              awayYellowCard: item.md.me?.ay,
              homeCorner: item.md.me?.hc,
              awayCorner: item.md.me?.ac,
              periodScore: JSON.parse(item.md.me?.ps || '[]').map((item: {h: number; a: number; c: string;}) => ({
                home: item.h,
                away: item.a,
                period: item.c,
              })),
            },
            sportId: item.md.sid,
            isRunning: item.md.ip === 1, // 缺失
            mkId: odd.hcl[0].sbim,
            playName: odd.bn,
            id: Number(od.bid),
            name: (DX_BALL.includes(odd.kc) ? od.hoa === 'Over' ? `大 ${od.h}` : `小 ${od.h}` : od.h) || od.hoa,
            orderName: od.h,
            betTeam: od.hoa || od.h,
            betHandicap: od.h,
            locked: od.s === 4,
            ended: od.s === 5,
            available: od.s === 2,
            od: od.od,
            type: od.h, // 投注时需要知道是哪一个玩法的赔率，待确认
            change: calcOddsChange(prevOdds[`${item.md.mid}-${odd.kc}-${odd.hcl[0].sbim}-${od.bid}`], od.od),
            justAddCar: true, // 是否是刚刚加入投注栏的订单
            prevOdd: od.od,
            minBetAmount: 10,
            maxBetAmount: assginMaxBetAmount(item.md.lv, item.md.sid),
            overAmountLimit: false,
            isReserve: false,
            inReservationStatus: false,
            reservationOdd: 0,
            reservationMarkOdd: 0,
            reserveAlert: false,
            sportNameText: '',
            oddBetType: ESport.EOddTypeMap[od.ot] || ESport.EOddType.EUROPE,
            lv: item.md.lv,
            tag: (() => {
              curOdds[`${item.md.mid}-${odd.kc}-${odd.hcl[0].sbim}-${od.bid}`] = od.od;
              return `${item.md.mid}-${odd.kc}-${odd.hcl[0].sbim}-${od.bid}`;
            })(),
          })),
        })),
      })),
    };
    requestAnimationFrame(() => {
      G.SET(cacheKey, curOdds || {});
    });
    // 排序
    sortNo++;
    // 比赛
    matches.push(match);
    // 联赛
    const league: TLeague = {
      leagueId: item.md.lid,
      leagueName: item.md.ln,
      leagueIcon: '', // 缺失
      isFavorite: false, // 缺失
      sportId: item.md.sid,
    };
    leagues.push(league);
  });

  return {
    matches,
    leagues: _.uniqBy(leagues, 'leagueId'),
    updateTime,
  };
};
const assginMaxBetAmount = (lv: number, sprotId: number)=>{
  if (sprotId > 33) {
    return lv <= 5 ? 10000 : 3000;
  }
  return lv <= 60 ? 10000 : 3000;
};
// 判断kc 类型名字或是数值
const assertKcName = (kc:string, h:string)=>{
  if (['FT_CS', 'HT_CS'].includes(kc)) {
    if (h ==='AOS') return '其他';
    const [home, away]= assertHomeAwayScore(h);
    return home + '-' + away;
  };
  return h;
};
// 计算赔率变化
const calcOddsChange = (prevOdds: number, odds: number, isJustAddCar: boolean = false) => {
  if (isJustAddCar) return 'none';
  if (!prevOdds) return 'none';
  if (prevOdds > odds) return 'down';
  if (prevOdds < odds) return 'up';
  return 'none';
};
// 计算最高可赢
export const winMaxChange = (money:number|string, odds: number, currentOddType:number = 2) => {
  if (!money) return 0;
  return subtractDecimals(multiplyAndFix(Number(money), Number(odds)), Number(money));
};

// 统计接口映射到本地数据
export const mapMatchStatistics = (matchStatistics: Array<TMatchStatistics>): matchStatisticsType => _.chain(matchStatistics)
    .orderBy('sid')
    .map((item) => ({
      sportId: item.sid,
      sportName: item.snc,
      count: item.ct,
    }))
    .value();

// 赔率接口映射到本地数据
export const mapBettingOdds = (bettingOdds: Array<TBetItem>, orders: { [key: string]: TOrder }): { [key: string]: TOrder } => {
  const _orders = _.cloneDeep(orders);
  // 更新 orders
  Object.keys(_orders).map((tag)=>{
    const order = _orders[tag];
    const odd: any = _.find(bettingOdds, {'bid': String(order.id)});
    if (odd) {
      const {reservationOdd, inReservationStatus, currentOddType} = order;
      const viewOdd = getViewOddFn(inReservationStatus? reservationOdd : odd.od, inReservationStatus? currentOddType: (ESport.EOddTypeMap as any)[odd.ot], ESport.EOddType.EUROPE);
      _orders[tag] = {
        ...order,
        od: odd.od,
        name: assertKcName(order.tag.split(/-/)[1], odd.h),
        change: calcOddsChange(order.prevOdd, odd.od, order.justAddCar),
        maxWin: winMaxChange(order.money, Number(viewOdd)),
        locked: odd.s === 4,
        available: odd.s === 2,
        justAddCar: false,
        betHandicap: odd.h,
        oddBetType: (ESport.EOddTypeMap as any)[odd.ot] || ESport.EOddType.EUROPE,
      };
    } else {
      _orders[tag] = {
        ...order,
        change: 'none',
        available: false,
      };
    }
  });
  return _orders;
};

// 联赛列表接口映射到本地
export const mapLeagueStatistics = (LeagueStatistics: Array<TLeagueStatisticsItem>, sportId: number): Array<TLeagueStatistic> => {
  const leagues: TLeagueStatistic[] = [];
  _.each(LeagueStatistics, (i) => {
    const pushArr = (state: ESport.EMatchTypes) => {
      leagues.push({
        state,
        leagueId: i.lid,
        leagueName: i.ln,
        count: i.c,
        sportId,
        countGroup: {
          [ESport.EMatchTypes.IN_PLAY]: i.cip,
          [ESport.EMatchTypes.UPCOMING]: i.c - i.cip,
        },
        leagueIcon: i.lg,
        matchIds: {
          'in-play': i.ipmids,
          'upcoming': _.difference(i.mids, i.ipmids),
        },
        allMatchIds: i.mids,
        eids: i.mid1s,
      });
    };
    if (i.cip > 0) {
      pushArr(ESport.EMatchTypes.IN_PLAY);
    }
    if (i.c - i.cip > 0) {
      pushArr(ESport.EMatchTypes.UPCOMING);
    }
  });
  return leagues;
};

// 赛事详情统计接口映射到本地
export const mapMatchDetailStatistics = (statistics: IMatchDetailApi): MatchDetailStatistics => {
  return {
    awayTeamHalfTimeScore: statistics.away_team_half_time_score,
    hometTeamHalfTimeScore: statistics.home_team_half_time_score,
    neutral: statistics.neutral,
    scores: statistics?.scores?.map((item) => ({
      matchId: item.match_id,
      team1: item.team1,
      team2: item.team2,
      type: item.type,
      updateTime: item.update_time,
    })),
    statics: statistics?.statics?.map((item) => ({
      period: item.period,
      team1: item.team1,
      team2: item.team2,
      typeCnName: item.type_cn_name,
      typeEnName: item.type_en_name,
      typeId: item.type_id,
    })),
  };
};

// 赛果列表接口映射到本地
export const mapGameResultStatistics = (GameResultStatistics: Array<TGameResultStatisticsItem>, sportId: number): Array<TGameResultStatistic> => {
  const gameResults: TGameResultStatistic[] = [];
  const splitCommon = (i: TGameResultStatisticsItem): TGameResultCommon => {
    return {
      ln: i.leagueName,
      mid: i.matchId,
      mn: strSpliter(i.matchName, '-VS-'),
      bt: dayjs(i.beginTime).format('YYYY-MM-DD HH:mm'),
    };
  };

  const splitFootBall = (i: TGameResultStatisticsItem): TGameResultCommon & {details: TGameFootballDetail} => {
    return {
      ...splitCommon(i),
      details: {
        [EGameResult.Q1G]: strSpliter(i.q1Goal),
        [EGameResult.Q2G]: strSpliter(i.q2Goal),
        [EGameResult.FTG]: strSpliter(i.ftGoal),
        [EGameResult.OTG]: strSpliter(i.otGoal),
        [EGameResult.FG]: strSpliter(i.finalGoal),
        [EGameResult.H1RC]: strSpliter(i.h1Red),
        [EGameResult.H2RC]: strSpliter(i.h2Red),
        [EGameResult.FTRC]: strSpliter(i.ftRed),
        [EGameResult.H1YC]: strSpliter(i.h1Yellow),
        [EGameResult.H2YC]: strSpliter(i.h2Yellow),
        [EGameResult.FTYC]: strSpliter(i.ftYellow),
        [EGameResult.H1CK]: strSpliter(i.h1Corner),
        [EGameResult.H2CK]: strSpliter(i.h2Corner),
        [EGameResult.FTCK]: strSpliter(i.ftCorner),
      },
    };
  };

  _.each(GameResultStatistics, (i) => {
    const pushArr = () => {
      switch (sportId) {
        case 1:
          gameResults.push(splitFootBall(i));
          break;

        default:
          break;
      }
    };
    pushArr();
  });

  return gameResults;
};

// 赛果信息接口映射到本地
// export const mapGameResultDetail = (GameResultDetail: Array<TGameResultDetailItem>) => {
//   console.log('first');
// };
