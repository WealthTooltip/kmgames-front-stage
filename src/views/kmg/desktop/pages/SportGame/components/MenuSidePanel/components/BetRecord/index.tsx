import {TBettingOrder} from '@core/apis/models/dashboard/get-betting-record.d';
import {BET_RESULT_TYPE_MAP, EBetResultType, EOrderTypeStatus} from '@constants/enum/sport/index';
import {formatCurrency} from '@helpers/unit';
import style from './style.scss';
import Empty from '@views/kmg/desktop/components/Empty';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {ORDER_STATUS_MAP, EOrderStatus} from '@core/constants/enum/sport/orderTypes';
import {chooseEuropeOrAsiaText, displayHomeAwayScore, getBetHandiCapAtBetting, getBetTeamType, getPlayNameByKc, isPlayingMatch, isVisiableSecondText} from '@core/utils';
import {useInView} from 'react-intersection-observer';
import {Radio, Tooltip} from 'antd';
import useBetRecordHooks from '@core/hooks/dashboard/useBetRecordHooks';
import {assignDateSearch} from '@core/helpers/dateHelper';
import classnames from 'classnames';

interface IProps {
  hideBetRecord: () => void;
}
const betTypes :any = [
  {label: '未结算', key: EOrderTypeStatus.UNSETTLED, value: EOrderTypeStatus.UNSETTLED},
  {label: '已结算', key: EOrderTypeStatus.SETTLED, value: EOrderTypeStatus.SETTLED},
  {label: '预约', key: EOrderTypeStatus.RESERVER, value: EOrderTypeStatus.RESERVER},
];
export default React.memo(({hideBetRecord}: IProps) => {
  const {list, getList, params, hasMore, loading, showConfirm} = useBetRecordHooks({pageNum: 1, pageSize: 10});
  const [betType, setBetType] = React.useState(EOrderTypeStatus.UNSETTLED);
  const [reserveType, setReserveType] = React.useState(0);
  const {ref, inView} = useInView();
  React.useEffect(()=>{
    const [start, end] = assignDateSearch('today24');
    const searchParams = {billStatus: 0, pageNum: 1, createTimeStart: start, createTimeEnd: end};
    const stateParams = {isAdd: false, isInit: true};
    setReserveType(0);
    if (betType === EOrderTypeStatus.UNSETTLED) {
      getList({...searchParams, isReserve: 2}, stateParams);
    } else if (betType === EOrderTypeStatus.RESERVER) {
      getList({...searchParams, billStatus: undefined, isReserve: 1}, stateParams);
    } else {
      getList({...searchParams, billStatus: 1, isReserve: 2, status: undefined}, stateParams);
    };
  }, [betType]);
  React.useEffect(()=>{
    if (inView && !loading) {
      getList({pageNum: params.pageNum + 1}, {isAdd: true, isInit: false});
    }
  }, [inView]);
  return (
    <div className={style.wrapper}>
      <div className='menu-item'>
        <img src={require('../../i/icon-bet-record.png')} />
        <span className='name'>投注记录</span>
      </div>
      <div className='go-back' onClick={hideBetRecord}>
        <DpIcon type='goback' />
        <span>返回联赛导航</span>
      </div>
      <div className='switch-type'>
        <Radio.Group
          options={betTypes}
          onChange={(e)=>setBetType(e.target.value)}
          value={betType}
          optionType='button'
          buttonStyle="solid"
        />
      </div>
      {
        betType === EOrderTypeStatus.RESERVER && <div className='reserve-tab'>
          <div className={classnames(reserveType === 0 ? 'active' : '')} onClick={()=>(setReserveType(0))}>
            <span className='text'>进行中</span>
            <span className='line'></span>
          </div>
          <div className={classnames(reserveType === 22 ? 'active' : '')} onClick={()=>(setReserveType(22))}>
            <span className='text'>已取消</span>
            <span className='line'></span>
          </div>
          <div className={classnames(reserveType === 21 ? 'active' : '')} onClick={()=>(setReserveType(21))}>
            <span className='text'>预约失败</span>
            <span className='line'></span>
          </div>
        </div>
      }
      <div className='order-list'>
        {betType !== EOrderTypeStatus.RESERVER && list.map((item, idx: number) => <OrderItem showConfirm={showConfirm} data={item} key={idx} betType={betType}/>)}
        {betType === EOrderTypeStatus.RESERVER && list.filter((data) => data.status === reserveType).map((item, idx: number) => <OrderItem showConfirm={showConfirm} data={item} key={idx} betType={betType}/>)}
        {loading && hasMore && list.length>0 && <div ref={ref}>正在加载中...</div>}
        {/* {!hasMore && list.length>0 && <div className='more-data'>已加载完全部数据</div>} */}
        {((betType === EOrderTypeStatus.RESERVER && list.filter((data) => data.status === reserveType).length < 1) || list.length < 1) && (
          <div className='dp-empty-wrap center'>
            <Empty description='暂无数据' type="empty" />
          </div>
        )}
      </div>
    </div>
  );
});

