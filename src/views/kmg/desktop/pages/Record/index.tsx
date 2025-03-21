/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:38:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/index.tsx
 * @Description:
 */
import pageWrapper from '../../components/PageWrapper';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {Button, Pagination, Tabs, Select} from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Detail, TBettingOrder} from '@core/apis/models/dashboard/get-betting-record';
import {chooseEuropeOrAsiaText, displayHomeAwayScore, getBetGameTypes, getNameByhoa, getPlayNameByKc} from '@core/utils';
import {ALL_SPORTS_MAP, BET_RESULT_TYPE_MAP, EBetResultType, EOrderTypeStatus} from '@core/constants/enum/sport';
import dayjs from 'dayjs';
import {formatCurrency} from '@core/helpers/unit';
import {YYYYMMDDHHmmss, assignDateSearch} from '@helpers/dateHelper';
import {ORDER_STATUS_MAP, EOrderStatus} from '@core/constants/enum/sport/orderTypes';
import usePublicState from '@core/hooks/usePublicState';
import {DatePicker, Radio} from 'antd';
import styles from './style.scss';
import Empty from '../../components/Empty';
import useBetHistoryHooks from '@core/hooks/dashboard/useBetHistoryHooks';
import {ETHEME} from '../../configs';
const dates = [
  {label: '今日', val: assignDateSearch('today'), name: 'today'},
  {label: '昨日', val: assignDateSearch('yeastoday'), name: 'yeastoday'},
  {label: '七日内', val: assignDateSearch('pastWeek'), name: 'week'},
  {label: '30天内', val: assignDateSearch('month'), name: 'month'},
];
const tabs = [
  {label: '未结算注单', key: '0'},
  {label: '已结算注单', key: '1'},
  {label: '预约注单', key: '3'},
];
const reserveStats = [
  {label: '进行中', val: '0', name: '0'},
  {label: '已取消', val: '22', name: '22'},
  {label: '预约失败', val: '21', name: '21'},
];
export const Record = React.memo(() => {
  const mainRef = React.useRef(null);
  const {user} = usePublicState();
  const [activeTab, setActiveTab] = React.useState(EOrderTypeStatus.UNSETTLED);
  const [dateRange, setDateRange] = React.useState(assignDateSearch('today'));
  const [dateActive, setDateActive] = React.useState('today');
  const [statsActive, setStatsActive] = React.useState('0');
  const {list, getList, totalSize, params, totalInfo, showConfirm} = useBetHistoryHooks({pageNum: 1, pageSize: 50});
  const changePage = (pageNum:number, pageSize:number)=>{
    getList({pageNum, pageSize});
    mainRef.current.scrollTo({top: 0, behavior: 'smooth'});
  };
  const changeDate = (range:Array<number>)=>{
    const [start, end] =range;
    getList({...params, createTimeStart: start, createTimeEnd: end, pageNum: 1});
  };
  const changeStatus = (status: string)=>{
    getList({...params, pageNum: 1, status, billStatus: parseInt(status) > 0 ? '1' : '0'});
  };
  React.useEffect(()=>{
    getList({billStatus: 0, pageNum: 1, pageSize: 50});
  }, []);
  const handleChange = (val: number)=>{
    getList({...params, sortBy: val});
  };
  const getCurrentDateText = ()=>{
    const start = YYYYMMDDHHmmss(dateRange[0]);
    const end = YYYYMMDDHHmmss(dateRange[1]);
    if (!dateActive) return `${start}-${end}`;
    const date = dates.find((item)=>(item.name === dateActive));
    return date ? date.label : '';
  };
  const sortByRender = ()=>{
    return (
      <Select
        defaultValue={0}
        style={{width: 120}}
        onChange={handleChange}
        className='select-tab'
        options={[
          {value: 0, label: '默认排序'},
          {value: 1, label: '投注时间'},
          {value: 2, label: '开赛时间'},
          // {value: 1, label: '开赛时间'},
        ]}
      />
    );
  };
  return (
    <div className={styles.historyWrapper}>
      <div className='tabs'>
        <Tabs defaultActiveKey='0' items={tabs}
          onChange={(key)=>{
            setActiveTab(Number(key));
            const [createTimeStart, createTimeEnd] = assignDateSearch('today');
            setDateActive('today');
            setStatsActive('0');
            const billStatus = key === '1' ? key : '0';
            const isReserve = key === '3' ? '1' : '2';
            const status = key === '3' ? '0' : undefined;
            const tmParams:any = {billStatus, pageNum: 1, pageSize: 50, sortBy: undefined, createTimeStart: undefined, createTimeEnd: undefined, isReserve, status};
            getList(key === '1' ? {...tmParams, createTimeStart, createTimeEnd, sortBy: 0} : tmParams);
          }} />
        {activeTab=== EOrderTypeStatus.UNSETTLED && <span className='remark'>此记录将显示所有未派彩的投注</span>}
        {activeTab=== EOrderTypeStatus.SETTLED && <span className='remark'>此记录将显示{getCurrentDateText()}所有已派奖彩的投注</span>}
        {activeTab=== EOrderTypeStatus.RESERVER && <span className='remark'>此记录将显示所有已预约的投注</span>}
      </div>
      {
        activeTab=== EOrderTypeStatus.SETTLED && <div className='serach-bar'>
          <Radio.Group value={dateActive} buttonStyle='solid'>
            {
              dates.map((item)=>{
                return <Radio.Button
                  onChange={(e)=>{
                    setDateRange(item.val);
                    changeDate(item.val);
                    setDateActive(item.name);
                  }}
                  key={item.label}
                  value={item.name}>{item.label}</Radio.Button>;
              })
            }
          </Radio.Group>
          <div>
            {sortByRender()}
            <DatePicker.RangePicker
              allowClear={false}
              disabledDate={(current)=>(current && current>dayjs().endOf('day'))}
              value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
              onChange={(date)=>{
                const createTimeStart = dayjs(date[0]).startOf('day').valueOf();
                const createTimeEnd = dayjs(date[1]).endOf('day').valueOf();
                setDateRange([createTimeStart, createTimeEnd]);
              }}/>
            <Button className='search-btn' type='primary' shape='round' size={'middle'}
              onClick={()=>{
                changeDate(dateRange);
                setDateActive('');
              }}>查询</Button>
          </div>
        </div>
      }
      {
        activeTab === EOrderTypeStatus.RESERVER && <div className='serach-bar'>
          <Radio.Group value={statsActive} buttonStyle='solid'>
            {
              reserveStats.map((item)=>{
                return <Radio.Button
                  onChange={(e)=>{
                    setStatsActive(item.val);
                    changeStatus(item.val);
                  }}
                  key={item.label}
                  value={item.name}>{item.label}</Radio.Button>;
              })
            }
          </Radio.Group>
        </div>
      }
      <div className='main' ref={mainRef}>
        <ul className='header'>
          <li>编号</li>
          <li>投注详情</li>
          <li>投注玩法</li>
          <li>选项</li>
          <li>{activeTab === EOrderTypeStatus.RESERVER && '预约'}投注额 </li>
          {activeTab === EOrderTypeStatus.SETTLED && <li>返还金额</li>}
          {activeTab === EOrderTypeStatus.UNSETTLED && <li>最高可赢</li>}
          {(activeTab === EOrderTypeStatus.RESERVER && statsActive === '0') && <li>最高可赢</li>}
          <li>状态 </li>
        </ul>
        {list.map((item, idx: number) => <OrderItem showConfirm={showConfirm} activeTab={activeTab} data={item} key={item.id} idx={idx}/>)}
        {
          totalSize > 0 &&
          <div className='statistics'>
            <span >总计单数：<em className='bet-total'>{totalSize}</em></span>
            <span >总投注额：<em className='bet-total'>{formatCurrency(totalInfo.totalOrderAmount)}</em></span>
            {activeTab === EOrderTypeStatus.SETTLED && totalInfo.totalProfitAmount >= 0 &&
              <span className='bet-win'>赢：<em className='bet-win'>{formatCurrency(totalInfo.totalProfitAmount)}</em></span>}
            {activeTab === EOrderTypeStatus.SETTLED && totalInfo.totalProfitAmount < 0 &&
            <span className='bet-lose'>输：<em>{formatCurrency(totalInfo.totalProfitAmount)}</em></span>}
          </div>
        }
        {totalSize <= 0 && (
          <div className='no-record'>
            {user.theme === ETHEME.DARK && <Empty description='暂无数据' type="record" />}
            {user.theme !== ETHEME.DARK && <Empty description='暂无数据' type="record" />}
          </div>
        )}
      </div>
      <div className='pagination-wrap'>
        <Pagination current={params.pageNum} pageSize={params.pageSize} defaultCurrent={params.pageNum} total={totalSize}
          showQuickJumper
          locale={{items_per_page: '条/页', jump_to: '跳转至', page: '页'}}
          pageSizeOptions={[50, 100, 150, 200]}
          showSizeChanger
          onChange={(page, pageSize)=> {
            changePage(page, pageSize);
          }} />
      </div>
    </div>
  );
});
export default pageWrapper(Record, {title: 'DP体育', withFooter: false, withHeader: true});
interface IOrderItem {
  data: TBettingOrder;
  idx: number;
  activeTab: EOrderTypeStatus;
  showConfirm: (orderId: string) => void;
}
function OrderItem({data, idx, activeTab, showConfirm}: IOrderItem) {
  const {dispatch, ACTIONS} = usePublicState();
  const getBetTeamType = (info:Detail)=>{
    switch (info.betHomeOrAway) {
      case 'Home':
        return info.homeTeamNameCn;
      case 'Away':
        return info.awayTeamNameCn;
      default:
        return getNameByhoa(info.betHomeOrAway);
    }
  };
  const onCopy = () => {
    dispatch(ACTIONS.BASE.openToast({text: '已复制订单号', types: 'info'}));
  };
  return (
    <ul className='content' key={data.id}>
      <li>{idx+1}</li>
      <li>
        <span className='orderNo'>{data.id}</span>
        <div className='time'>
          <span>{dayjs(data.details[0]?.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <CopyToClipboard text={`${data.id}`} onCopy={onCopy}>
            <DpIcon type='copy' className='copy'/>
          </CopyToClipboard>
        </div>
      </li>
      <li>
        <div>
          <span className='match-type'>{data.details[0]?.isInplay === 1 ?'滚球' : '早盘'}</span>
          <span>{getPlayNameByKc({code: data.details[0]?.kindsCode, name: data.details[0]?.betItemName, ctid: data.details[0]?.betItemCTID})}</span>
        </div>
        <div className='score'>
          {data.billStatus === EOrderTypeStatus.UNSETTLED && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark, data.details[0].sportId)}</span>}
        </div>
      </li>
      <li className='r-4'>
        <span className='league-name'>[{ALL_SPORTS_MAP[data.details[0]?.sportId]}] {data.details[0]?.leagueNameCn}</span>
        <div className='match-info'>
          <span className='team-bet-type'> {getBetTeamType(data.details[0] || {} as Detail)}  {getBetGameTypes(data.details[0] || {} as Detail) }</span>
          <span className='odd'>@{formatCurrency(data.details[0]?.oddValue)}</span>
        </div>
        <span className='league-type'>{getPlayNameByKc({code: data.details[0]?.kindsCode, name: data.details[0]?.betItemName, ctid: data.details[0]?.betItemCTID})} {chooseEuropeOrAsiaText(data.details[0].marketType, data.details[0].sportId)}</span>
        <div className='teams'>
          {
            (data.status !== EOrderStatus.AUTO_CANCLLED && data.status !== EOrderStatus.MANUAL_CANCLLED && EOrderTypeStatus.SETTLED === data.billStatus) &&
            <span className={[EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult)?'win':'lose' }>
              {BET_RESULT_TYPE_MAP[data.details[0]?.betResult]}
            </span>
          }
          <span>{data.details[0]?.homeTeamNameCn}</span>
          <span className='m8'>vs</span>
          <span>{data.details[0]?.awayTeamNameCn}
            <em className='m8'>{EOrderTypeStatus.UNSETTLED === data.billStatus && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark, data.details[0].sportId)}</span>}</em>
          </span>
          {data.billStatus === EOrderTypeStatus.SETTLED && <span>{displayHomeAwayScore(data.details[0]?.scoreBenchmark, data.details[0].sportId)}</span> }
          <span style={{marginLeft: '8px'}}>{dayjs(data.details[0]?.beginTime).format('MM-DD HH:mm')}</span>
        </div>
        {(data.status !== EOrderStatus.AUTO_CANCLLED && data.status !== EOrderStatus.MANUAL_CANCLLED && data.billStatus == EOrderTypeStatus.SETTLED) &&
        <div className='settled-score'>全场比分 {displayHomeAwayScore(data.details[0]?.settleScore, data.details[0].sportId)}</div>}
      </li>
      {(data.status !== EOrderStatus.AUTO_CANCLLED && data.status !== EOrderStatus.MANUAL_CANCLLED) && (
        <li>
          <span>{formatCurrency(data.productAmountTotal) }</span>
        </li>
      )}
      {(data.billStatus === EOrderTypeStatus.SETTLED || data.status === 0) && (
        <li>
          {
            data.billStatus === EOrderTypeStatus.SETTLED &&
            [EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
            <span className='bet-win'>{formatCurrency(data.productAmountTotal + data.profitAmount)}</span>
          }
          {
            data.billStatus === EOrderTypeStatus.SETTLED &&
            ![EBetResultType.WIN, EBetResultType.WIN_HALF].includes(data.details[0]?.betResult) &&
            <span>{formatCurrency(data.productAmountTotal + data.profitAmount)}</span>
          }
          <span>{data.billStatus === EOrderTypeStatus.UNSETTLED && formatCurrency(data.maxWinAmount)}</span>
        </li>
      )}
      <li>
        <span
          className={`${activeTab === EOrderTypeStatus.RESERVER ? 'theme-color' : ''}`}
        >
          {activeTab === EOrderTypeStatus.RESERVER && data.status === 0 ? '预约中' : ORDER_STATUS_MAP[data.status]}
          {activeTab === EOrderTypeStatus.RESERVER && data.status === 0 && (
            <div
              className="cancel-btn"
              onClick={() => showConfirm(`${data.id}`)}
            >
              取消
            </div>
          )}
        </span>
      </li>
    </ul>
  );
};
