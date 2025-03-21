import {Button, Tooltip} from 'antd';
import {useSelector} from 'react-redux';
import DpIcon from '@this/components/Icon';
import {formatCurrency} from '@helpers/unit';
import TStore from '@core/reducers/_reduxStore';
import {chooseEuropeOrAsiaText, displayHomeAwayScore, getBetHandiCapAtBetting, getBetTeamType, getPlayNameByKc, isPlayingMatch, isVisiableSecondText} from '@core/utils';
import React from 'react';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import styles from './style.scss';
const ConfrimedOrders = React.memo(() => {
  const orders = useSelector((state: TStore) => state.sport.bet.confirmOrders);
  const {isExistConfirmed, removeConfirmedOrders, backOrdersDispaly} = useOrderCart();
  return (
    <div className={styles.bet_list_onfrim_wrap}>
      <div className="bet-list">
        {
          orders.map((item) => (
            <div className="bet-item" key={item.id}>
              <div className='confirm-icon'>
                <DpIcon className='close' type='confirmed'/>
              </div>
              <div className="match-league">
                {item.details[0].leagueNameCn}
              </div>
              <div className="match-name">
                <span>{item.details[0].homeTeamNameCn} V {item.details[0].awayTeamNameCn}
                  {displayHomeAwayScore(item.details[0].scoreBenchmark, item.details[0].sportId)}
                </span>
              </div>
              <div className='market'>
                <div className='market-info'>
                  <span className='top-game-type-wrap'>
                    [{isPlayingMatch(item.details[0].isInplay)}]
                    <Tooltip title={getPlayNameByKc({code: item.details[0].kindsCode, name: item.details[0].betItemName, ctid: item.details[0].betItemCTID})}>
                      <em className='pl-6 play-name-text'>{getPlayNameByKc({code: item.details[0].kindsCode, name: item.details[0].betItemName, ctid: item.details[0].betItemCTID})}</em>
                    </Tooltip>
                  </span>
                  <span className='bet-game-type-text'>{chooseEuropeOrAsiaText(item.details[0].marketType, item.details[0].sportId)}</span>
                </div>
                <div className='team-win'>
                  <Tooltip className={getBetTeamType(item.details[0])?'':'display-none'} title={`${getBetTeamType(item.details[0])}`}>
                    {getBetTeamType(item.details[0])}
                    {
                      isVisiableSecondText(item.details[0].betHandicap) &&
                      <em>{getBetHandiCapAtBetting(item.details[0].betHandicap, item.details[0].sportId)}</em>
                    }
                  </Tooltip>
                  {item.isReserve == 1 && <span className='resere-text'>[预约]</span>}
                </div>
                <div className='odd'>
                  <div>@{formatCurrency(item.details[0].oddValue)}</div>
                </div>
              </div>
              <div className="amount-after">
                <div> 投注金额：{formatCurrency((item.productAmountTotal) || 0)}</div>
                <div> 最高可赢: {formatCurrency((item.maxWinAmount) || 0) }</div>
              </div>
            </div>
          ))
        }
      </div>
      {isExistConfirmed && (
        <div className='od-confirm'>
          您的订单已确认
        </div>
      )}
      <div className="action">
        <Button className="save" onClick={backOrdersDispaly}>
          保留选项
        </Button>
        <Button className="submit" type="primary" onClick={removeConfirmedOrders}>确认</Button>
      </div>
    </div>
  );
});
export default ConfrimedOrders;
