/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 15:51:00
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/components/MatchMethods/index.tsx
 * @Description:
 */
import {TMatch} from '@core/services/Table';
import useFavorites from '@core/hooks/sports/useFavorites';
import CountdownLite from '@this/pages/SportGame/components/CountdownLite';
import Odds from './Odds';
import style from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import {getMatchStatusByPeriod} from '@core/utils';
import usePublicState from '@core/hooks/usePublicState';
import {useSelector} from 'react-redux';
import IStore from '@core/reducers/_reduxStore.d';
import dayjs from 'dayjs';
import classnames from 'classnames';

interface IMatchMethodsProps {
  match: TMatch;
}
export default ({match}: IMatchMethodsProps) => {
  const {dispatch, ACTIONS} = usePublicState();
  const {isFavorite, onToggleFavorite} = useFavorites();
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const handleOpenDetail = () => {
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    dispatch(ACTIONS.SPORT.switchVisiabelByDetail(true));
  };
  return (
    <div className={style.wrapper}>
      {
        <>
          <div className="phase">
            <DpIcon className='mr-6' type="collect" active={isFavorite([match.matchId])} onClick={(e) => onToggleFavorite(e, [match.matchId])} />
            {
              match.matchClock.isRunning ? <>
                <span className="mr-4">
                  {getMatchStatusByPeriod(match.matchClock.period)}
                </span>
                {
                  (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) && match.sportId === 1 ?
                  <CountdownLite seconds={match.matchClock.second} key={`${match?.matchId}_${match.matchClock.second}_${matchListUpdateTime}`} /> :
                  <span>{match.matchClock.playTime}</span>
                }
              </> : <span>{dayjs(match.matchClock.startTime).format('MM月DD日 HH:mm')}</span>
            }
            <span className='total-count'>
              +{match.playTypeCount}
            </span>
          </div>
          <div className="match-info">
            <div
              className="infos"
              onClick={handleOpenDetail}
            >
              <div className='team'>
                <div className='team-name'>
                  <span className={classnames({'text-red': match.teams.home.isHandicap})}>
                    {match.teams.home.name}
                  </span>
                  {match.score.homeRedCard > 0 && <span className="red-card">{match.score.homeRedCard}</span>}
                </div>
                <span>{!!match.matchClock.period && match.score.home}</span>
              </div>
              <div className='team'>
                <div className="team-name">
                  <span className={classnames({'text-red': match.teams.away.isHandicap})}>
                    {match.teams.away.name}
                  </span>
                  {match.score.awayRedCard > 0 && <span className="red-card">{match.score.awayRedCard}</span>}
                </div>
                <span>{!!match.matchClock.period && match.score.away}</span>
              </div>
              <div className='media'>
                {
                  <DpIcon className='mr-6' type='live' active={match.hasVideo} />
                }
                {
                  <DpIcon className='mr-6' type='animate' active={match.hasAnimate} />
                }
                {
                  match.hasCorner &&
                  <img src={require('./i/score.png')} />
                }
              </div>
            </div>
            <div className="odds">
              <Odds sportId={match.sportId} mks={match.playTypes} />
            </div>
          </div>
        </>
      }
    </div>
  );
};
