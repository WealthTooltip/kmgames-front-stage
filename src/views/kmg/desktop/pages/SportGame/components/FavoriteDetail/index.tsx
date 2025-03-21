/*
 * @Author: Passion.KMG
 * @Date: 2024-01-09 12:12:04
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/FavoriteDetail/index.tsx
 * @Description:
 */
import React from 'react';
import {useUnmount, usePrevious} from 'react-use';
import {useSelector} from 'react-redux';
import usePublicState from '@core/hooks/usePublicState';
import useFavorites from '@core/hooks/sports/useFavorites';
import DpIcon from '@views/kmg/desktop/components/Icon';
import DpSkeleton from '@this/components/Skeleton';
import {LeagueItem} from '@this/pages/SportGame/components/LeagueList';
import useEventEmitter from '@core/hooks/useEventEmitter';
import Empty from '@this/components/Empty';
import db from '@core/services/db';
import {mapMatchList} from '@core/services/dataPurification';
import {TMatchData} from '@core/apis/models/sport/get-match-list.d';
import {TMatch} from '@core/services/Table.d';
import TStore, {TLeague} from '@core/reducers/_reduxStore.d';
import {TMitt} from '@constants/enum/mitt';
import leagueListStyles from '../LeagueList/style.scss';
import styles from './style.scss';
import {EMatchTypes} from '@core/constants/enum/sport';
import {mergeMatchInfos} from '@hooks/sports/useLeagueAndMatchData';
import storage from '@helpers/storage';
import ESportsCategory from '@constants/enum/sport/sportsCategory';
import classnames from 'classnames';

