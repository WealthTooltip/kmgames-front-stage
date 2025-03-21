/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:41:38
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/usePollInterval.ts
 * @Description: 体育列表，投注等所需要的轮询守卫
 * 此文件仅可在体育列表入口文件中引用，其他地方不可引用
 */

import {useLatest, useUnmount} from 'react-use';
import {useSelector} from 'react-redux';
import useLeagueAndMatchData from './useLeagueAndMatchData';
import {mapLeagueStatistics} from '@core/services/dataPurification';
import usePublicState from '../usePublicState';
import useGuard from './useGuard';
import db from '@core/services/db';
import {findLeagueIdsWithCountGreaterThanN} from '@helpers/unit';
import {EPollIntervalGuardKeys, EMatchTypes, EGameType} from '@constants/enum/sport';
import IStore, {TMatchListByLeagueIdsQuery} from '@core/reducers/_reduxStore.d';
import {TMatchData, TMatchDetail} from '@core/apis/models/sport/get-match-list.d';
import CONFIG from '@this/configs';
import {isESports} from '@core/utils';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {saveMatchListToDB} = useLeagueAndMatchData();
  const {removeGuard} = useGuard();
  const {matchType} = useSelector((state: IStore) => state.sport.userSettings);
  const {leagueStatistics} = useSelector((state: IStore) => state.sport.display);
  const {isInsideMatchList} = useSelector((state: IStore) => state.base);
  const leagueStatisticsLatest = useLatest(leagueStatistics);
  const pollIntervalGuard = useSelector((state: IStore) => state.sport.pollIntervalGuard);
  const latestPollIntervalGuard = useLatest(pollIntervalGuard);
  const queryGuys = React.useRef<{[key in EPollIntervalGuardKeys]?: number | any}>({});

  useUnmount(() => {
    removeAllQueryGuy();
  });

  // 轮询联赛列表
  React.useEffect(() => {
    const leagueListGuard = pollIntervalGuard[EPollIntervalGuardKeys.LEAGUE_STATISTICS];
    if (_.isEmpty(leagueListGuard)) {
      removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.LEAGUE_STATISTICS], EPollIntervalGuardKeys.LEAGUE_STATISTICS);
      return;
    }
    pollLeagueList();
  }, [pollIntervalGuard[EPollIntervalGuardKeys.LEAGUE_STATISTICS]]);

  // 轮询联赛列表
  const pollLeagueList = React.useCallback(() => {
    _console.log('## BEGAIN TO POLL LEAGUE_LIST DATA ##');
    // 如果有轮询实例，先移除
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.LEAGUE_STATISTICS], EPollIntervalGuardKeys.LEAGUE_STATISTICS);
    // 清空联赛列表信息
    dispatch(ACTIONS.SPORT.updateLeagueList({data: []}));
    // 清空当前选中比赛
    removeGuard(EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS);
    // dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: null}));
    // 清空选中当前联赛
    dispatch(ACTIONS.SPORT.removeAllSelectLeague());
    // 清空已展开的联赛
    dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', []));
    // 更新列表显示状态
    dispatch(ACTIONS.SPORT.updateDisplayType('skeleton'));
    // 移除
    const fn = () => {
      const leagueListGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.LEAGUE_STATISTICS);

      if (!!leagueListGuard) {
        dispatch(ACTIONS.SPORT.getLeagueList({params: leagueListGuard.querys, cb: (res: any) => {
          if (leagueStatisticsLatest.current.length === 0) {
            // 使用联赛id获取赛事列表，
            const _leagueStatistics = mapLeagueStatistics(res.data || [], (leagueListGuard.querys as any).sportId);
            const leagueIds = findLeagueIdsWithCountGreaterThanN(_leagueStatistics, CONFIG.SPORT.DEFAULT_EXPAND_MATCH_COUNT);
            let qt = EMatchTypes.EARLY;
            if (matchType === EMatchTypes.IN_PLAY || matchType === EMatchTypes.UPCOMING) {
              qt = EMatchTypes.TODAY;
            }
            const sportId = (leagueListGuard.querys as any).sportId;
            dispatch(ACTIONS.SPORT.getMatchListByLeagueIds({
              data: {
                qt,
                di: (leagueListGuard.querys as any).di,
                sortBy: (leagueListGuard.querys as any).sortBy,
                sportId,
                leagueIds: _.map(leagueIds, 'id'),
                category: isESports() ? EGameType.ESPORTS : EGameType.SPORTS,
              },
              cb: (res: {data: TMatchData}) => {
                saveMatchListToDB(res.data);
              },
            }));
          }
        }}));
      }
    };
    db.matches.clear().then(() => {
      dispatch(ACTIONS.SPORT.updateMatchListUpdateTime());
      fn();
    });
    queryGuys.current[EPollIntervalGuardKeys.LEAGUE_STATISTICS] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.LEAGUE_STATISTICS]);
  }, [matchType, leagueStatistics]);

  // 轮询赔率
  // React.useEffect(() => {
  //   const betOddsGuard = pollIntervalGuard[EPollIntervalGuardKeys.BETTING_ODDS];
  //   if (_.isEmpty(betOddsGuard)) {
  //     removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.BETTING_ODDS], EPollIntervalGuardKeys.BETTING_ODDS);
  //     return;
  //   }
  //   pollMatchOdds();
  // }, [pollIntervalGuard[EPollIntervalGuardKeys.BETTING_ODDS]]);

  // 轮询赔率
  // const pollMatchOdds = React.useCallback(() => {
  //   _console.log('## BEGAIN TO POLL BETTING_ODDS DATA ##');
  //   // 如果有轮询实例，先移除
  //   removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.BETTING_ODDS], EPollIntervalGuardKeys.BETTING_ODDS);
  //   const fn = () => {
  //     const betOddsGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.BETTING_ODDS);
  //     dispatch(ACTIONS.SPORT.getLatestOdds({data: betOddsGuard.querys}));
  //   };
  //   fn();
  //   queryGuys.current[EPollIntervalGuardKeys.BETTING_ODDS] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.BETTING_ODDS]);
  // }, []);

  // 轮询赛事详情
  React.useEffect(() => {
    const matchDetailGuard = pollIntervalGuard[EPollIntervalGuardKeys.MATCH_DETAIL];
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_DETAIL], EPollIntervalGuardKeys.MATCH_DETAIL);
    if (_.isEmpty(matchDetailGuard)) {
      return;
    }
    pollMatchDetail();
  }, [pollIntervalGuard[EPollIntervalGuardKeys.MATCH_DETAIL]]);

  // 轮询赛事详情
  const pollMatchDetail = React.useCallback(() => {
    _console.log('## BEGAIN TO POLL MATCH_DETAIL DATA ##');
    // 如果有轮询实例，先移除
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_DETAIL], EPollIntervalGuardKeys.MATCH_DETAIL);
    const fn = () => {
      const matchDetailGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.MATCH_DETAIL);
      !isInsideMatchList && pullBettingOrderData();
      if (matchDetailGuard?.querys) {
        dispatch(ACTIONS.SPORT.getMatchDetail({
          params: matchDetailGuard?.querys,
          cb: (res: { data: TMatchDetail }) => {
            matchDetailGuard.callback(res.data);
          },
        }));
      }
    };
    fn();
    queryGuys.current[EPollIntervalGuardKeys.MATCH_DETAIL] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.MATCH_DETAIL]);
  }, [isInsideMatchList]);

  /**
   * @description: 轮询赛果详情 **暂时不用**
   * @author: WEIMA
   */
  // React.useEffect(() => {
  //   const gamesResultGuard = pollIntervalGuard[EPollIntervalGuardKeys.GAME_RESULT_STATISTICS];
  //   if (_.isEmpty(gamesResultGuard)) {
  //     removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.GAME_RESULT_STATISTICS]);
  //     return;
  //   }
  //   pollGamesResult();
  // }, [pollIntervalGuard[EPollIntervalGuardKeys.GAME_RESULT_STATISTICS]]);

  // const pollGamesResult = React.useCallback(() => {
  //   // 如果有轮询实例，先移除
  //   removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.GAME_RESULT_STATISTICS]);
  //   const fn = () => {
  //     const gamesResultGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.GAME_RESULT_STATISTICS);
  //     dispatch(ACTIONS.SPORT.getGameResultList({params: gamesResultGuard?.querys}));
  //   };
  //   fn();
  //   queryGuys.current[EPollIntervalGuardKeys.GAME_RESULT_STATISTICS] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.GAME_RESULT_STATISTICS]);
  // }, []);


  /**
   * @description: 轮询赛事统计
   */
  React.useEffect(() => {
    const matchListGuard = pollIntervalGuard[EPollIntervalGuardKeys.MATCH_STATISTICS];
    if (_.isEmpty(matchListGuard)) {
      removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_STATISTICS], EPollIntervalGuardKeys.MATCH_STATISTICS);
      return;
    }
    pollMatchStatistics();
  }, [pollIntervalGuard[EPollIntervalGuardKeys.MATCH_STATISTICS]]);

  /**
   * @description: 轮询赛事统计
   */
  const pollMatchStatistics = React.useCallback(() => {
    _console.log('## BEGAIN TO POLL MATCH_STATISTICS DATA ##');
    // 如果有轮询实例，先移除
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_STATISTICS], EPollIntervalGuardKeys.MATCH_STATISTICS);
    const fn = () => {
      const matchStatisticsGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.MATCH_STATISTICS);
      const querys: TMatchListByLeagueIdsQuery = (matchStatisticsGuard as any).querys;
      dispatch(ACTIONS.SPORT.getMatchStatistics({
        params: {...querys},
      }));
    };
    fn();
    queryGuys.current[EPollIntervalGuardKeys.MATCH_STATISTICS] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.MATCH_STATISTICS]);
  }, []);


  // 使用leagueIds轮询赛事列表
  React.useEffect(() => {
    const matchListGuard = pollIntervalGuard[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS];
    if (_.isEmpty(matchListGuard)) {
      removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS], EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS);
      return;
    }
    pollMatchListByLeagueIds();
  }, [pollIntervalGuard[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS]]);

  // 使用leagueIds轮询赛事列表
  const pollMatchListByLeagueIds = React.useCallback(() => {
    _console.log('## BEGAIN TO POLL MATCH_LIST_BY_LEAGUE_IDS DATA BY LEAGUE IDS ##');
    // 如果有轮询实例，先移除
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS], EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS);
    const fn = () => {
      const matchListGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS);
      const querys: TMatchListByLeagueIdsQuery = (matchListGuard as any)?.querys;
      isInsideMatchList && pullBettingOrderData();
      dispatch(ACTIONS.SPORT.getMatchListByLeagueIds({
        data: {...querys},
        cb: (res: {data: TMatchData}) => {
          saveMatchListToDB(res.data, false);
        },
      }));
    };
    fn();
    queryGuys.current[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS]);
  }, [matchType, isInsideMatchList]);

  //  早盘数量轮询
  React.useEffect(() => {
    const earlyGroupCountGuard = pollIntervalGuard[EPollIntervalGuardKeys.EARLY_MATCH_COUNT];
    if (_.isEmpty(earlyGroupCountGuard)) {
      removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.EARLY_MATCH_COUNT], EPollIntervalGuardKeys.EARLY_MATCH_COUNT);
      return;
    }
    pollEarlyGroupCount();
  }, [pollIntervalGuard[EPollIntervalGuardKeys.EARLY_MATCH_COUNT]]);

  //  早盘数量轮询
  const pollEarlyGroupCount = React.useCallback(() => {
    _console.log('## BEGAIN TO POLL EARLY_MATCH_COUNT DATA ##');
    // 如果有轮询实例，先移除
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.EARLY_MATCH_COUNT], EPollIntervalGuardKeys.EARLY_MATCH_COUNT);
    const fn = () => {
      const earlyGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.EARLY_MATCH_COUNT);
      dispatch(ACTIONS.SPORT.getEarlyGroupCount({params: {sportId: (earlyGuard.querys as any).sportId, category: (earlyGuard.querys as any).category}}));
    };
    fn();
    queryGuys.current[EPollIntervalGuardKeys.EARLY_MATCH_COUNT] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.EARLY_MATCH_COUNT]);
  }, []);

  React.useEffect(() => {
    pollFavoriteCount();
  }, [EPollIntervalGuardKeys.FAVORITE_COUNT]);

  // 收藏数据轮训
  const pollFavoriteCount = React.useCallback(() => {
    _console.log('## BEGAIN TO POLL FAVORITE_COUNT DATA ##');
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.FAVORITE_COUNT]);
    const fn = () => {
      dispatch(ACTIONS.SPORT.getFavorites());
    };
    fn();
    queryGuys.current[EPollIntervalGuardKeys.FAVORITE_COUNT] = setInterval(fn, CONFIG.SPORT.INTERVAL[EPollIntervalGuardKeys.FAVORITE_COUNT]);
  }, []);

  /**
   * @description: 删除所有轮询实例
   */
  const removeAllQueryGuy = React.useCallback(() => {
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_STATISTICS], EPollIntervalGuardKeys.MATCH_STATISTICS);
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_DETAIL], EPollIntervalGuardKeys.MATCH_DETAIL);
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.LEAGUE_STATISTICS], EPollIntervalGuardKeys.LEAGUE_STATISTICS);
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.BETTING_ODDS], EPollIntervalGuardKeys.BETTING_ODDS);
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS], EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS);
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.EARLY_MATCH_COUNT], EPollIntervalGuardKeys.EARLY_MATCH_COUNT);
    removeQueryGuyByInstance(queryGuys.current[EPollIntervalGuardKeys.FAVORITE_COUNT], EPollIntervalGuardKeys.FAVORITE_COUNT);
  }, []);

  /**
   * @description: 移除轮询实例
   */
  const removeQueryGuyByInstance = React.useCallback((instance: number, guardKey?: string) => {
    if (instance) {
      if (guardKey) {
        _console.log(`## REMOVE QUERY GUY BY INSTANCE: ${guardKey} ##`);
      }
      clearInterval(instance);
    }
  }, []);
  const pullBettingOrderData = ()=>{
    const betOddsGuard = _.find(latestPollIntervalGuard.current, (item) => item.key === EPollIntervalGuardKeys.BETTING_ODDS);
    if (betOddsGuard && !_.isEmpty(betOddsGuard.querys)) {
      dispatch(ACTIONS.SPORT.getLatestOdds({data: Object.values(betOddsGuard.querys)}));
    }
  };
  return {};
};
