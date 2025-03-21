import {Button, Checkbox} from 'antd';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import DpIcon from '@this/components/Icon';
import {formatCurrency} from '@helpers/unit';
import DpSwitchButton from '@this/components/SwitchButton';
import styles from './style.scss';
import React, {useState} from 'react';
import OrderItem from './components/orderItem';
import ConfrimedOrders from './components/confrimedOrders';
import FastBetBtnsComponent from './components/fastBetBtns';
import {MultipleBetContext} from './components/MultipleBetContext';
import classnames from 'classnames';
import {TOrder} from '@core/services/Table';
import usePublicState from '@core/hooks/usePublicState';
// import MultipleBetOrder from './components/MultipleBetOrder';
import Empty from '@views/kmg/desktop/components/Empty';
interface IProps{
  hideOrderCart: () => void;
}
const items = [
  {
    label: '单关',
    value: '1',
  },
  {
    label: '串关',
    value: '2',
  },
];
export default React.memo(({hideOrderCart}: IProps) => {
  const [betType, setBetType] = React.useState('1');
  const {dispatch, ACTIONS} = usePublicState();
  return (
    <div className={styles.wrapper}>
      <div className="go-back" onClick={hideOrderCart}>
        <DpIcon className='goback' width={24} height={24} type='goback'/>
        <span>返回导航</span>
      </div>
      <div className='switch-type'>
        <DpSwitchButton value={betType} items={items}
          onChange={(item:string)=>{
            if (item ==='2') {
              dispatch(ACTIONS.BASE.toggleSerierWay({data: true}));
            } else {
              dispatch(ACTIONS.BASE.toggleSerierWay({data: false}));
            }
            setBetType(item);
          }}/>
      </div>
      {
      //  betType === '1' ? <SingleBetPanel hideOrderCart={hideOrderCart}/> : <MultipleBetOrder hideOrderCart={hideOrderCart}/>
        betType === '1' ? <SingleBetPanel hideOrderCart={hideOrderCart}/> : <div className='pt-100'><Empty description='敬请期待' /></div>
      }
    </div>
  );
});
const SingleBetPanel = React.memo(({hideOrderCart}: IProps) => {
  const [totalBetAmount, setTotalBetAmount] = useState('');
  const inputRef = React.useRef<{[key: string]: HTMLInputElement}>({});
  const {user} = usePublicState();
  const {removeAllOrder, removeOrder, orders, orderTags, isExistConfirmed, setOrderMoney, maxBalance, verifyOrderTokenThenSubmitSingleOrder,
    confirmSubmitStatus, setConfirmAcceptChangeOdd, submitLoading, minBalance} = useOrderCart();
  const [orderStatus, setOrderStatus] = React.useState({
    fails: [],
    lockds: [],
    transforms: [],
  });
  React.useEffect(() => {
    const fails:Array<string> = [];
    const lockds:Array<string> = [];
    const transforms:Array<string> = [];
    _.each(orderTags, (tag) => {
      if (orders[tag].locked) {
        fails.push(tag);
        return;
      }
      if (!orders[tag].available) {
        lockds.push(tag);
        return;
      }
      if (orders[tag].od !== orders[tag].prevOdd) {
        transforms.push(tag);
      }
    });
    setOrderStatus({fails, lockds, transforms});
    return ()=>{
      setOrderStatus({
        fails: [],
        lockds: [],
        transforms: [],
      });
    };
  }, [orders]);
  const assginMoney = (betedAmount:string)=>{
    _.each(orderTags, (tag) => {
      inputRef.current[tag].value = betedAmount;
      setOrderMoney(betedAmount, tag);
    });
  };
  const getRemainAmount = ()=>{
    let allBetMoney = 0;
    _.each(orderTags, (tag) => {
      const money = orders[tag].money;
      allBetMoney = allBetMoney + Number(money);
    });
    const remain = user.info.totalBalance - allBetMoney;
    return remain <= 0 ? 0 : remain;
  };
  const getTotalBetAmount = ()=>{
    let allBetMoney = 0;
    _.each(orderTags, (tag) => {
      const money = orders[tag].money;
      allBetMoney = allBetMoney + Number(money);
    });
    return allBetMoney;
  };
  React.useEffect(()=>{
    if (isExistConfirmed) {
      setTotalBetAmount('');
    }
  }, [isExistConfirmed]);
  const amountVilidation = (v: string )=>{
    return v.replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
        .replace(/^\./g, '') // 验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
        .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, '') // 2、将字符串的点直接清掉
        .replace('$#$', '.') // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
  };
  const onCancel = () => {
    hideOrderCart();
    removeAllOrder();
  };
  const clearInvaildOrders = () => {
    _.uniq([...orderStatus.fails, ...orderStatus.lockds]).forEach((tag:string)=>{
      if (!orders[tag].available || orders[tag].locked) {
        removeOrder(tag);
      }
    });
    setOrderStatus({
      fails: [],
      lockds: [],
      transforms: orderStatus.transforms,
    });
  };
  const hasInvalidOrder = () => {
    return orderStatus.fails.length > 0 || orderStatus.lockds.length > 0;
  };
  const hasTransformOrder = () => {
    return orderStatus.transforms.length > 0;
  };
  const renderRemoveFailsOrder =()=>{
    return (
      hasInvalidOrder() && <button className='fail-staus' onClick={clearInvaildOrders}>
        <p>移除无法投注项目</p>
        <DpIcon type='clear' />
      </button>
    );
  };
  const isReserveStatus=()=>{
    const order = _.find(orders, (item) => item.inReservationStatus === true);
    if (order) return true;
    return false;
  };
  const isDisable=()=>{
    const hasOrder = _.filter(Object.values(orders), (item: TOrder)=>Number(item.money) >= minBalance).length;
    return hasOrder ? false : true;
  };
  return (
    <div className={styles.single_bet_panel}>
      {
        isExistConfirmed ? <ConfrimedOrders/> :
        <>
          <div className="bet-list">
            <MultipleBetContext.Provider value={{inputRef, totalBetAmount, setTotalBetAmount, getRemainAmount, amountVilidation, getTotalBetAmount}}>
              {
                orderTags.map((tag) => <OrderItem order={orders[tag]} tag={tag} key={tag} setTotalBetAmount={setTotalBetAmount} inputRef={inputRef} isReserveStatus={isReserveStatus} hasReserve/>)
              }
            </MultipleBetContext.Provider>
          </div>
          <div className='bottom-content'>
            <div className='bottom-wrap'>
              {
                !isExistConfirmed && orderTags.length > 1 &&
                <div className={classnames('bet-content', isReserveStatus() && 'reserve-opacity')}>
                  <div className='title'>
                    <span></span>
                    <span>多项注单</span>
                  </div>
                  <div className="fund-all">
                    <span className='orders'>{orderTags.length}X</span>
                    <div className='input-box'>
                      <input
                        type='text'
                        placeholder={`限额 10 ~ ${maxBalance}`}
                        value={totalBetAmount}
                        ref={(ref) => inputRef.current['all'] = ref}
                        onChange={(e) => {
                          const inputAmount = amountVilidation(e.target.value);
                          const amount = Number(inputAmount) >= maxBalance? maxBalance+'' :inputAmount;
                          setTotalBetAmount(amount);
                          assginMoney(amount);
                        }}/>
                      {totalBetAmount && totalBetAmount !='0'&&
                        <div className='close-input' onClick={() => {
                          setTotalBetAmount('');
                          assginMoney('');
                        }}>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="fund-all">
                    <span className='orders'></span>
                    <div className="amount-after">最高可赢: { formatCurrency(_.sumBy(Object.values(orders), 'maxWin') || 0) } </div>
                  </div>
                  <MultipleBetContext.Provider value={{inputRef, totalBetAmount, setTotalBetAmount, getRemainAmount, getTotalBetAmount}}>
                    <FastBetBtnsComponent tag={'All'} isMultiple/>
                  </MultipleBetContext.Provider>
                </div>
              }
              {
                hasTransformOrder() && !hasInvalidOrder() && <div className='od-status-text'>赔率已更改</div>
              }
              {/* 移除失效的注单 */}
              {renderRemoveFailsOrder()}
              <div className="action">
                <Button size="small" shape="round" onClick={onCancel}>取消</Button>
                {
                  // 正常
                  !hasTransformOrder() && !hasInvalidOrder() &&
                  <Button type="primary" size="small" shape="round" disabled={isDisable()} loading={submitLoading} onClick={verifyOrderTokenThenSubmitSingleOrder}>投注</Button>
                }
                {
                  // 赔率变动
                  hasTransformOrder() && !hasInvalidOrder() &&
                  <Button type="primary" className={isDisable()?'':'od-change'} size="small" shape="round" disabled={isDisable()} loading={submitLoading} onClick={verifyOrderTokenThenSubmitSingleOrder}>
                      接受变化并投注
                  </Button>
                }
                {
                  // 失效
                  hasInvalidOrder() &&
                  <Button type="primary" shape="round" className='invalid-submit' disabled>
                      投注
                  </Button>
                }
              </div>
            </div>
            <div className='od-status'>
              <Checkbox className='auto-odd-checked' checked={confirmSubmitStatus} onChange={(e)=>setConfirmAcceptChangeOdd(e.target.checked)}>
              </Checkbox>
              <em className='auto-odd'>自动接受赔率变更</em>
            </div>
          </div>
        </>
      }
    </div>
  );
});
