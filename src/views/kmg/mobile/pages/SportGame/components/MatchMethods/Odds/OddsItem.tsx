/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 18:47:00
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/Odds/OddsItem.tsx
 * @Description:
 */
import {mapBetItemName} from '@constants/enum/sport/betItemName';
import {TOrder} from '@core/services/Table';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import style from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';

export const LockItem = ({col = 3}: {col?: number}) => {
  return (
    <>
      {
        new Array(col).fill(0).map((_, index: number) => (<div key={index} className={style.item}>-</div>))
      }
    </>
  );
};

interface IOddItemProps {
  op: TOrder;
  oddType: number;
  methodCode: string;
  isInList?: boolean;
}
export const OddItem = ({op, oddType, methodCode, isInList}: IOddItemProps) => {
  const {addAndRemoveOrder} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  const odd = getViewOdd(op.od, op.oddBetType);
  if (op.ended) {
    return (
      <div className={style.item}>
        <span className='name'>{mapBetItemName[op?.name] || op.name}</span>
        <span>{odd}</span>
        <span className="result">
          <DpIcon type="result" active={op.win === 1} />
        </span>
      </div>
    );
  }

  if (!op.available) {
    return (
      <div className={style.item}>
        <img className='lock' src={require('./i/icon-lock.png')} alt='lock' />
      </div>
    );
  }

  return (
    <div className={style.item} onClick={() => addAndRemoveOrder(op)}>
      <span className='name'>
        {!isInList && methodCode.endsWith('_AH') && (op.betTeam?.toUpperCase() === 'HOME' ? op.teams.home.name : op.teams.away.name) } {mapBetItemName[op?.name] || op.name}
      </span>
      <span className={op.change}>{odd}</span>
    </div>
  );
};

export const EmptyOddItem = () => {
  return (
    <div className={style.item}>
      <span>-</span>
    </div>
  );
};
