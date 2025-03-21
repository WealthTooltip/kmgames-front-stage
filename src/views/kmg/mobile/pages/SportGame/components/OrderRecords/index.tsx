import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import Overlay from '@template/components/OverlayBackdropClose';
import {TBettingOrder} from '@core/apis/models/dashboard/get-betting-record';
import {ALL_SPORTS_MAP, BET_RESULT_TYPE_MAP, EBetResultType, EOrderTypeStatus} from '@core/constants/enum/sport';
import {EOrderStatus} from '@core/constants/enum/sport/orderTypes';
import {ORDER_STATUS_MAP} from '@core/constants/enum/sport/orderTypes';
import useBetHistoryHooks from '@core/hooks/dashboard/useBetHistoryHooks';
import useNavigationHooks from '@core/hooks/sports/useNavigation';
import usePublicState from '@core/hooks/usePublicState';
import {getPlayNameByKc, displayHomeAwayScore, getBetTeamType, isVisiableSecondText, getBetHandiCapAtBetting, chooseEuropeOrAsiaText} from '@core/utils/index';
import {formatCurrency} from '@core/helpers/unit';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import DpIcon from '@views/kmg/mobile/components/Icon';
import DpSwitchButton from '@this/components/SwitchButton';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import style from './style.scss';

const betTypes =[
  {label: '未结算注单', key: '0', value: EOrderTypeStatus.UNSETTLED},
  {label: '已结算注单', key: '1', value: EOrderTypeStatus.SETTLED},
  {label: '预约注单', key: '3', value: `sub-${EOrderTypeStatus.ABNORMAL}`},
];
const reserveTypes =[
  {label: '进行中', key: '0', value: EOrderStatus.PENDING},
  {label: '已取消', key: '21', value: EOrderStatus.MANUAL_CANCLLED},
  {label: '预约失败', key: '22', value: EOrderStatus.AUTO_CANCLLED},
];
export default () => {
  const {list, getList, showConfirm} = useBetHistoryHooks({pageNum: 1, pageSize: 200});
  const orderHistoryStatus = useSelector((state: TStore) => state.base.mobile.orderHistoryStatus);
  const [betType, setBetType] = useState<EOrderTypeStatus | string>(EOrderTypeStatus.UNSETTLED);
  const [reserveType, setReserveType] = useState(EOrderStatus.PENDING);
  const {toggleMobileOrderHistory} = useNavigationHooks();
  useEffect(()=>{
    orderHistoryStatus > -1 && getList({billStatus: orderHistoryStatus, pageNum: 1, pageSize: 50});
  }, [orderHistoryStatus]);

  useEffect(()=>{
    setReserveType(EOrderStatus.PENDING);
    let billStatus = (betType === EOrderTypeStatus.SETTLED || (betType === `sub-${EOrderTypeStatus.ABNORMAL}` && reserveType !== EOrderStatus.PENDING)) ? '1' : '0';
    if (betType === `sub-${EOrderTypeStatus.ABNORMAL}`) {
      billStatus = undefined;
    }
    getList({
      billStatus,
      pageNum: 1,
      pageSize: 50,
      isReserve: betType === `sub-${EOrderTypeStatus.ABNORMAL}` ? '1' : '2',
    });
  }, [betType]);
  const close = () => {
    setBetType(EOrderTypeStatus.UNSETTLED);
    setReserveType(EOrderStatus.PENDING);
    toggleMobileOrderHistory(-1, -1);
  };
  return (
    <>
      {orderHistoryStatus < 0 ? (
        <></>
      ) : (
        <Overlay
          display
          zIndex={10}
          close={close}
          hasMask
          containerStyle={{height: 'max-content', minHeight: '100vh'}}
          containerClassname="order-record-overlay"
        >
          <div className={style.wrapper}>
            <div className='placeholder' onClick={close} />
            {orderHistoryStatus === 0 && (
              <div>
                <DpSwitchButton
                  value={betType}
                  items={betTypes}
                  onChange={(item:number)=>setBetType(item)}
                  subValue={reserveType}
                  subItems={reserveTypes}
                  subOnChange={(item:number)=>setReserveType(item)}
                  hideSub={betType === `sub-${EOrderTypeStatus.ABNORMAL}` && list.length < 1}
                />
              </div>
            )}
            {((betType === `sub-${EOrderTypeStatus.ABNORMAL}` && list.filter((data) => data.status === reserveType).length < 1) || list.length < 1) && <OrderItem empty reserveType={reserveType} betType={betType} />}
            {betType !== `sub-${EOrderTypeStatus.ABNORMAL}` && list.map((item) => <OrderItem showConfirm={showConfirm} data={item} key={item.id} betType={betType} />)}
            {betType === `sub-${EOrderTypeStatus.ABNORMAL}` && list.filter((data) => data.status === reserveType).map((item) => <OrderItem showConfirm={showConfirm} data={item} key={item.id} betType={betType} />)}
          </div>
        </Overlay>
      )}
    </>
  );
};
interface IOrderItem {
  data?: TBettingOrder;
  betType?: EOrderTypeStatus | string;
  reserveType?: EOrderStatus;
  showConfirm?: (orderId: string, isH5: boolean) => void;
  empty?: boolean;
}
function OrderItem({data, betType, reserveType, showConfirm, empty = false}: IOrderItem) {
  const {dispatch, ACTIONS} = usePublicState();
  const onCopy = () => {
    dispatch(ACTIONS.BASE.openToast({text: '已复制订单号', types: 'info'}));
  };
  return (
    <div className={`order-card${empty ? '-empty' : ''}`}>
      {empty ? (
        <>
          <img src={require('@this/assets/images/betting-card/empty-history.svg')} alt="" />
          {betType === EOrderTypeStatus.UNSETTLED && <p>您暂时无未结算数据</p>}
          {betType === EOrderTypeStatus.SETTLED && <p>您暂时无已结算数据</p>}
          {(betType ===`sub-${EOrderTypeStatus.ABNORMAL}` && reserveType === EOrderStatus.PENDING) && <p>您暂时无预约中数据</p>}
          {(betType ===`sub-${EOrderTypeStatus.ABNORMAL}` && reserveType === EOrderStatus.MANUAL_CANCLLED) && <p>您暂时无取消预约数据</p>}
          {(betType ===`sub-${EOrderTypeStatus.ABNORMAL}` && reserveType === EOrderStatus.AUTO_CANCLLED) && <p>您暂时无预约失败数据</p>}
        </>
      ) : (
        <>
          <div className="order-match-name">
            <div>{data.details[0]?.homeTeamNameCn}</div>
            <div>VS</div>
            <div>{data.details[0]?.awayTeamNameCn}</div>
          </div>
          <div className="order-match-info">
            <div>投注项: [{ALL_SPORTS_MAP[data.details[0]?.sportId]}] {getPlayNameByKc({code: data.details[0]?.kindsCode, name: data.details[0]?.betItemName, ctid: data.details[0]?.betItemCTID, sportId: data.details[0]?.sportId})}</div>
            <div>
              <em className='play-name'>{getBetTeamType(data.details[0])}
                {isVisiableSecondText(data.details[0].betHandicap) && <em>{getBetHandiCapAtBetting(data.details[0].betHandicap, data.details[0].sportId)}</em>}
              </em>
              <em className='odd-val'>@{formatCurrency(data.details[0]?.oddValue)}</em>
            </div>
            {betType !== `sub-${EOrderTypeStatus.ABNORMAL}` && (
              <div>
                下注时比分
                {' '}
                {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark)}</span>}
                {data.billStatus === EOrderTypeStatus.SETTLED && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark)}</span>}
              </div>
            )}
          </div>
          <div className="order-match-detail">
            <div>投注单号：</div>
            <div className='order-match-id'>
              <div>
                {data.id}
              </div>
              <CopyToClipboard text={`${data.id}`} onCopy={onCopy}>
                <DpIcon type='copy' className='copy'/>
              </CopyToClipboard>
            </div>
          </div>
          <div className="order-match-detail">
            <div>投注时间：</div>
            <div>
              {dayjs(data.details[0]?.createTime).format('YYYY/MM/DD HH:mm:ss')}
              {chooseEuropeOrAsiaText(data.details[0].marketType, data.details[0].sportId)}
            </div>
          </div>
          <div className="order-match-detail">
            <div>[{ALL_SPORTS_MAP[data.details[0]?.sportId]}] {data.details[0]?.leagueNameCn}</div>
          </div>
          <div className="order-match-detail">
            <div>{betType === `sub-${EOrderTypeStatus.ABNORMAL}` ? '预约金额' : '投注额：'}</div>
            <div>{formatCurrency(data.productAmountTotal)} 元</div>
          </div>
          <div className="order-match-detail blue">
            <div>{data.billStatus === EOrderTypeStatus.SETTLED ? '返还金额' :'可赢额'}：</div>
            <div>
              {
                data.billStatus === EOrderTypeStatus.SETTLED &&
                [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
                <span className='bet-win'>{BET_RESULT_TYPE_MAP[data.details[0]?.betResult]} {formatCurrency(data.productAmountTotal + data.profitAmount)} 元</span>
              }
              {
                data.billStatus === EOrderTypeStatus.SETTLED &&
                ![EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
                <span>{BET_RESULT_TYPE_MAP[data.details[0]?.betResult]} {formatCurrency(data.productAmountTotal + data.profitAmount)} 元</span>
              }
              {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{formatCurrency(data.maxWinAmount)} 元</span>}
            </div>
          </div>
          <div className="order-match-detail">
            <div>注单状态：</div>
            <div className={`${(betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status === 0) ? 'blue' : ''}${(betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status !== 0) ? 'red' : ''}`}>
              {betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status === 0 ? '预约中' : ORDER_STATUS_MAP[data.status]}
            </div>
          </div>
          {(betType === `sub-${EOrderTypeStatus.ABNORMAL}` && data.status === 0) && (
            <div
              className="order-match-button"
              onClick={() => showConfirm(`${data.id}`, true)}
            >
              取消预约
            </div>
          )}
          {betType === EOrderTypeStatus.UNSETTLED && (
            <div className="order-match-tips">
              提前兑现规则声明 <img src={require('./i/info.png')} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
