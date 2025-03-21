/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 12:26:59
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/BetItemInfo/index.tsx
 * @Description:
 */
import {TOrder} from '@core/services/Table';
import style from './style.scss';
import {useUnmount} from 'react-use';
import closeIcon from '../SingleCart/i/close.svg';
import {getViewOddFn} from '@core/hooks/sports/useOddTransfer';
import {getBetHandiCapAtBetting, getOrderBetTypeAtBetting, getPlayNameByKc, isVisiableSecondText} from '@core/utils';

interface IBetItemInfoProps {
  // 串关或者单关
  type: 'single' | 'multiple';
  order: TOrder;
}
export default ({type, order}: IBetItemInfoProps) => {
  const odd = getViewOddFn(order.od, order.oddBetType, order.currentOddType);
  const [countdown, setCountdown] = React.useState(4);
  const timer = React.useRef(null);

  useUnmount(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  });

  React.useEffect(() => {
    if (type === 'multiple') {
      return;
    }
    if (timer.current) {
      clearInterval(timer.current);
    }
    setCountdown(4);
    timer.current = setInterval(() => {
      setCountdown((state) => {
        if (state === 0) {
          clearInterval(timer.current);
          return state;
        }
        return state - 1;
      });
    }, 1000);
  }, [order]);
  const hasInvalidOrder = () => {
    return order.locked || !order.available;
  };
  return hasInvalidOrder() ? (
    <div className={style.closeWrapper}>
      <div className='close-view'>
        <img src={closeIcon}/>
        <em>盘口已关闭</em>
      </div>
    </div>
  ) : (
    <div className={style.wrapper}>
      <div className="name-odd">
        <span className='name'>
          {getOrderBetTypeAtBetting(order)}
          {
            isVisiableSecondText(order.betHandicap) && <em>{getBetHandiCapAtBetting(order.orderName, order.sportId)}</em>
          }
        </span>
        <span className={`odd ${order.change}`}>@{odd}</span>
      </div>
      <div className="infos">
        <div className='info-content'>
          <div>{getPlayNameByKc({code: order.tag.split(/-/)[1], name: order.playName, ctid: order.ctid, sportId: order.sportId}) || order.playName}</div>
          <div>{`${order.teams.home.name} - ${order.teams.away.name}`}</div>
          <div>{order.leagueName}</div>
        </div>
      </div>
      {
        type === 'single' &&
        <span className="countdown">{countdown}</span>
      }
    </div>
  );
};
