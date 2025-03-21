import {TMatch} from '@core/services/Table';
import styles from './style.scss';
import DpIcon from '@views/kmg/mobile/components/Icon';
import DpIamge from '@views/kmg/mobile/components/Image';
import {getMatchStatusByPeriod} from '@core/utils';
import CountdownLite from '@this/pages/SportGame/components/CountdownLite';
import dayjs from 'dayjs';
import Odds from './Odds';
import useFavorites from '@core/hooks/sports/useFavorites';
import classnames from 'classnames';
import usePublicState from '@core/hooks/usePublicState';
import {useSelector} from 'react-redux';
import IStore from '@core/reducers/_reduxStore.d';
interface IMatchOfNoobProps {
  match: TMatch;
}
export default ({match}: IMatchOfNoobProps) => {
  const {isFavorite, onToggleFavorite} = useFavorites();
  const {dispatch, ACTIONS} = usePublicState();
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const handleOpenDetail = () => {
    dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: match.matchId}));
    dispatch(ACTIONS.SPORT.switchVisiabelByDetail(true));
  };
  return (
    <div className={styles.wrapper}>
      <div className="match-noob-header" onClick={handleOpenDetail}>
        <div className="media-box">
          {
            match.hasAnimate &&
            <DpIcon type="animate" />
          }
          {
            match.hasVideo &&
            <DpIcon type="live" />
          }
        </div>
        <div className="match-status">
          {
            match.isLive ? <>
              <span>
                {getMatchStatusByPeriod(match.matchClock.period)}
              </span>
              {
                (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) && match.sportId === 1 ?
                <CountdownLite seconds={match.matchClock.second} key={`${match?.matchId}_${match.matchClock.second}_${matchListUpdateTime}`} /> :
                <span>{match.matchClock.playTime}</span>
              }
            </> : <span>{dayjs(match.matchClock.startTime).format('MM月DD日 HH:mm')}</span>
          }
        </div>
        <div className="total-count">
          +{match.playTypeCount}
        </div>
      </div>
      <div className="match-info" onClick={handleOpenDetail}>
        <div className="team">
          <div className='team-name'>
            {match.score.homeRedCard > 0 && <span className="red-card">{match.score.homeRedCard}</span>}
            <span className={classnames({'text-red': match.teams.home.isHandicap})}>
              {match.teams.home.name}
            </span>
          </div>
          <DpIamge width={18} src={match.teams.home.icon} />
        </div>
        <div className="score">
          {
            match.isLive ? <>
              <span>{match.score.home}</span>
              <p>VS</p>
              <span>{match.score.away}</span>
            </> : <p>VS</p>
          }
        </div>
        <div className="team">
          <DpIamge width={18} src={match.teams.away.icon} />
          <div className="team-name">
            <span className={classnames({'text-red': match.teams.away.isHandicap})}>
              {match.teams.away.name}
            </span>
            {match.score.awayRedCard > 0 && <span className="red-card">{match.score.awayRedCard}</span>}
          </div>
        </div>
      </div>
      <div className="match-bottom">
        <div className="collect-box">
          <DpIcon type='collect' active={isFavorite([match.matchId])} onClick={(e) => onToggleFavorite(e, [match.matchId])} />
        </div>
        <div className={classnames('odds', {'is-esports': match.sportId > 33})}>
          <Odds match={match} />
        </div>
      </div>
    </div>
  );
};
