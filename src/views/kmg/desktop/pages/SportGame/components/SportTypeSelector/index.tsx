/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/SportTypeSelector/index.tsx
 * @Description:
 */

// import sportsCategory from '@constants/enum/sport/sportsCategory';
import {useMemo, useRef} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import 'swiper/scss';
import useSettings from '@core/hooks/sports/useSettings';
// import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import styles from './style.scss';
import DpIcon from '@views/kmg/desktop/components/Icon';

export default function() {
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  // const {dispatch, ACTIONS} = usePublicState();
  const {switchSportByType, sportId} = useSettings();

  // const list = useMemo(() => sportList.filter((item) => item[matchType] > 0), [matchType, sportList]);
  const list = useMemo(() => sportList, [sportList]);
  const swiperRef = useRef<SwiperRef>(null);
  const handleScroll = (flag: number) => {
    const index = swiperRef.current.swiper.activeIndex;
    flag > 0 ? swiperRef.current.swiper.slideTo(index + 5) : swiperRef.current.swiper.slideTo(index - 5);
  };

  const handleSwitchSport = React.useCallback((count: number, newSportId: number) => {
    if (sportId === newSportId) {
      return;
    }
    // if (count === 0) {
    //   dispatch(ACTIONS.BASE.openToast({text: '暂无赛事', types: 'info'}));
    //   return;
    // }
    switchSportByType(newSportId);
  }, [sportId]);

  return (
    <div className={styles.wrapper}>
      {list.length > 16 && (
        <>
          <div className='prev' onClick={() => handleScroll(0)}>
            <DpIcon type='arrow' />
          </div>
          <div className='next' onClick={() => handleScroll(1)}>
            <DpIcon type='arrow' />
          </div>
        </>
      )}
      <Swiper slidesPerView='auto' preventClicks={false} ref={swiperRef}>
        {list.map((item) => (
          <SwiperSlide key={item.sportId}>
            <div
              className={classnames('sport-type-item')}
              onClick={() => handleSwitchSport(item.count, item.sportId)}
              key={item.sportId}>
              <div className={classnames('sport-logo', `sid-${item.sportId}`, {active: sportId === item.sportId})} />
              <span className='total'>{item.count}</span>
              <p>{item.sportName}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
