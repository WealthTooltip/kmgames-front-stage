/*
 * @Author: Galen.GE
 * @Date: 2024-01-19 11:59:17
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/BetCart/SingleCart/index.tsx
 * @Description:
 */
import Overlay from '@template/components/Overlay';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import successNotice from './i/success_notice.svg';
import style from './style.scss';
import {formatCurrency} from '@core/helpers/unit';
import {getBetHandiCapAtBetting, getBetTeamType, getPlayNameByKc, isVisiableSecondText} from '@core/utils';

export default () => {
  const {confirmOrders, removeConfirmedOrders} = useOrderCart();
  const close = ()=>{
    removeConfirmedOrders();
  };
  if (_.isEmpty(confirmOrders)) return null;
  return (
    <Overlay display={!_.isEmpty(confirmOrders)} zIndex={10} close={close}>
      <div className={style.noticeWrapper}>
        <div className='icon-success'>
          <img src={successNotice}/>
          {confirmOrders[0].isReserve === 1 && <em>预约注单已确认</em>}
          {confirmOrders[0].isReserve === 2 && <em>注单已确认</em>}
        </div>
        <div className='score-info'>
          <div className='odds'>
            <em>
              {getBetTeamType(confirmOrders[0].details[0])}
              {
                isVisiableSecondText(confirmOrders[0].details[0].betHandicap) &&
                <em>{getBetHandiCapAtBetting(confirmOrders[0].details[0].betHandicap, confirmOrders[0].details[0].sportId)}</em>
              }
            </em>
            <p>
              <span>@</span>
              <span>{formatCurrency(confirmOrders[0].details[0].oddValue)}</span>
            </p>
          </div>
          <div className='info-content'>
            <ul className='info-list'>
              <li>{getPlayNameByKc({code: confirmOrders[0].details[0].kindsCode, name: confirmOrders[0].details[0].betItemName, ctid: confirmOrders[0].details[0].betItemCTID})}</li>
              <li>{`${confirmOrders[0].details[0].homeTeamNameCn} V ${confirmOrders[0].details[0].awayTeamNameCn}`}</li>
              <li>{confirmOrders[0].details[0].leagueNameCn}</li>
            </ul>
          </div>
        </div>
        <ul className='bet-info'>
          <li>
            {<span>下注金额</span>}
            <span>{formatCurrency(confirmOrders[0].productAmountTotal)}</span>
          </li>
          <li>
            <span>可赢金额</span>
            <span>{formatCurrency(confirmOrders[0].maxWinAmount)}</span>
          </li>
          <li>
            {confirmOrders[0].isReserve === 1 && <span>预约单号</span>}
            {confirmOrders[0].isReserve === 2 && <span>注单单号</span>}
            <span className='order-num'>{confirmOrders[0].id}</span>
          </li>
        </ul>
        <div className='confirm-btn' onClick={()=>(close())}>
          <button>确认</button>
        </div>
      </div>
    </Overlay>
  );
};
