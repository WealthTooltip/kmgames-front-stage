/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:39:42
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useSportsGameInit.ts
 * @Description: 体育初始化相关
 */
import {useMount, useUnmount} from 'react-use';
import {useSelector} from 'react-redux';
import {useLatest} from 'react-use';
import IStore from '@core/reducers/_reduxStore.d';
import db from '@core/services/db';
import useEventEmitter from '../useEventEmitter';
import {TMitt} from '@constants/enum/mitt';
import {EESportType, EGameType, EMatchTypes, EPollIntervalGuardKeys} from '@constants/enum/sport';
import usePublicState from '../usePublicState';
import useGuardController from './useGuard';
import useExtMatchInfo from './useExtMatchInfo';
import {isESports} from '@core/utils';
import getDpStore from '../useDpStore';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {addGuard, updateQuerys, removeGuard, getQuerys} = useGuardController();
  // 获取所有赛事播控资源
  useExtMatchInfo();
  const {matchType, sortBy} = useSelector((state: IStore) => state.sport.userSettings);
  const matchTypeLatest = useLatest(matchType);
  const pollIntervalGuard = useSelector((state: IStore) => state.sport.pollIntervalGuard);
  const pollIntervalGuardLatest = useLatest(pollIntervalGuard);
  // MITT 防抖
  const QueryDebounce = React.useRef<number>();
  const QueryLeagueIds = React.useRef<Array<string>>([]);
  useEventEmitter<TMitt['syncMatchPollingLeagueIds']>({mittName: 'syncMatchPollingLeagueIds', on: (data) => {
    if (QueryDebounce.current) {
      clearTimeout(QueryDebounce.current);
    }
    const ids = data.leagueIds.map((item) => `${data.state}_${item}`);
    if (data.display) {
      QueryLeagueIds.current = _.concat(QueryLeagueIds.current, ids);
    } else {
      QueryLeagueIds.current = _.pullAll(QueryLeagueIds.current, ids);
    }
    QueryDebounce.current = _.delay(() => {
      // 如果是空数组，移除轮询实例
      if (QueryLeagueIds.current.length === 0) {
        removeGuard(EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS);
        return;
      }
      // 如果没有轮询实例，先添加
      let qt = EMatchTypes.EARLY;
      if (matchTypeLatest.current === EMatchTypes.IN_PLAY || matchTypeLatest.current === EMatchTypes.UPCOMING) {
        qt = EMatchTypes.TODAY;
      }
      const di = getQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS)?.di;
      const sportId = getQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS)?.sportId;
      const leagueIds = _.uniq(QueryLeagueIds.current.map((item) => Number(item.split('_')[1])));
      const category = isESports() ? EGameType.ESPORTS : EGameType.SPORTS;
      if (!pollIntervalGuardLatest.current[EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS]) {
        addGuard(EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS, {qt, leagueIds, di, sportId, category});
        return;
      }
      // 如果有轮询实例，更新
      updateQuerys(EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS, {qt, leagueIds, di, sportId, category});
    }, 1000);
  }});

  const init = (reload?: boolean) => {
    db.matches.clear().then(() => {
      const {sid, sportId} = getDpStore().getState().sport.userSettings;
      const category = isESports() ? EGameType.ESPORTS : EGameType.SPORTS;
      let lid = isESports() ? EESportType.LOL : sportId;
      if (reload) {
        lid = (isESports() && process.env.CLIENT_MODE !== 'mobile') ? sid : sportId;
      }
      dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: null}));
      // 赛事统计
      addGuard(EPollIntervalGuardKeys.MATCH_STATISTICS, {category});
      // 联赛统计
      addGuard(EPollIntervalGuardKeys.LEAGUE_STATISTICS, {qt: matchType, sortBy, sportId: lid, category});
      // 获取早盘数据
      addGuard(EPollIntervalGuardKeys.EARLY_MATCH_COUNT, {sportId: lid, category});
      // 获取所有赛事资源
      // getExtMatchInfos();
      // 个人收藏
      addGuard(EPollIntervalGuardKeys.FAVORITE_COUNT);
    }).catch((err) => {
      console.log(err);
    });
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      dispatch(ACTIONS.SPORT.removeAllPollIntervalGuard());
    } else {
      init(true);
    }
  };

  useMount(() => {
    init();
    document.addEventListener('visibilitychange', onVisibilityChange);
  });

  useUnmount(() => {
    dispatch(ACTIONS.SPORT.removeAllPollIntervalGuard());
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });

  return {

  };
};
