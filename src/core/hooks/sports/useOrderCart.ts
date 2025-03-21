/*
 * @Author: Passion.KMG
 * @Date: 2023-12-20 17:08:42
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/sports/useOrderCart.ts
 * @Description: 订单操作
 */
import {useSelector} from 'react-redux';
import {OddType, TOrder} from '@core/services/Table';
import IStore, {TStore} from '@core/reducers/_reduxStore';
import usePublicState from '../usePublicState';
import {getViewOddFn} from './useOddTransfer';
import useGuard from './useGuard';
import * as ESport from '@constants/enum/sport';
import storage from '@core/helpers/storage';
import useEventEmitter from '../useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {chooseEuropeOrAsia} from '@core/utils';
import {find} from 'lodash';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
export default () => {
  const {dispatch, ACTIONS, user} = usePublicState();
  const {addGuard, updateQuerys} = useGuard();
  const pollIntervalGuard = useSelector((state: IStore) => state.sport.pollIntervalGuard);
  const orders = useSelector((state: IStore) => state.sport.bet.orders);
  const isSeries = useSelector((state: IStore) => state.base.toggleSeries);
  const [confirmSubmitStatus, setConfirmSubmitStatus] = React.useState(false);
  const orderTags = useSelector((state: IStore) => state.sport.bet.orderTags);
  const seriesList = useSelector((state: IStore) => state.sport.seriesList);
  const confirmOrders = useSelector((state: IStore) => state.sport.bet.confirmOrders);
  const [isExistConfirmed, setIsExistConfirmedOrder] = React.useState(false);
  const betOrderMitt = useEventEmitter<TMitt['toggleBetOrder']>({mittName: 'toggleBetOrder'});
  const switchAutoOddMitt = useEventEmitter<TMitt['switchAutoOdd']>({mittName: 'switchAutoOdd'});
  const visibleBetOrderMitt = useEventEmitter<TMitt['visibleBetOrder']>({mittName: 'visibleBetOrder'});
  const sportList = useSelector((state: TStore) => state.sport.display.matchStatistics);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  // 限额金额
  const minBalance = 10;
  const [maxBalance, setMaxBalance] = React.useState(0);
  // 设置订单金额
  const setOrderMoney = React.useCallback((money: string | number, tag: string) => {
    if (!orders[tag]) return;
    const amount = Number(money);
    const orderInfo = {tag, money};
    if (amount<orders[tag].minBetAmount || amount > orders[tag].maxBetAmount) {
      dispatch(ACTIONS.SPORT.updateOrderMoney({...orderInfo, overAmountLimit: true}));
      return;
    }
    dispatch(ACTIONS.SPORT.updateOrderMoney(orderInfo));
  }, [orderTags]);
  // 更改预约单状态
  const updateOrderReserve = React.useCallback((tag: string, reservationOdd: number, status: boolean = true) => {
    if (!orders[tag]) return;
    dispatch(ACTIONS.SPORT.updateOrderReserve({tag, inReservationStatus: status, reservationOdd: reservationOdd}));
  }, [orderTags]);
  // 更改预约单赔率
  const updateOrderReserveOdd = React.useCallback((tag: string, reservationOdd: number) => {
    if (!orders[tag]) return;
    dispatch(ACTIONS.SPORT.updateOrderReserveOdd({tag, reservationOdd}));
  }, [orderTags]);
  // 删除已确认提交订单列表
  const removeConfirmedOrders = () => {
    removeAllOrder();
    dispatch(ACTIONS.SPORT.removeConfirmedOrders());
  };
  const pullNewestOrdersOdd = React.useCallback((orders: any) => {
    if (_.isEmpty(orders)) return;
    const data = _.map(orders, (it) => ({
      matchId: it.matchId,
      betItemsId: Number(it.id),
    }));
    dispatch(ACTIONS.SPORT.getLatestOdds({data: data}));
  }, []);
  React.useEffect(()=>{
    if (_.isEmpty(orders)) return;
    getDatas();
  }, []);
  const setConfirmAcceptChangeOdd =(status: boolean)=>{
    setConfirmSubmitStatus(status);
    storage.set('CONFIRM_ACCEPT_ALL_ODD', status);
    switchAutoOddMitt.emit({display: status});
  };
  const getDatas = React.useCallback(()=>{
    const data = _.map(orders, (it) => ({
      matchId: it.matchId,
      betItemsId: Number(it.id),
    }));
    const betOddsGuard = pollIntervalGuard[ESport.EPollIntervalGuardKeys.BETTING_ODDS];
    if (_.isEmpty(betOddsGuard)) {
      addGuard(ESport.EPollIntervalGuardKeys.BETTING_ODDS, data);
      return;
    }
    updateQuerys(ESport.EPollIntervalGuardKeys.BETTING_ODDS, data);
  }, [orders]);
  // 返回订单列表
  const backOrdersDispaly = () => {
    orderTags.map((tag)=>{
      setOrderMoney(0, tag);
    });
    dispatch(ACTIONS.SPORT.removeConfirmedOrders());
  };
  // 删除或添加订单
  const addAndRemoveOrder = (odd: OddType) => {
    const order = _.find(orders, (item) => item.tag === odd.tag);
    if (isExistConfirmed) {
      removeAllOrder();
      removeConfirmedOrders();
      if (!order) {
        addOrder(odd);
      }
      return;
    }
    if (order) {
      removeOrder(odd.tag);
      return;
    }
    // 如果订单列表中不存在该订单，则添加
    addOrder(odd);
  };
  function calculateCombinations(matchs: number, series: number) {
    const factorial = (num: number) => {
      let result = 1;
      for (let i = 1; i <= num; i++) {
        result *= i;
      }
      return result;
    };
    const numerator = factorial(matchs);
    const denominator = factorial(series) * factorial(matchs - series);
    return numerator / denominator;
  }
  const generateSeriesData = React.useCallback(()=>{
    let template = {
      multiple: 1,
      minBetAmount: 1,
      maxBetAmount: 100,
      firstText: 0,
      secondText: 0,
      money: '',
      odds: [] as Array<number>,
      oddsTotal: '',
      id: '',
      type: '',
    };
    const orderList = Object.values(orders);
    if (!isSeries) return;
    if (orderList.length<2) return;
    const seriess:Array<Series> = [];
    const odds = _.orderBy(_.map(orderList, 'europeOdd'), [], ['desc']);
    const oddsTotal = Number(_.reduce(odds, (result, num) => result * num, 1)).toFixed(2);
    orderList.map((item: TOrder, index: number)=>{
      const i = 2+index;
      if (orderList.length < i) {
        const series = seriess.pop();
        seriess.unshift(series);
        if (orderList.length > 2) {
          const multiple = Number(_.reduce(seriess, (result, n) => result + n.multiple, 0));
          const id = i +'-serier-' + multiple;
          _.map(seriesList, (item)=>{
            if (id === item.id) {
              template.money = item.money;
            }
          });
          template = {...template, oddsTotal, firstText: i - 1, secondText: multiple, odds, multiple, id, type: i-1+'00'+ multiple};
          seriess.push(template);
        }
        return;
      }
      const multiple = calculateCombinations(orderList.length, i);
      const id = i +'-serier-' + multiple;
      _.map(seriesList, (item)=>{
        if (id === item.id) {
          template.money = item.money;
        }
      });
      template = {...template, oddsTotal, firstText: i, secondText: 1, odds, multiple, id, type: i+'00'+ multiple};
      seriess.push(template);
    });
    if (seriess.length === seriesList.length) return;
    updateSerise(seriess);
  }, [isSeries, orders]);
  const updateSerise = (seriess:Array<Series>)=>{
    dispatch(ACTIONS.SPORT.updateSeriseData(seriess));
  };
  const updateSeriseOfMoney = (id: string, money: string)=>{
    const serises = seriesList.map((item)=>{
      if (item.id ===id) return {...item, money};
      return item;
    });
    updateSerise(serises);
  };
  React.useEffect(() => {
    generateSeriesData();
  }, [isSeries]);
  React.useEffect(() => {
    if (_.isEmpty(orders)) return;
    const orderList =_.values(orders);
    const maxBet = _.minBy(orderList, 'maxBetAmount');
    setMaxBalance(maxBet.maxBetAmount);
    generateSeriesData();
  }, [orders]);
  React.useEffect(() => {
    if (confirmOrders && confirmOrders.length>0) {
      setIsExistConfirmedOrder(true);
    } else {
      setIsExistConfirmedOrder(false);
    }
  }, [confirmOrders]);
  // 添加订单
  const addOrder = React.useCallback((odd: OddType) => {
    const europeOdd = getViewOddFn(odd.od, odd.oddBetType, 1);
    pullNewestOrdersOdd({...orders, [odd.tag]: odd});
    const sportName = find(sportList, {sportId: odd.sportId})?.sportName;
    const currentOddType = chooseEuropeOrAsia(odd.oddBetType, odd.sportId, user.currentOddType);
    dispatch(ACTIONS.SPORT.addOrder({data: {...odd, money: '', currentOddType, sportNameText: sportName, europeOdd: Number(europeOdd)}}));
    visibleBetOrderMitt.emit({display: true});
  }, [orders, user.currentOddType, maxBalance]);

  // 删除订单
  const removeOrder = React.useCallback((tag: string) => {
    const newest = _.omit({...orders}, tag);
    pullNewestOrdersOdd(newest);
    dispatch(ACTIONS.SPORT.removeOrder({data: {tag}}));
  }, [orders]);

  // 清空所有订单
  const removeAllOrder = React.useCallback(() => {
    dispatch(ACTIONS.SPORT.removeAllOrder());
  }, []);

  // 關閉已投注
  const closeConfirmedOrder = React.useCallback(() => {
    dispatch(ACTIONS.SPORT.closeConfirmedOrder());
  }, []);

  // 修改订单
  const updateOrder = React.useCallback((diffOrder: any, orderTag: string) => {
    dispatch(ACTIONS.SPORT.updateOrder({data: {tag: orderTag, ...diffOrder}}));
  }, []);
  const verifyOrderTokenThenSubmitSingleOrder =()=>{
    setSubmitLoading(true);
    if (storage.get('ORDER_TOKEN')) {
      !isSeries ? submitSingleOrder() : submitOrderMultipeOrder();
    } else {
      dispatch(ACTIONS.SPORT.getBetorderToken({
        data: null,
        cb: (data: any)=>{
          storage.set('ORDER_TOKEN', data.data, 300);
          !isSeries ? submitSingleOrder() : submitOrderMultipeOrder();
        }}));
    }
  };
  const assignOddType = (order: TOrder, confirmSubmitStatus: boolean) =>{
    if (_.isEmpty(order)) return confirmSubmitStatus ? 3 : 1; // 如果为空，则时串单
    if (order.inReservationStatus) return 3; // 如果预约注单,直接接受任何赔率
    return confirmSubmitStatus ? 3 : 1;
  };
  // 提交单式订单
  const submitSingleOrder = React.useCallback(() => {
    // 筛选出正确金额的订单
    const _orders = _.filter(orders, (item) => item.money && item.money !== '0' && Number(item.money) >= 10 && Number(item.money) <= 100000);
    // 如果没有订单则直接返回
    if (_orders.length === 0) {
      // 提示
      dispatch(ACTIONS.BASE.openToast({text: '请先输入好投注金额', types: 'error'}));
      setSubmitLoading(false);
      return;
    }
    // 组合投注项请求对象
    const isCrossCompetition = +(_.uniqBy(_orders, 'leagueId').length > 1);
    const betPayload = _.map(_orders, (item) => {
      const oddValue = getViewOddFn(item.od, item.oddBetType, item.currentOddType);
      return {
        betCount: 1,
        betOrderDetailRequestDTOS: [{
          marketType: item.currentOddType,
          betItemId: item.id,
          leagueId: item.leagueId,
          matchId: item.matchId,
          oddValue: item.inReservationStatus ? item.reservationOdd : Number(oddValue),
          sportId: item.sportId,
          betHandicap: item.betHandicap,
        }],
        isReserve: item.inReservationStatus ? 1 : 2,
        currency: 'CNY',
        deviceType: 1,
        isCrossCompetition,
        oddAcceptionType: assignOddType(item, confirmSubmitStatus),
        orderAmount: Number(item.money),
        productAmountTotal: Number(item.money),
        seriesType: 1,
      };
    });
    const orderToken = storage.get('ORDER_TOKEN');
    // 提交订单
    dispatch(ACTIONS.SPORT.submitOrder({
      data: betPayload,
      headers: {'orderToken': orderToken},
      cb: (orders:any) => {
        const {msg, code, data} = orders;
        if (code!==0) {
          dispatch(ACTIONS.BASE.openToast({text: msg, types: 'error'}));
          setSubmitLoading(false);
          return;
        }
        // dispatch(ACTIONS.BASE.openToast({text: '投注成功', types: 'success'}));
        dispatch(ACTIONS.USER.getUserInfo({}));
        dispatch(ACTIONS.SPORT.showConfirmedOrder());
        dispatch(ACTIONS.SPORT.addConfirmedOrders(data));
        storage.remove('ORDER_TOKEN');
        betOrderMitt.emit({display: false});
        setSubmitLoading(false);
      },
    }));
  }, [orders, confirmSubmitStatus]);

  const submitOrderMultipeOrder = React.useCallback(() => {
    // 筛选出正确金额的订单
    const _seriesList = _.filter(seriesList, (item) => item.money && item.money !== '0' && Number(item.money) >= 10 && Number(item.money) <= 100000);
    const _orders = Object.values(orders);
    // 提交订单
    console.log(_seriesList);
    // 如果没有订单则直接返回
    if (_seriesList.length === 0) {
      // 提示
      dispatch(ACTIONS.BASE.openToast({text: '请先输入好投注金额', types: 'error'}));
      setSubmitLoading(false);
      return;
    }
    // 组合投注项请求对象
    const isCrossCompetition = +(_.uniqBy(_orders, 'leagueId').length > 1);
    const betOrderDetailRequestDTOS:Array<any> = [];
    _.map(_orders, (item) => {
      const oddValue = getViewOddFn(item.od, item.oddBetType, item.currentOddType);
      betOrderDetailRequestDTOS.push({
        marketType: item.currentOddType,
        betItemId: item.id,
        leagueId: item.leagueId,
        matchId: item.matchId,
        oddValue: oddValue,
        sportId: item.sportId,
        betHandicap: item.betHandicap,
      });
    });
    const series = _.map(_seriesList, (item) => {
      return {
        betCount: betOrderDetailRequestDTOS.length,
        betOrderDetailRequestDTOS: betOrderDetailRequestDTOS,
        isReserve: 2,
        currency: 'CNY',
        deviceType: 1,
        isCrossCompetition,
        oddAcceptionType: assignOddType(null, confirmSubmitStatus),
        orderAmount: Number(item.money),
        productAmountTotal: Number(item.money),
        seriesType: item.type,
      };
    });
    const orderToken = storage.get('ORDER_TOKEN');
    dispatch(ACTIONS.SPORT.submitOrder({
      data: series,
      headers: {'orderToken': orderToken},
      cb: (orders:any) => {
        const {msg, code, data} = orders;
        if (code!==0) {
          dispatch(ACTIONS.BASE.openToast({text: msg, types: 'error'}));
          setSubmitLoading(false);
          return;
        }
        // dispatch(ACTIONS.BASE.openToast({text: '投注成功', types: 'success'}));
        dispatch(ACTIONS.USER.getUserInfo({}));
        dispatch(ACTIONS.SPORT.showConfirmedOrder());
        dispatch(ACTIONS.SPORT.addConfirmedOrders(data));
        storage.remove('ORDER_TOKEN');
        betOrderMitt.emit({display: false});
        setSubmitLoading(false);
      },
    }));
  }, [orders, confirmSubmitStatus, seriesList]);
  return {
    addAndRemoveOrder,
    addOrder,
    removeOrder,
    removeAllOrder,
    updateOrder,
    orders,
    orderTags,
    confirmOrders,
    isExistConfirmed,
    setOrderMoney,
    submitSingleOrder,
    closeConfirmedOrder,
    removeConfirmedOrders,
    backOrdersDispaly,
    maxBalance,
    minBalance,
    updateOrderReserve,
    updateOrderReserveOdd,
    verifyOrderTokenThenSubmitSingleOrder,
    confirmSubmitStatus,
    setConfirmSubmitStatus,
    setConfirmAcceptChangeOdd,
    pullNewestOrdersOdd,
    submitLoading,
    setSubmitLoading,
    seriesList,
    updateSeriseOfMoney,
  };
};

