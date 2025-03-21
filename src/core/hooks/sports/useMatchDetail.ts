/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:01:31
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/sports/useMatchDetail.ts
 * @Description: 赛事详情相关
 */
import {useLatest} from 'react-use';
import {useSelector} from 'react-redux';
import * as ESport from '@constants/enum/sport';
import {mapMatchList} from '@core/services/dataPurification';
import {TMatchDetail} from '@core/apis/models/sport/get-match-list.d';
import IStore from '@core/reducers/_reduxStore';
import {TMatch} from '@core/services/Table';
import db from '@core/services/db';
import {mergeMatchInfos} from './useLeagueAndMatchData';
import usePublicState from '../usePublicState';
import useGuard from './useGuard';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import storage from '@core/helpers/storage';
import G from '@constants/global';
export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const currentMatchId = useSelector((state: IStore) => state.sport.display.currentMatchId);
  const latestCurrentMatchId = useLatest(currentMatchId);
  const pollIntervalGuard = useSelector((state: IStore) => state.sport.pollIntervalGuard);
  const detailUpdateTime = useSelector((state: IStore) => state.sport.display.detailUpdateTime);
  const leagueStatistics = useSelector((state: IStore) => state.sport.display.leagueStatistics);
  const {isVisiableDetail} = useSelector((state: IStore) => state.sport);
  const {addGuard, updateQuerys, removeGuard, getQuerys} = useGuard();
  const [matchDetail, setMatchDetail] = React.useState<TMatch>(null);
  const [isShowFavorite, setIsShowFavorite] = React.useState(false);
  const [isReload, setIsReload] = React.useState(false);
  useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite', on: ({display}) => {
    setIsShowFavorite(display);
  }});
  const [status, setStatus] = React.useState<'loading' | 'done'>('loading');
  React.useEffect(() => {
    if (!currentMatchId) {
      setMatchDetail(null);
      return;
    }
    setStatus('loading');
    if (pollIntervalGuard[ESport.EPollIntervalGuardKeys.MATCH_DETAIL]) {
      updateQuerys(ESport.EPollIntervalGuardKeys.MATCH_DETAIL, {matchId: currentMatchId});
      return;
    }
    removeGuard(ESport.EPollIntervalGuardKeys.MATCH_DETAIL);
    addGuard(ESport.EPollIntervalGuardKeys.MATCH_DETAIL, {matchId: currentMatchId}, (data: TMatchDetail) => {
      setStatus('done');
      const matchId = getQuerys(ESport.EPollIntervalGuardKeys.MATCH_DETAIL)?.matchId;
      if (!data.md) {
        // 如果详情返回为空，则重新选第一个，收藏列表则移除轮询，普通列表则重新自动选中
        if (!isShowFavorite) {
          const inPlayMatchIds = _.flatten(_.map(leagueStatistics, 'matchIds.in-play'));
          const upcomingMatchIds = _.flatten(_.map(leagueStatistics, 'matchIds.upcoming'));
          const newInPlayMatchId = _.chain(inPlayMatchIds).filter((i) => i !== matchId).first().value();
          const newUpcomingMatchId = _.chain(upcomingMatchIds).filter((i) => i !== matchId).first().value();
          const newId = newInPlayMatchId || newUpcomingMatchId || matchId;
          dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: newId}));
        } else {
          removeGuard(ESport.EPollIntervalGuardKeys.MATCH_DETAIL);
        }
        return;
      }
      const cleanData = mapMatchList([data], 'match-detail');
      let mergedMatches = cleanData.matches;
      const matchExt = storage.get('MATCH_EXT_INFO');
      if (matchExt) {
        mergedMatches = mergeMatchInfos(cleanData.matches, matchExt);
      }
      G.SET('MATCH_DETAIL', mergedMatches[0]);
      dispatch(ACTIONS.SPORT.updateMatchDetailUpdateTime({matchId}));
    });
  }, [currentMatchId, isShowFavorite]);

  React.useEffect(() => {
    const detail = G.GET('MATCH_DETAIL');
    if (!detail || !latestCurrentMatchId?.current) {
      return;
    }
    if (detail.matchId === latestCurrentMatchId.current) {
      setMatchDetail({
        ...detail,
      });
    };
    if (process.env.CLIENT_MODE !== 'mobile') {
      db.matches.toArray()
          .then((matches: TMatch[]) => {
            if (!matches || matches.length === 0) {
              // setMatchDetail(null);
              return;
            }
            const match = matches.find((item) => item.matchId === latestCurrentMatchId.current);
            if (!match || match.matchClock.period === 'FT') {
              const temp = matches.filter((item) => item.matchClock.period !== 'FT').sort((a, b) => a.matchClock.startTime - b.matchClock.startTime);
              dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: temp[0].matchId}));
            };
          });
    }
  }, [detailUpdateTime]);
  React.useEffect(()=>{
    if (!isReload) return;
    if (pollIntervalGuard[ESport.EPollIntervalGuardKeys.MATCH_DETAIL]) {
      updateQuerys(ESport.EPollIntervalGuardKeys.MATCH_DETAIL, {matchId: currentMatchId});
      setTimeout(() => {
        setIsReload(false);
      }, 1500);
    }
  }, [isReload]);
  return {
    detailUpdateTime,
    matchDetail,
    currentMatchId,
    status,
    isVisiableDetail,
    isReload,
    setIsReload,
  };
};
