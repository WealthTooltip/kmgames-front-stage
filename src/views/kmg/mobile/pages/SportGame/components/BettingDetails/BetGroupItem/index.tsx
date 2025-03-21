import React, {useCallback} from 'react';
import DpCollapse from '@this/components/Collapse';
import {getPlayNameByKc, transferBoDan} from '@core/utils';
import {TMatch} from '@core/services/Table';
import DpIcon from '@views/kmg/mobile/components/Icon';
import useTheme from '@core/hooks/useTheme';
import {EmptyOddItem, OddItem} from '../../MatchMethods/Odds/OddsItem';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import style from './style.scss';
import classnames from 'classnames';

interface IProps {
  play: TMatch['playTypes'][0];
  match: TMatch;
}

export default React.memo(({play, match}: IProps) => {
  const {mobileTheme} = useTheme();
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  const render = useCallback(() => {
    switch (play.code) {
      case 'HT_CS':
      case 'FT_CS':
        return (
          <div className="play-content">
            <div className="bd-list">
              {
                transferBoDan(play.mks[0].ops).map((bil, idx) => bil ? <OddItem key={bil.id} op={bil} oddType={currentOddType} methodCode={play.code} /> : <EmptyOddItem key={idx} />)
              }
            </div>
          </div>
        );
      default:
        return (
          <div className="play-content">
            <div className="play-list">
              {
                play.mks.map((market) => (
                  <div className={classnames('market-item', `col-${market.ops.length > 3 ? '2' : market.ops.length}`)} key={market.mkId}>
                    {
                      market.ops.map((bil) => (
                        <OddItem key={bil.id} op={bil} oddType={currentOddType} methodCode={play.code} />
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        );
    }
  }, [play]);
  return (
    <div className={style.wrapper}>
      <DpCollapse
        className="bet-group-item"
        header={
          <div className='play-name'>
            {getPlayNameByKc({code: play.code, name: play.name, ctid: play.ctid, sportId: match.sportId})}
            <div className="actions">
              <DpIcon className="icon" width={12} height={12} type="arrow" fill={mobileTheme.dpAncillary} />
            </div>
          </div>
        }
      >
        <div className="play-content">
          {
            render()
          }
        </div>
      </DpCollapse>
    </div>
  );
});