interface IOrderItem {
  data: TBettingOrder;
  betType:EOrderTypeStatus;
  showConfirm: (orderId: string) => void;
}
function OrderItem({data, betType, showConfirm}: IOrderItem) {
  return (
    <div className='order-item'>
      <div className='game-type'>
        <span className='line'></span>
        <span className='type-name'>{data.seriesType === 1 ? '单关' : '串关'}</span>
      </div>
      <div className='game-main'>
        {betType === EOrderTypeStatus.RESERVER && (
          <div className='reserve-status'>
            <div className='reserve-text'>
              {data.status === 0 ? '预约中' : ORDER_STATUS_MAP[data.status]}
            </div>
            {data.status === 0 && (
              <div
                className="cancel-btn"
                onClick={() => showConfirm(`${data.id}`)}
              >
                取消
              </div>
            )}
          </div>
        )}
        <div className='league-name'>{data.details[0].leagueNameCn}</div>
        <div className='match-names'>
          <Tooltip
            title={`${data.details[0].homeTeamNameCn} v ${data.details[0].awayTeamNameCn}`}
            placement='top'>
            {data.details[0].homeTeamNameCn} v {data.details[0].awayTeamNameCn}
            {data.status !== EOrderStatus.AUTO_CANCLLED && data.status !== EOrderStatus.MANUAL_CANCLLED && EOrderTypeStatus.UNSETTLED === data.billStatus && displayHomeAwayScore(data.details[0].scoreBenchmark, data.details[0].sportId)}
            {data.status !== EOrderStatus.AUTO_CANCLLED && data.status !== EOrderStatus.MANUAL_CANCLLED && EOrderTypeStatus.SETTLED === data.billStatus && displayHomeAwayScore(data.details[0].settleScore, data.details[0].sportId)}
          </Tooltip>
        </div>
        <div className='bet-detail'>
          <div className='l-1'>
            <span>
              <Tooltip title={`[${data.details[0].sportNameCn}]`}>
                <em>[{data.details[0].sportNameCn}]</em>
              </Tooltip>
              <Tooltip title={getPlayNameByKc({code: data.details[0].kindsCode, name: data.details[0].betItemName, ctid: data.details[0].betItemCTID})}>
                <em className='play-name-text'>{isPlayingMatch(data.details[0].isInplay)}&nbsp;{getPlayNameByKc({code: data.details[0].kindsCode, name: data.details[0].betItemName, ctid: data.details[0].betItemCTID})}</em>
              </Tooltip>
            </span>
            <span className='bet-game-type-text'>{chooseEuropeOrAsiaText(data.details[0].marketType, data.details[0].sportId)}</span>
          </div>
          <div className='l-2'>
            <Tooltip title={`${getBetTeamType(data.details[0])}`}>
              <em className='play-type-name'>{getBetTeamType(data.details[0])}</em>
              {isVisiableSecondText(data.details[0].betHandicap) &&
                <em>{getBetHandiCapAtBetting(data.details[0].betHandicap, data.details[0].sportId)}</em>}
            </Tooltip>
          </div>
          <div className='l-3'>
            <div className='odd'>
              <span>@</span>
              <span>{formatCurrency(data.details[0].oddValue)}</span>
            </div>
            <div className='bet-result'>
              {
                (data.status !== EOrderStatus.AUTO_CANCLLED && data.status !== EOrderStatus.MANUAL_CANCLLED && data.billStatus == EOrderTypeStatus.SETTLED) &&
                <span className={[EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0].betResult) ? 'win':'lose'}>
                  {BET_RESULT_TYPE_MAP[data.details[0].betResult]}
                </span>
              }
            </div>
          </div>
        </div>
        <div className='bet-win'>
          <span>投注金额：{formatCurrency(data.productAmountTotal)}</span>
          {
            data.billStatus == EOrderTypeStatus.UNSETTLED && <span>最高可赢：{formatCurrency(data.maxWinAmount)}</span>
          }
          {
            data.billStatus == EOrderTypeStatus.SETTLED && <span>返还金额：{formatCurrency(data.profitAmount + data.productAmountTotal)}</span>
          }
        </div>
      </div>
    </div>
  );
}
