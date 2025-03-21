/*
 * @Author: Passion.KMG
 * @Date: 2024-01-09 12:12:04
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/components/SaveList.tsx
 * @Description:
 */
// import {TFavoritesData} from '@core/apis/models/sport/get_favorites';
// import useFavorites from '@core/hooks/sports/useFavorites';
import ESportsCategory from '@constants/enum/sport/sportsCategory';
import React from 'react';
import useEventEmitter from '@core/hooks/useEventEmitter';
import useFavorites from '@core/hooks/sports/useFavorites';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {TMitt} from '@constants/enum/mitt';
import DpCollapse from '@views/kmg/desktop/components/Collapse';

export const SaveList = React.memo(() => {
  const [leagueList, setLeagueList] = React.useState<TMitt['syncFavoriteLeagueInfo']['leagues']>();
  const [matchList, setMatchList] = React.useState<TMitt['syncFavoriteLeagueInfo']['matches']>();
  useEventEmitter<TMitt['syncFavoriteLeagueInfo']>({mittName: 'syncFavoriteLeagueInfo', on: ({leagues, matches}) => {
    setLeagueList(leagues);
    setMatchList(matches);
  }});
  const {emit} = useEventEmitter<TMitt['syncFavoriteLeagueId']>({mittName: 'syncFavoriteLeagueId'});
  const [currentLeagueId, setCurrentLeagueId] = React.useState<number>(0);
  const {onToggleFavorite} = useFavorites();

  React.useEffect(() => {
    emit({leagueId: currentLeagueId});
  }, [currentLeagueId]);

  return (
    <>
      <div className="menu-item fs-14 acitve">我的收藏</div>
      {/* <div className={`menu-item league-item ${currentLeagueId === 0 && 'active'}`} onClick={() => setCurrentLeagueId(0)}>全部</div> */}
      {
        _.map(_.groupBy(leagueList, 'sportId'), (item, key: number) =>
          <DpCollapse
            header={
              <div className="menu-item league-item">
                <span>{_.find(ESportsCategory, {sportId: Number(key)}).name}</span>
              </div>
            }
            key={key}
          >
            {
              leagueList.filter((i) => i.sportId == key)?.map((item) => (
                <div key={item.leagueId} className={`menu-item league-item ${currentLeagueId === item.leagueId ? 'active' : ''}`} onClick={() => currentLeagueId === item.leagueId ? setCurrentLeagueId(0) : setCurrentLeagueId(item.leagueId)}>
                  <DpIcon
                    className='mr-8'
                    type='collect'
                    active={true}
                    onClick={(e) => onToggleFavorite(e, _.filter(matchList, (i) => i.leagueId == item.leagueId).map((i) => i.matchId))}
                  />
                  <span className='name league'>{item.leagueName}</span>
                  <span className="count ml-10">{_.filter(matchList, (i) => i.leagueId == item.leagueId).length}</span>
                </div>
              ))
            }
          </DpCollapse>,
        )
      }
    </>
  );
});
