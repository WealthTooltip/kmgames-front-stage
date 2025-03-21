import {Button, Checkbox} from 'antd';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import DpIcon from '@this/components/Icon';
import styles from '../style.scss';
import React, {useState} from 'react';
import OrderItem from './orderItem';
import ConfrimedOrders from './confrimedOrders';
import {MultipleBetContext} from './MultipleBetContext';
import MultipleBetOrderItem from './MultipleBetOrderItem';
import usePublicState from '@core/hooks/usePublicState';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
interface IProps{
  hideOrderCart: () => void;
}
export default React.memo(({hideOrderCart}: IProps) => {
  const [totalBetAmount, setTotalBetAmount] = useState('');
  const inputRef = React.useRef<{[key: string]: HTMLInputElement}>({});
  const {user} = usePublicState();
  const {removeAllOrder, removeOrder, orders, orderTags, isExistConfirmed, verifyOrderTokenThenSubmitSingleOrder,
    confirmSubmitStatus, setConfirmAcceptChangeOdd, submitLoading, minBalance, seriesList} = useOrderCart();
  const [orderStatus, setOrderStatus] = React.useState({
    fails: [],
    lockds: [],
    transforms: [],
    sameMatch: [],
  });
  React.useEffect(() => {
    const fails:Array<string> = [];
    const lockds:Array<string> = [];
    const transforms:Array<string> = [];
    let sameMatchId:Array<number> = [];
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
    const matchIds = _.map(Object.values(orders), (item) => _.get(item, 'matchId'));
    const uniqueArr = _.uniq(matchIds);
    const hasDuplicates = uniqueArr.length !== matchIds.length;
    if (hasDuplicates) {
      // 筛选出重复的数字
      const duplicates = _.filter(matchIds, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
      sameMatchId = duplicates;
    } else {
      sameMatchId = [];
    }
    setOrderStatus({fails, lockds, transforms, sameMatch: sameMatchId});
    return ()=>{
      setOrderStatus({
        fails: [],
        lockds: [],
        transforms: [],
        sameMatch: [],
      });
    };
  }, [orders]);
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
      sameMatch: [],
      transforms: orderStatus.transforms,
    });
  };
  const hasInvalidOrder = () => {
    return orderStatus.fails.length > 0 || orderStatus.lockds.length > 0 || orderStatus.sameMatch.length > 0;
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
    const hasOrder = _.filter(Object.values(seriesList), (item: Series)=>Number(item.money) >= minBalance).length;
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
                orderTags.map((tag) => <OrderItem order={orders[tag]} tag={tag} key={tag} setTotalBetAmount={setTotalBetAmount} inputRef={inputRef} isReserveStatus={isReserveStatus} isSeries/>)
              }
              {seriesList.length>=1 && <MultipleBetOrderItem inputRef={inputRef} data={seriesList[0]} showOdd/>}
              {seriesList.length>=2 && <div className='switch-multiple'>
                <em>复式连串过关投注</em>
                <DpIcon type='arrow'></DpIcon>
              </div>}
              {
                seriesList.map((item, index)=>{
                  if (index === 0) return null;
                  return <MultipleBetOrderItem inputRef={inputRef} key={item.id} data={item}/>;
                })
              }
            </MultipleBetContext.Provider>
          </div>
          <div className='bottom-content'>
            <div className='multiple-bottom-wrap'>
              <div className='multiple-info'>
                <p>
                  <em>总投注：</em>
                  <em className='blod'>0.00</em>
                </p>
                <p>
                  <em>预计总收益：</em>
                  <em className='blod theme-color'>0.00</em>
                </p>
              </div>
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
