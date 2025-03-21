import {useSelector} from 'react-redux';
import IStore from '@core/reducers/_reduxStore';
import styles from './style.scss';
import {useMemo, useRef, useState} from 'react';
import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import classnames from 'classnames';
import BetGroupItem from '../BetGroupItem';
import {TMatch} from '@core/services/Table';

interface IProps {
  matchDetail: TMatch;
}

export function BettingContent({matchDetail}: IProps) {
  const theme = useSelector((state: IStore) => state.user.theme);
  const netErro = useSelector((state: IStore) => state.base.toast);
  const netOff = netErro.types === 'error';
  const swiperRef = useRef<SwiperRef>(null);
  const [gameTypeIndex, setGameTypeIndex] = useState(0);
  // 玩法统计
  const playStatistics = useMemo(() => {
    if (!matchDetail) return {};
    return matchDetail.playTypes?.reduce((a: {[key: number]: boolean}, b) => {
      b.playGroupIds?.forEach((pid: number) => {
        a[pid] = true;
      });
      return a;
    }, {});
  }, [matchDetail]);
  const playGroup = useMemo(() => {
    if (!matchDetail) return [];
    return matchDetail.playGroup.length ? [{name: '全部玩法', id: undefined}].concat(matchDetail.playGroup.filter((item) => playStatistics[item.id])) : [{name: '全部玩法', id: undefined}];
  }, [matchDetail]);
  const playList = useMemo(() => {
    if (!matchDetail) return [];
    const id = playGroup[gameTypeIndex]?.id;
    if (id === undefined) return matchDetail.playTypes;
    return matchDetail.playTypes.filter((item) => item.playGroupIds?.includes(id));
  }, [gameTypeIndex, matchDetail]);
  const onChangeSwiper = (idx: number) => {
    gameTypeIndex - idx > 0 ? swiperRef.current.swiper.slidePrev() : swiperRef.current.swiper.slideNext();
    setGameTypeIndex(idx);
  };
  return (
    <div className={styles.wrapper}>
      <div className="bet-type">
        <Swiper slidesPerView='auto' preventClicks={false} ref={swiperRef}>
          {playGroup.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={classnames('type-tab', {active: gameTypeIndex === idx})}
                onClick={() => onChangeSwiper(idx)}>
                {item.name}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {!netOff ? (
        <div className='bet-items'>
          {
            playList.map((item) => <BetGroupItem key={`${item.code}_${item.name}`} play={item} match={matchDetail} />)
          }
        </div>
      ) : (
        <div className='net-erro'>
          <div className='img'>
            <img src={theme === 'dark' ? require('../i/net-error-dark.webp') : require('../i/net-error.webp')} alt="neterro" />
          </div>
          <p className='desc'>
            网络不给力<br /><br />
            别紧张，刷新页面试试
          </p>
          <button className='btn'>刷新一下</button>
        </div>
      )}
    </div>
  );
}

export default BettingContent;
