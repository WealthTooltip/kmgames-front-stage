import {useState, useRef, useEffect} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {strategyData} from '../Strategy/data';
import {guideData} from '../Guide/data';
import classnames from 'classnames';
import css from './style.scss';


export default ({ballStatus, strategyScrollToItem, guideScrollToItem, optionStatus}: {ballStatus:number, strategyScrollToItem: (v: number) => void, guideScrollToItem: (v: number) => void, optionStatus: number}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const [typeIndex, setTypeIndex] = useState(0);
  const onChangeSwiper = (id: number) => {
    strategyScrollToItem(id);
    guideScrollToItem(id);
  };
  useEffect(()=> {
    optionStatus ===0 &&
    (typeIndex - ballStatus >= 0 ? swiperRef.current.swiper.slidePrev() : swiperRef.current.swiper.slideNext());
    setTypeIndex(ballStatus);
  }, [ballStatus]);
  useEffect(()=> {
    swiperRef.current.swiper.slideTo(0);
    setTypeIndex(0);
  }, [optionStatus]);

  return (
    <div className={css.wrapper}>
      <Swiper slidesPerView='auto' preventClicks={false} ref={swiperRef}>
        {(optionStatus === 0 ? strategyData: guideData).map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className={classnames('type', {'active': typeIndex === item.id, 'mr-none': item.id ===7})}
              onClick={() => onChangeSwiper(item.id)}>
              <span>{item.content}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
