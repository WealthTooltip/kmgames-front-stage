/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 15:53:31
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Names/FootBall.tsx
 * @Description:
 */
import {Swiper, SwiperSlide, SwiperProps} from 'swiper/react';
import {ESportsCategory} from '@constants/enum/sport/sportsCategory';
import {BetTypes, getPlayTypesBySportId} from '@core/constants/enum/sport/betTypes';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@constants/enum/mitt';
import css from './style.scss';

export default () => {
  const playTypes = getPlayTypesBySportId(ESportsCategory.FOOTBALL);
  const swiperRef = React.useRef(null);
  const {emit} = useEventEmitter<TMitt['syncMethodsTab']>({mittName: 'syncMethodsTab', on: ({index, sportId}) => {
    if (sportId === ESportsCategory.FOOTBALL) {
      swiperRef.current.swiper.slideTo(index);
    };
  }});

  const handleSlideChange: SwiperProps['onSlideChange'] = (swiper: any) => {
    emit({index: swiper.realIndex, sportId: ESportsCategory.FOOTBALL});
  };

  return (
    <Swiper
      onSlideChange={handleSlideChange}
      ref={swiperRef}
      followFinger={false}
    >
      <SwiperSlide className={css.nameWrapper}>
        <span className='label'>{BetTypes[playTypes[0]]}</span>
        <span className='label'>{BetTypes[playTypes[1]]}</span>
        <span className='label'>{BetTypes[playTypes[2]]}</span>
      </SwiperSlide>
      <SwiperSlide className={css.nameWrapper}>
        <span className='label'>{BetTypes[playTypes[3]]}</span>
        <span className='label'>{BetTypes[playTypes[4]]}</span>
        <span className='label'>{BetTypes[playTypes[5]]}</span>
      </SwiperSlide>
    </Swiper>
  );
};
