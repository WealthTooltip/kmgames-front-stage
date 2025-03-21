/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/SportTypeSelector/index.tsx
 * @Description:
 */
import {useMemo} from 'react';
import useSettings from '@core/hooks/sports/useSettings';
// import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import styles from './style.scss';
import {useLocation} from 'react-router';

export default function() {
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  // const {dispatch, ACTIONS} = usePublicState();
  const {switchSportByType, sportId, sid} = useSettings();
  const location = useLocation();
  const isEsports = useMemo(() => {
    return location.pathname === '/esports';
  }, [location]);
  const list = useMemo(() => {
    if (isEsports) {
      const ids = [278, 276, 279, 277];
      const obj = sportList.reduce((a: any, b) => {
        a[b.sportId] = b;
        return a;
      }, {});
      return ids.map((item) => obj[item]);
    }
    return sportList;
  }, [sportList, isEsports]);

  const handleSwitchSport = React.useCallback((count: number, newSportId: number) => {
    if (sportId === newSportId || sid === newSportId) {
      return;
    }
    // if (count === 0) {
    //   dispatch(ACTIONS.BASE.openToast({text: '暂无赛事', types: 'info'}));
    //   return;
    // }
    switchSportByType(newSportId);
  }, [sportId, sid]);

  return (
    <div className={styles.wrapper}>
      {list.map((item) => (
        item &&
        <div
          className='sport-type-item'
          onClick={() => handleSwitchSport(item.count, item.sportId)}
          key={item.sportId}>
          <div className={classnames('sport-logo', `sid-${item?.sportId}`, {active: sportId === item?.sportId || sid === item.sportId})}>
            <span className='total'>{item.count}</span>
          </div>
          <p className={`${sportId === item.sportId ? 'active' : ''}`}>{item.sportName}</p>
        </div>
      ))}
    </div>
  );
}
