/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 18:35:26
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Odds/FootBall.tsx
 * @Description:
 */
import {useSelector} from 'react-redux';
import {Swiper, SwiperSlide, SwiperProps} from 'swiper/react';
import {getPlayTypesBySportId} from '@core/constants/enum/sport/betTypes';
import {PlayType} from '@core/services/Table';
import {ESportsCategory} from '@constants/enum/sport/sportsCategory';
import {LockItem, OddItem} from './OddsItem';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@constants/enum/mitt';
import TStore from '@core/reducers/_reduxStore.d';
import css from './style.scss';
import {Pagination} from 'swiper/modules';
import classnames from 'classnames';
import {useState} from 'react';

interface IProps {
  data: PlayType[];
}
export default ({data}: IProps) => {
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  const playTypes = getPlayTypesBySportId(ESportsCategory.FOOTBALL);
  const swiperRef = React.useRef(null);
  const [actIndex, setActIndex] = useState(0);

  const {emit} = useEventEmitter<TMitt['syncMethodsTab']>({mittName: 'syncMethodsTab', on: ({index, sportId}) => {
    if (sportId === ESportsCategory.FOOTBALL) {
      swiperRef.current.swiper.slideTo(index);
      setActIndex(index);
    };
  }});

  const handleSlideChange: SwiperProps['onSlideChange'] = (swiper: any) => {
    emit({index: swiper.realIndex, sportId: ESportsCategory.FOOTBALL});
  };

  return (
    <>
      <Swiper
        onSlideChange={handleSlideChange}
        ref={swiperRef}
        modules={[Pagination]}
        pagination={{clickable: true}}
        followFinger={false}
      >
        {
          _.chunk(playTypes, 3).map((playTypeGroup, index) =>
            <SwiperSlide key={index} className={css.oddsWrapper}>
              {
                playTypeGroup.map((item) =>
                  <div key={item}>
                    { !_.find(data, {code: item}) && <LockItem /> }
                    {
                      _.find(data, {code: item}) &&
                      _.find(data, {code: item}).mks[0]?.ops?.map((op) =>
                        <OddItem isInList={true} key={op.id} op={op} oddType={currentOddType} methodCode={item} />,
                      )
                    }
                  </div>,
                )
              }
            </SwiperSlide>,
          )
        }
        <span className={classnames(css.fy, {right: actIndex === 1})}></span>
      </Swiper>
    </>
  );
};
