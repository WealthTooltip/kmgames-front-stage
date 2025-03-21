/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 18:10:34
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/LeagueList/index.tsx
 * @Description:
 */
import React from 'react';
import {TMatch} from '@core/services/Table';
import {useSelector} from 'react-redux';
import useFavorites from '@core/hooks/sports/useFavorites';
import {useLeagueListData, useMatchListData} from '@core/hooks/sports/useRenderData';
import useSettings from '@core/hooks/sports/useSettings';
import {MatchListSkeleton} from '@this/shadow/Skeleton';
import MatchMethodNames from '@this/pages/SportGame/components/MatchMethods/Names';
import MatchMethods from '@this/pages/SportGame/components/MatchMethods';
import Empty from '@this/shadow/Empty';
import {ALL_MATCH_TYPES, EMatchTypes, EGameBettingType} from '@constants/enum/sport';
import TStore, {TLeagueStatistic} from '@core/reducers/_reduxStore.d';
import styles from './style.scss';
import DpIcon from '@this/components/Icon';
import MatchOfNoob from '../MatchOfNoob';
import {useLocation} from 'react-router';
import classnames from 'classnames';
import {useUnmount} from 'react-use';
import {TMitt} from '@constants/enum/mitt';
import {useInView} from 'react-intersection-observer';
import useEventEmitter from '@core/hooks/useEventEmitter';
import useIntersectionObserver from './useIntersectionObserver';
import storage from '@core/helpers/storage';

export default React.memo(() => {
  const {leagues} = useLeagueListData();
  const {matchList} = useMatchListData();
  const currentLeagueId = useSelector((state: TStore) => state.sport.display.currentLeagueId);
  const displayType = useSelector((state: TStore) => state.sport.display.displayType);
  const matchType = useSelector((state: TStore) => state.sport.userSettings.matchType);
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const {toggleCollapseLeagueByMatchType, isCollapseInplay, isCollapseUpcoming} = useSettings();
  const cacheLeagueList: TLeagueStatistic[] = React.useMemo(() => storage.getAny(`${sportId}_league_list`), [sportId]);
  const cacheMatchList: TMatch[] = React.useMemo(() => storage.getAny(`${sportId}_match_list`), [sportId]);
  if (displayType === 'skeleton' && (!cacheLeagueList?.length || !cacheMatchList?.length)) {
    return (
      <div className='pt-20'>
        <MatchListSkeleton />
      </div>
    );
  }
  if (displayType === 'empty') {
    return (
      <div className="empty-wrapper center">
        <Empty />
      </div>
    );
  }

  const displyLeagues = _.filter(leagues, (item): boolean => {
    if (_.isEmpty(currentLeagueId)) {
      return true;
    }
    if (_.find(currentLeagueId, {id: item.leagueId, key: item.state})) {
      return true;
    }
    return false;
  });
  return (
    <div className={styles.wrapper}>
      {
        _.map(_.groupBy(_.orderBy((displayType === 'skeleton' ? cacheLeagueList : displyLeagues), ['state'], [matchType === EMatchTypes.IN_PLAY ? 'asc': 'desc']), 'state'), (leaguesGroup: Array<TLeagueStatistic>, key: EMatchTypes) =>
          <React.Fragment key={key} >
            <div className={classnames('play-type-wrapper', {'is-closed': key === EMatchTypes.IN_PLAY ? !isCollapseInplay : !isCollapseUpcoming})} onClick={() => toggleCollapseLeagueByMatchType(key)}>
              <div className='name'>
                <div className={`active sport-logo sid-${sportId}`} />
                <span>{ matchType === EMatchTypes.EARLY ? '早盘' : _.find(ALL_MATCH_TYPES, {code: key})?.name }</span>&nbsp;
                <span className='count'>({_.sumBy(leaguesGroup, (league) => league.countGroup[key])})</span>
              </div>
              <img className='arrow' src={require(`./i/icon-arrow-down.png`)} />
            </div>
            {
              leaguesGroup.map((league) =>
                <LeagueItem
                  key={`${displayType}_${key}-${league.leagueId}`}
                  matches={_.groupBy(matchList, 'leagueId')[league.leagueId]}
                  cacheMatches={_.groupBy(cacheMatchList, 'leagueId')[league.leagueId]}
                  leagueId={league.leagueId}
                  leagueName={league.leagueName}
                  state={key}
                  countGroup={league.countGroup}
                  matchIds={league.matchIds}
                  isCache={displayType === 'skeleton'}
                  watchInView
                />,
              )
            }
          </React.Fragment>,
        )
      }
    </div>
  );
});


