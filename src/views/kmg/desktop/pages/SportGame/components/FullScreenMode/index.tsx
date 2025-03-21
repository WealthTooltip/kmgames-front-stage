import {
  useEffect, useRef, useState,
} from 'react';
import {SwiperRef} from 'swiper/react';
import classnames from 'classnames';
// import useMatchDetail from '@core/hooks/sports/useMatchDetail';
// import DpIcon from '@views/kmg/desktop/components/Icon';
import DpEmpty from '@views/kmg/desktop/components/Empty';
// import DpCollapse from '@views/kmg/desktop/components/Collapse';
import {TMatch, TOrder} from '@core/services/Table';
import {useOddTransfer} from '@core/hooks/sports/useOddTransfer';
import useOrderCart from '@core/hooks/sports/useOrderCart';
// import Empty from '@views/kmg/desktop/components/Empty';
import {LockOutlined} from '@ant-design/icons';
import {
  getNameByhoa,
} from '@core/utils';
import styles from './style.scss';
import usePublicState from '@core/hooks/usePublicState';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import G from '@constants/global';

export default React.memo(() => {
  const container = useRef<HTMLDivElement>(null);
  // const {matchDetail} = useMatchDetail();
  // const [gameTypeIndex, setGameTypeIndex] = useState(0);
  // const {addAndRemoveOrder, orderTags} = useOrderCart();
  // const {getViewOdd} = useOddTransfer();
  const swiperRef = useRef<SwiperRef>(null);
  const [matchDetail, setMatchDetail] = useState<TMatch | undefined>(undefined);
  const [notInit, setNotInit] = useState(false);
  const detailUpdateTime = useSelector((state: TStore) => state.sport.display.detailUpdateTime);
  const {dispatch, ACTIONS} = usePublicState();

  useEffect(() => {
    if (detailUpdateTime === 0) {
      return;
    }
    setMatchDetail(G.GET('MATCH_DETAIL'));
  }, [detailUpdateTime]);
  useEffect(() => {
    if (!matchDetail) {
      if (notInit) {
        dispatch(ACTIONS.SPORT.updateDisplayFullScreen(false));
      }
      return;
    }
    setNotInit(true);
    if (swiperRef.current) swiperRef.current.swiper?.slideTo(0);
  }, [matchDetail?.matchId, notInit]);

  return (
    matchDetail ?
      (
        <div className={styles.wrapper} ref={container}>
          {/* <Medias match={matchDetail} />
          {(matchDetail.sportId == 1 || matchDetail.sportId == 2) ? (<FullScreenDetailHeader match={matchDetail} />) : (
            <div className='tennis-detail-header items-center flex' style={{position: 'relative'}}>
              <span>统计</span>
            </div>
          )}

          {matchDetail.sportId == 1 ? (<MatchDetailChart match={matchDetail} />) :
            (
              matchDetail.sportId == 2 ? (<BasketDetailChart match={matchDetail} />) :
                (matchDetail.sportId == 3 ? (<TennisDetailChart match={matchDetail} />) :
                  <IceDetailChart match={matchDetail} />)
            )} */}
        </div>
      ) :
      <DpEmpty className="mt-40" />
  );
});

export function OddItem({bil, kc, showTeam}: { bil: TOrder, kc: string, showTeam?: boolean }) {
  const {addAndRemoveOrder, orderTags} = useOrderCart();
  const {getViewOdd} = useOddTransfer();
  return (
    <div className={classnames('odd-item', {active: _.includes(orderTags, bil.tag), disabled: !bil.available}, bil.change)} key={bil.id} onClick={() => addAndRemoveOrder(bil)}>
      {
        bil.locked ?
          <LockOutlined /> :
          bil.available ?
            (
              <>
                {
                  showTeam === true && bil.betTeam && bil.betTeam !== bil.name &&
                  (
                    <span>
                      {getNameByhoa(bil.betTeam)}
                    </span>
                  )
                }
                {
                  bil.name &&
                  (
                    <span>
                      {getNameByhoa(bil.name)}
                    </span>
                  )
                }
                <span className={classnames('odd', {locked: bil.available})}>
                  {getViewOdd(bil.od, bil.oddBetType)}
                </span>
              </>
            ) :
            <span>-</span>
      }
    </div>
  );
}
