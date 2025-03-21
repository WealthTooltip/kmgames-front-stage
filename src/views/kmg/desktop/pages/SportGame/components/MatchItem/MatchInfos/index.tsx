/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchItem/MatchInfos/index.tsx
 * @Description:
 */
import dayjs from 'dayjs';
import classnames from 'classnames';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {TMatch} from '@core/services/Table';
import {Tooltip} from 'antd';
import Timer from '@views/kmg/desktop/components/Timer';
import styles from './style.scss';
import {getMatchStatusByPeriod} from '@core/utils';
import DpImage from '@this/components/Image';
import useFavorites from '@core/hooks/sports/useFavorites';
import useZoomMatch from '@core/hooks/sports/useZoomMatch';
import usePublicState from '@core/hooks/usePublicState';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
interface IProps {
  match: TMatch;
}

export default React.memo(({match}: IProps) => {
  const {isFavorite, onToggleFavorite} = useFavorites();
  const {dispatch, ACTIONS} = usePublicState();
  const {openZoom} = useZoomMatch();
  const onOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    openZoom(match.matchId);
  };
  const matchListUpdateTime = useSelector((state: TStore) => state.sport.display.matchListUpdateTime);
  const openDetail = () => {
    sessionStorage.removeItem('media');
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
  };

  return (
    <>
      <div className={classnames(styles.match_status, 'border-right', 'pointer')} onClick={openDetail}>
        {
          match.matchClock.isRunning ?
            (
              <>
                <p>{getMatchStatusByPeriod(match.matchClock.period)}</p>
                {
                  (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) &&
                (
                  <p>
                    {
                      match.sportId === 1 ? <Timer seconds={match.matchClock.second} key={`${match.matchId}_${match.matchClock.second}_${matchListUpdateTime}`} /> : <span>{match.matchClock.playTime}</span>
                    }
                  </p>
                )
                }
              </>
            ) :
            (
              <>
                <p>{dayjs(match.matchClock.startTime).format('MM月DD日')}</p>
                <p className="mt-8">{dayjs(match.matchClock.startTime).format('HH:mm')}</p>
              </>
            )
        }
      </div>
      <div
        className={classnames(styles.team_info, 'pointer')}
        onClick={() => dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}))}>
        <div className='team'>
          <DpImage type='team' src={match.teams.home.icon} />
          <div className={classnames('team-name', {'text-red text-bold': match.teams.home.isHandicap})} onClick={onOpen}>
            <Tooltip title={match.teams.home.name} placement='top'>
              {match.teams.home.name}
            </Tooltip>
            {match.score.homeRedCard > 0 && <span className="red-card">{match.score.homeRedCard}</span>}
          </div>
          {!!match.matchClock.period && <div className='team-score'>{match.score.home}</div>}
        </div>
        <div className='team'>
          <DpImage type='team' src={match.teams.away.icon} />
          <div className={classnames('team-name', {'text-red text-bold': match.teams.away.isHandicap})} onClick={onOpen}>
            <Tooltip title={match.teams.away.name} placement='top'>
              {match.teams.away.name}
            </Tooltip>
            {match.score.awayRedCard > 0 && <span className="red-card">{match.score.awayRedCard}</span>}
          </div>
          {!!match.matchClock.period && <div className='team-score'>{match.score.away}</div>}
        </div>
        <div className='other'>
          <div className='icons'>
            {
              match.isNe &&
              <Tooltip title='中立场'>
                <span />
                <DpIcon className='mr-5' active={match.isNe} width={16} height={16} type='n' />
              </Tooltip>
            }
            <Tooltip title='收藏'>
              <span />
              <DpIcon className='mr-5' width={16} height={16} active={isFavorite([match.matchId])} type={'collect'} onClick={(e) => onToggleFavorite(e, [match.matchId])} />
            </Tooltip>
            <Tooltip title='数据'>
              <span />
              <DpIcon className='mr-5' width={16} height={16} type='chart' />
            </Tooltip>
          </div>
          <div className='play-total flex items-center' onClick={onOpen}>
            <Tooltip title='全部玩法'>
              <div className="flex items-center">
                <div>
                  +{match.playTypeCount}
                </div>
                <DpIcon type='arrow' />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
});
