/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 11:59:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/index.tsx
 * @Description:
 */
import Overlay from '@template/components/Overlay';
import {useSelector} from 'react-redux';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import Header from './Header';
import BetItemInfo from '../BetItemInfo';
import Keyborad from '../Keyborad';
import TStore from '@core/reducers/_reduxStore';
import style from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import {TOrder} from '@core/services/Table';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import classnames from 'classnames';
import {formatCurrency} from '@core/helpers/unit';
import {useDrag} from '@use-gesture/react';
import {a, useSpring, config} from '@react-spring/web';
import {useState} from 'react';
import usePublicState from '@core/hooks/usePublicState';
export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const orders = useSelector((state: TStore) => state.sport.bet.orders);
  const tags = useSelector((state: TStore) => state.sport.bet.orderTags);
  const [visible, setVisible] = useState(false);
  const {removeAllOrder, setOrderMoney, verifyOrderTokenThenSubmitSingleOrder, confirmSubmitStatus, setConfirmAcceptChangeOdd,
    updateOrderReserve, updateOrderReserveOdd, submitLoading} = useOrderCart();
  useEventEmitter<TMitt['toggleBetOrder']>({mittName: 'toggleBetOrder', on: ({}) =>(closeBetOrderLayer())});
  useEventEmitter<TMitt['visibleBetOrder']>({mittName: 'visibleBetOrder', on: ({display}) =>(toggleBetOrder(display))});
  const {getViewOdd} = useOddTransfer();
  const [checkedAmount, setCheckedAmount] = React.useState('');
  const info = useSelector((state: TStore) => state.user.info);
  const [betAmountText, setBetAmountText] = React.useState('');
  const [translateY, setTransLateY] = React.useState(0);
  const [order, setOrder] = React.useState<TOrder>(null);
  const height = 550;
  const [{y}, api] = useSpring(() => ({y: height, onChange: (e)=>{
    setTransLateY(e.value.y);
    if (e.value.y === height) {
      closeBetOrderLayer();
    };
  }}));
  const open = ({canceled}: any) => {
    api.start({y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff});
  };
  const close = (velocity = 0) => {
    api.start({y: height, immediate: false, config: {...config.stiff, velocity}});
  };
  const bind = useDrag(
      ({last, velocity: [, vy], direction: [, dy], offset: [, oy], cancel, canceled}) => {
        if (oy < -70) cancel();
        if (last) {
          oy > height * 0.5 || (vy > 0.5 && dy > 0) ? close(vy) : open({canceled});
        } else {
          api.start({y: oy, immediate: true});
        }
      },
      {from: () => [0, y.get()], filterTaps: true, bounds: {top: 0}, rubberband: true},
  );
  const display = y.to((py) => (py < height ? 'block' : 'none'));
  const amountVilidation = (v: string )=>{
    return v.replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
        .replace(/^\./g, '') // 验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
        .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, '') // 2、将字符串的点直接清掉
        .replace('$#$', '.') // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
  };
  const setBetAmount = (amount: string)=>{
    const amountStr = amountVilidation(amount);
    const amountNumer = Number(amountStr);
    if (amountNumer > order.maxBetAmount) return;
    setOrderMoney(amountNumer, tags[0]);
    setBetAmountText(amountStr);
  };
  React.useEffect(() => {
    if (_.isEmpty(orders) && _.isEmpty(tags)) return;
    const order =orders[tags[0]];
    setOrder(order);
  }, [orders, tags]);
  const closeBetOrderLayer = ()=>{
    close();
    removeAllOrder();
    setOrder(null);
    setCheckedAmount('');
    setBetAmountText('');
    setVisible(false);
  };
  const submit = ()=>{
    if ( Number(order.money) < order.minBetAmount) {
      dispatch(ACTIONS.BASE.openToast({text: `最小投注额不能低于${order.minBetAmount}元`, types: 'error'}));
      return;
    }
    if (submitLoading) return;
    verifyOrderTokenThenSubmitSingleOrder();
  };
  const toggleBetOrder = (display: boolean)=>{
    setVisible(display);
    if (display) {
      open({});
    }
  };
  function calculateOpacity(value: number) {
    const max = 0.5;
    const min = 0;
    const range = max - min;
    const ratio = range / (500 - (-100));
    const opacity = Math.max(Math.min((value - (-100)) * ratio + min, max), min);
    return max - opacity;
  }
  function calculateFuzzyValue(value: number) {
    const max = 6;
    const min = 0;
    const range = max - min;
    const ratio = range / (500 - (-100));
    const fuzzyValue = Math.round((500 - value) * ratio);
    return Math.min(fuzzyValue, max);
  }
  if (_.isEmpty(order)) return null;
  const bgStyle:any = {
    backdropFilter: `blur(${calculateFuzzyValue(translateY)}px)`,
    background: `rgba(38, 38, 41, ${calculateOpacity(translateY)})`,
  };
  return (
    <Overlay display={visible} zIndex={10} hasMask>
      <div className={style.bg} onClick={() => close()} style={bgStyle}/>
      <a.div className={style.betCartwrapper} {...bind()} style={{display, bottom: `calc(-100vh + ${height / 18.5}rem)`, y}}>
        <Header />
        <BetItemInfo type="single" order={order} />
        <div className='money-input'>
          <div className="title">
            <em className={betAmountText?'hide':''}>限额 {order.minBetAmount}-{order.maxBetAmount}</em>
            {betAmountText}
            <em>RMB</em>
          </div>
          {!order.inReservationStatus &&
            <span className='reserve-in' onClick={()=>(updateOrderReserve(order.tag, Number(getViewOdd(order.od, order.oddBetType))))}>预约</span>}
          {order.inReservationStatus &&
            <span className='reserve-out' onClick={()=>(updateOrderReserve(order.tag, 0, false))}>取消预约</span>}
        </div>
        {
          order.inReservationStatus && <div className='reserve-input'>
            {<div className={classnames('c1', order.reservationMarkOdd>=order.reservationOdd && 'unvisiable')}
              onClick={()=>(updateOrderReserveOdd(order.tag, Number((order.reservationOdd - 0.01).toFixed(2))))}>-</div>}
            <div className='c2'>
              <span>@</span>
              <span>{order.reservationOdd}</span>
            </div>
            <div className='c3' onClick={()=>(updateOrderReserveOdd(order.tag, Number((order.reservationOdd + 0.01).toFixed(2))))}>+</div>
          </div>
        }
        <Keyborad onChange={setBetAmount}
          value={betAmountText}
          checked={checkedAmount}
          maxBetAmount={order.maxBetAmount}
          setCheckedAmount={setCheckedAmount}
          closeBetOrderLayer={close}
          currentBalance={info.totalBalance}/>
        <div className="odds-change-apply">
          {
            confirmSubmitStatus ?
            <DpIcon type='checked' onClick={()=>(setConfirmAcceptChangeOdd(false))}/> :
            <DpIcon type='unchecked' onClick={()=>(setConfirmAcceptChangeOdd(true))}/>
          }
          <span onClick={()=>(setConfirmAcceptChangeOdd(!confirmSubmitStatus))}>自动接受更好赔率</span>
        </div>
        <div className="submit">
          <div className="action" onClick={submit}>
            投注
            <span className='y-can-win'>可赢{formatCurrency((order.maxWin || 0)) }</span>
          </div>
        </div>
      </a.div>
    </Overlay>
  );
};
