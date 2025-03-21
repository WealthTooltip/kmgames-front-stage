// @ts-nocheck
import useOrderCart from '@core/hooks/sports/useOrderCart';
import {TOrder} from '@core/services/Table';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {getBetHandiCapAtBetting, getCurrentOddTypeText, getOrderBetTypeAtBetting, getPlayNameByKc, getTeamScoreByCtipType, isVisiableSecondText} from '@core/utils';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import {Tooltip} from 'antd';
import dayjs from 'dayjs';
import {formatCurrency} from '@core/helpers/unit';
import FastBetBtnSComponent from './fastBetBtns';
import classnames from 'classnames';

import usePublicState from '@core/hooks/usePublicState';
import {Series} from '@core/apis/models/dashboard/get-betting-record';
interface IProps{
  showOdd?: boolean;
  data?: Series;
  inputRef:{[key: string]: any},
}
const OrderItem = React.memo(({data, showOdd, inputRef}: IProps) => {
  const {updateSeriseOfMoney} = useOrderCart();
  const handleChangeBalance = (id: string)=>{
    updateSeriseOfMoney(id, '');
    inputRef.current[id].value = '';
  };
  return (
    <div className={classnames('bet-item')} key={data.id}>
      <div className='multiple-r-1'>
        <em className='name'>{data.firstText}串{data.secondText}</em>
        {showOdd && <em className='odds-total'>{data.oddsTotal}</em>}
      </div>
      <div className='input-box'>
        <input placeholder={`限额${data.minBetAmount} ~ ${data.maxBetAmount}`} type='text'
          ref={(ref) => inputRef.current[data.id] = ref}
          onChange={(e) =>updateSeriseOfMoney(data.id, e.target.value)}/>
        <span className='x-wrap'>{data.multiple}X</span>
        {data.money ? <div className='close-input' onClick={() => handleChangeBalance(data.id)}></div> : <></>}
      </div>
      <div className="amount-after flex-end">
        <div>
          最高可赢: <span>{formatCurrency((0)) }</span>
        </div>
      </div>
    </div>
  );
});
export default OrderItem;
