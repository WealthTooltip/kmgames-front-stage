/*
 * @Author: Passion.KMG
 * @Date: 2024-01-10 20:08:36
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/components/LeagueList.tsx
 * @Description:
 */
import React from 'react';
import TStore from '@core/reducers/_reduxStore';
import usePublicState from '@core/hooks/usePublicState';
import DpImage from '@views/kmg/desktop/components/Image';
import {ALL_MATCH_TYPES, EMatchTypes} from '@constants/enum/sport';
import {useSelector} from 'react-redux';
import DpCollapse from '@views/kmg/desktop/components/Collapse';
import {useLeagueListData} from '@core/hooks/sports/useRenderData';

export const LeagueList = React.memo(() => {
  const {dispatch, ACTIONS} = usePublicState();
  const {leagues} = useLeagueListData();
  const currentLeagueId = useSelector((state: TStore) => state.sport.display.currentLeagueId);
  const matchType = useSelector((state: TStore) => state.sport.userSettings.matchType);
  const groupLeague = _.groupBy(leagues, 'state');
  const groupLeagueList = _.map(groupLeague, (item, key: EMatchTypes) => ({key, list: item}));
  return (
    <>
      {
        groupLeagueList.sort((item) => item.key === matchType ? -1 : 1).map((item) =>
          <DpCollapse
            header={
              matchType !== EMatchTypes.EARLY &&
              <div className="menu-item league-item league-group-name">
                <span>{_.find(ALL_MATCH_TYPES, {code: item.key})?.name } ({_.sumBy(item.list, (league) => league.countGroup[item.key])})</span>
              </div>
            }
            key={item.key}
          >
            {
              item.list.map((it) =>
                <div
                  key={it.leagueId}
                  className={`menu-item league-item ${_.find(currentLeagueId, {id: it.leagueId, key: item.key}) ? 'active' : '' }`}
                  onClick={() => {
                    dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
                    dispatch(ACTIONS.SPORT.toggleSelectLeague({matchType: item.key, id: it.leagueId}));
                  }}>
                  <DpImage className='mr-6' size={16} width={16} type="league" src={it.leagueIcon} />
                  <span className='name league'>{it.leagueName}</span>
                  <span className='count'>{it.countGroup[item.key]}</span>
                </div>,
              )
            }
          </DpCollapse>,
        )
      }
    </>
  );
});