export default React.memo(() => {
  const {dispatch, ACTIONS} = usePublicState();

  const collapseLeagueIds = useSelector((state: TStore) => state.sport.userSettings.collapseLeagueIds);
  const {favoriteIds} = useFavorites();
  const {emit} = useEventEmitter<TMitt['syncFavoriteLeagueInfo']>({mittName: 'syncFavoriteLeagueInfo'});
  useEventEmitter<TMitt['syncFavoriteLeagueId']>({mittName: 'syncFavoriteLeagueId', on: ({leagueId}) => {
    setCurrentLeagueId(leagueId);
  }});
  const leagueStatistics = useSelector((state: TStore) => state.sport.display.leagueStatistics);
  const favoriteMitt = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite'});
  const [currentLeagueId, setCurrentLeagueId] = React.useState<number>(0);
  const [data, setData] = React.useState<{matches: Array<TMatch>, leagues: Array<TLeague>}>();
  const timer = React.useRef(null);
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  const prevSportId = usePrevious(sportId);
  const initalTarget = React.useRef(false);
  const [isCollapseAll, setIsCollapseAll] = React.useState(false);

  React.useEffect(() => {
    if (prevSportId !== sportId && !_.isUndefined(prevSportId)) {
      handleGoBack();
    }
  }, [prevSportId, sportId]);

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  });

  React.useEffect(() => {
    if (!data?.leagues) {
      return;
    }
    const leaugeIds = data.leagues.map((league) => `fav#${league.leagueId}`);
    const intersection = _.intersection(collapseLeagueIds, leaugeIds);
    setIsCollapseAll(intersection.length >= leaugeIds.length);
  }, [collapseLeagueIds, data?.leagues]);

  React.useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const fn = () => {
      // if (!favoriteIds || favoriteIds?.length === 0) {
      //   handleGoBack();
      //   return;
      // }
      dispatch(ACTIONS.SPORT.getMatchListByMatchIds({data: null, cb: (res: {data: TMatchData}) => {
        // 如果收藏赛事与当前赛事不一致，重新获取收藏赛事
        if (favoriteIds?.length !== res.data?.length) {
          dispatch(ACTIONS.SPORT.getFavorites());
        }
        if (!res.data || res.data.length === 0) {
          setData({matches: [], leagues: []});
          emit({matches: [], leagues: []});
          return;
        }
        const matchList = mapMatchList(res.data, 'favorite-list');
        let mergedMatches = matchList.matches;
        const matchExt = storage.get('MATCH_EXT_INFO');
        if (matchExt) {
          mergedMatches = mergeMatchInfos(matchList.matches, matchExt);
        }
        setData({matches: mergedMatches, leagues: matchList.leagues});
        emit({leagues: matchList.leagues, matches: mergedMatches});
        // 第一次进入切换第一场比赛为详情赛事
        if (!initalTarget.current) {
          const leaugeIds = matchList.leagues.map((league) => `fav#${league.leagueId}`);
          dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', _.concat(collapseLeagueIds, leaugeIds)));
          initalTarget.current = true;
          const firstLeague = _.chain(matchList.leagues)
              .groupBy('sportId')
              .map((item, key) => item)
              .flatten()
              .first()
              .value();
          const firstMatchId = matchList.matches.find((item) => item.leagueId === firstLeague.leagueId).matchId;
          dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: firstMatchId}));
        }
        db.transaction('rw', db.matches, async () => {
          await db.matches.bulkPut(mergedMatches);
        });
      }}));
    };
    fn();
    timer.current = setInterval(fn, 5000);
  }, [JSON.stringify(favoriteIds)]);

  const handleGoBack = React.useCallback(() => {
    const league = _.first(leagueStatistics);
    if (!league) {
      favoriteMitt.emit({display: false});
      return;
    }
    const leagueId = league.leagueId;
    // 从db中获取所有leagueId 的比赛
    db.matches.where('leagueId').equals(leagueId).toArray().then((matches) => {
      const match = _.find(matches, (item) => item.isLive === (league.state === EMatchTypes.IN_PLAY));
      dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    });
    favoriteMitt.emit({display: false});
  }, [leagueStatistics]);

  const handleCollapseAllLeague = () => {
    if (isCollapseAll) {
      const ids = _.filter(collapseLeagueIds, (i) => !_.includes(i, 'fav'));
      dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', ids));
      return;
    }
    const leaugeIds = data.leagues.map((league) => `fav#${league.leagueId}`);
    dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', _.concat(collapseLeagueIds, leaugeIds)));
  };

  return (
    <>
      <div className={styles['favorite-detail']}>
        <div className="option-bar">
          <div className="back">
            <div className="flex items-center" onClick={handleGoBack}>
              <DpIcon type="arrow" />
              <span>返回</span>
            </div>
            <DpIcon
              type='expand'
              className={classnames(`pointer ${isCollapseAll ? 'close-all-matchs' : 'open-all-matchs'}`)}
              onClick={handleCollapseAllLeague}
            />
          </div>
          {/* <div className="title">
            收藏列表
          </div> */}
        </div>
        <div className={leagueListStyles.wrapper}>
          { !data && <DpSkeleton type="match" length={3} /> }
          {
            data && data.leagues.length === 0 &&
            <div className="dp-empty-wrap center">
              <Empty description={<span onClick={handleGoBack}>请先添加收藏赛事</span>} />
            </div>
          }
          {
            data?.leagues?.length > 0 &&
            _.map(_.groupBy(data.leagues.filter((i) => currentLeagueId === 0 ? i : i.leagueId === currentLeagueId), 'sportId'), (leagueGroup, key) =>
              <React.Fragment key={key}>
                <div className="play-type-wrapper">
                  <span>{_.find(ESportsCategory, {sportId: Number(key)}).name}</span>&nbsp;
                  <span className='count'>({_.filter(data.matches.filter((i) => i.sportId === Number(key)))?.length})</span>
                </div>
                {
                  leagueGroup.map((league) =>
                    <LeagueItem
                      leagueIcon={league.leagueIcon}
                      leagueId={league.leagueId}
                      leagueName={league.leagueName}
                      key={`${league.leagueId}`}
                      sportId={Number(key)}
                      matches={_.filter(data.matches, (match) => match.leagueId === league.leagueId)}
                    />,
                  )
                }
              </React.Fragment>,
            )
          }
        </div>
      </div>
    </>
  );
});
