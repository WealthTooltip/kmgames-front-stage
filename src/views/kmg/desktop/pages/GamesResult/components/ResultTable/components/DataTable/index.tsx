// import {IconFilterDescending} from '@views/kmg/desktop/components/Icon';
import {ReactNode, useEffect, useState} from 'react';
import SingleDataRow from './SingleDataRow';
import styles from './style.scss';
import {TGameResultStatistic} from '@core/reducers/_reduxStore';
import {EGameResult} from '@core/constants/enum/sport/gamesResult';
import usePublicState from '@core/hooks/usePublicState';
import DpSkeleton from '@views/kmg/desktop/components/Skeleton';
import Empty from '@views/kmg/desktop/components/Empty';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import sportsCategory from '@core/constants/enum/sport/sportsCategory';
import {useGameResultListData} from '@core/hooks/sports/useRenderData';
import {Tooltip} from 'antd';
import {useScrollToTop} from '@core/hooks/misc';

export interface propTypes {
  tags: Record<EGameResult, ReactNode>,
  gamesResult: Array<TGameResultStatistic>
};

export default React.memo(() => {
  const tableRef = useScrollToTop();
  const {gamesResult, loading, noData} = useGameResultListData();
  const {sportId} = useSelector((state: TStore) =>state.sport.userSettings.gameResultPageInfo);
  const tags = _.find(sportsCategory, {sportId}).resultIcons;

  const {dispatch, ACTIONS} = usePublicState();
  const [viewDetail, setViewDetail] = useState<React.Key | null>(null);

  const handleDetailView = (key: React.Key) => {
    if (viewDetail === key) {
      setViewDetail(null);
    } else {
      dispatch(ACTIONS.SPORT.getGameResultDetail({
        params: {matchId: key},
      }));
      setViewDetail(key);
    }
  };

  useEffect(() => {
    setViewDetail(null);
  }, [gamesResult]);

  return (
    <div className={styles.wrapper}>
      <div className="header">
        <div className='body-row'>
          <span className='wide-element contain-filtering'>
            <span>日期</span>
            {/* <span><IconFilterDescending /></span> */}
          </span>
          <span className='wide-element'>联赛</span>
          <span className='wide-element'>赛事</span>
          {
            !!tags && Object.entries(tags).map(([key, icon])=> {
              return (
                <Tooltip key={key} title={icon.title} placement='bottom'>
                  <span>{icon.element}</span>
                </Tooltip>
              );
            })
          }
        </div>
      </div>
      <div className="table-body" ref={tableRef}>
        {noData && (
          <div className='no-record'>
            <Empty description='暂无数据' type="record" />
          </div>
        )}
        {loading && (
          <DpSkeleton type="game-result" length={7} />
        )}
        {gamesResult.length && !!tags ? gamesResult.map((row, idx) =>
          <SingleDataRow key={row.mid || idx} viewDetail={viewDetail} toggleIcon={handleDetailView} data={row} tags={tags} />,
        ) : <></>}
      </div>
    </div>
  );
});
