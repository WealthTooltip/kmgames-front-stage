/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/index.tsx
 * @Description:
 */

import {OddType, PlayType} from '@core/services/Table';
import useOrderCart from '@core/hooks/sports/useOrderCart';
import classnames from 'classnames';
import {mapBetItemName} from '@constants/enum/sport/betItemName';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import {LockOutlined} from '@ant-design/icons';
import styles from './style.scss';

interface IProps {
  markets: (undefined | PlayType)[]
  sportId: number;
  gameList: string[];
}

export default React.memo(({markets, sportId, gameList}: IProps) => (
  <div className={classnames(styles.wrapper)}>
    {
      markets.map((market, mkidx) => (
        <div className="match-odds-box" key={mkidx}>
          <div className="team-odds">
            { !market && <LockedOdd code={gameList[mkidx]} /> }
            {
              market?.mks?.[0] &&
                (
                  <div className="team-odds-list">
                    {
                      market.mks[0].ops.map((op: OddType) => <SingleOddItem code={market.code} op={{...op, sportId}} key={op.id} />)
                    }
                  </div>
                )
            }
          </div>
        </div>
      ))
    }
  </div>
));

export const SingleOddItem = React.memo(({op, code}: {op: OddType, code: string}) => {
  const {getViewOdd} = useOddTransfer();
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const className = ['team-odds-item', op.available ? 'between' : 'disabled', _.includes(orderTags, op.tag) ? 'active' : '', op.change];

  function OddContent() {
    if (op.locked) {
      return <LockOutlined />;
    }
    if (!op.available) {
      return <span>-</span>;
    }
    return (
      <>
        <span className={classnames({'text-theme text-num': /^[+-]?[\d]+(?:\.\d+)?(?:[+\-*/]\d+(?:\.\d+)?)?$/.test(mapBetItemName[op?.name] || op.name)})}>
          { (mapBetItemName[op?.name] || op.name).split(' ').map((_: string, midx: number) => (<span className={classnames({'text-theme text-num': midx === 1, 'ml-2': midx === 1})} key={midx}>{_}</span>)) }
        </span>
        <span className={classnames('odd')}>
          { getViewOdd(op.od, op.oddBetType) }
        </span>
      </>
    );
  }

  return (
    <div className={className.join(' ')} onClick={() => addAndRemoveOrder(op)}>
      <OddContent />
    </div>
  );
});

export const LockedOdd = React.memo(({code}: {code: string}) => (
  <div className="team-odds-list disabled">
    <div className="team-odds-item">
      <span>-</span>
    </div>
    <div className="team-odds-item">
      <span>-</span>
    </div>
    {
      code?.endsWith('_1X2') &&
      <div className="team-odds-item">
        <span>-</span>
      </div>
    }
  </div>
));