interface ILeagueItem {
  matches: Array<TMatch>;
  leagueId: number;
  leagueName: string;
  state?: EMatchTypes;
  countGroup?: {[key in EMatchTypes]?: number};
  watchInView?: boolean;
  isCache?: boolean;
  cacheMatches?: Array<TMatch>;
  matchIds?: {
    [key in EMatchTypes]?: number[];
  }
}
export const LeagueItem = React.memo((leagueItem: ILeagueItem) => {
  const {ref, inView} = useInView({threshold: 0});
  const {emit} = useEventEmitter<TMitt['syncMatchPollingLeagueIds']>({mittName: 'syncMatchPollingLeagueIds'});
  const {leagueId, leagueName, matches, state, countGroup, matchIds, watchInView, isCache, cacheMatches} = leagueItem;
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const {toggleCollapseLeague, collapseLeagueIds, gameBettingType} = useSettings();
  const {isFavorite, onToggleFavorite} = useFavorites();
  const location = useLocation();
  const {targetRef, visible} = useIntersectionObserver(() => {}, leagueName, leagueId);
  const list = matches?.length ? matches : cacheMatches;
  let matchWithState = list;
  if (state) {
    matchWithState = list?.filter((item) => item.isLive === (state === EMatchTypes.IN_PLAY));
  }
  useUnmount(() => {
    emit({leagueIds: [leagueId], display: false, state});
  });

  React.useEffect(() => {
    if (watchInView && !isCache) {
      emit({leagueIds: [leagueId], display: inView, state});
    }
  }, [inView, isCache]);
  // 状态前缀
  const statePrefix = state || 'fav';
  const matchIdsInLeague = matchIds ? matchIds[state] : _.map(list, (i) => i.matchId);

  return (
    <div className={styles.leagueItem} ref={targetRef}>
      {
        visible ? <React.Fragment>
          <div className="league-wrapper" onClick={() => !isCache && toggleCollapseLeague({leagueId: `${statePrefix}#${leagueId}`, isRequestData: !matches})}>
            <div className="league-info">
              <DpIcon type="collect" active={isFavorite(matchIdsInLeague)} onClick={(e) => !isCache && onToggleFavorite(e, matchIdsInLeague)} />
              <span className="league-name">
                {leagueName}
                {countGroup && !_.includes(collapseLeagueIds, `${state}#${leagueId}`) && <span className="ml-10">{countGroup[state]}</span>}
              </span>
            </div>
          </div>
          {
            _.includes(collapseLeagueIds, `${statePrefix}#${leagueId}`) &&
            <div className="match-items-wrapper" ref={ref}>
              {
                !list &&
                <div style={{padding: '14px', paddingBottom: '1px'}}>
                  <MatchListSkeleton size={1} />
                </div>
              }
              {
                matchWithState?.length > 0 &&
                <div className='match-box'>
                  <div />
                  {
                    location.pathname === '/' && gameBettingType === EGameBettingType.ADVANCED &&
                    <div className="match-title">
                      <MatchMethodNames sportId={sportId} />
                    </div>
                  }
                </div>
              }
              {
                matchWithState?.length > 0 &&
                matchWithState.map((item: TMatch) => (item.sportId > 33 || gameBettingType === EGameBettingType.BEGINNER) ? <MatchOfNoob match={item} key={item.matchId} /> : <MatchMethods match={item} key={item.matchId} />)
              }
            </div>
          }
        </React.Fragment> :
        <React.Fragment>
          <div className="league-wrapper">
            <div className="league-info">
              <DpIcon type="collect" active={isFavorite(matchIdsInLeague)}/>
              <span className="league-name">{leagueName}</span>
            </div>
          </div>
          {
            matchWithState?.length > 0 &&
            matchWithState[0].sportId > 33 || gameBettingType === EGameBettingType.BEGINNER ?
            <></> :
            _.includes(collapseLeagueIds, `${statePrefix}#${leagueId}`) && <div className='match-box-placeholder'></div>
          }
          {
            _.includes(collapseLeagueIds, `${statePrefix}#${leagueId}`) &&
            <div className="match-items-wrapper">
              {
                matchWithState?.length > 0 &&
                matchWithState.map((item: TMatch) => (item.sportId > 33 || gameBettingType === EGameBettingType.BEGINNER) ?
                <div key={item.matchId} className='match-beginner-placeholder'></div> :
                <div key={item.matchId} className='match-placeholder'></div>)
              }
            </div>
          }
        </React.Fragment>
      }
    </div>
  );
});

