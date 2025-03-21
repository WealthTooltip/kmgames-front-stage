import {useState} from 'react';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import {useMatchListDataByLeagueId} from '@core/hooks/sports/useRenderData';
import usePublicState from '@core/hooks/usePublicState';
import {getMatchStatusByPeriod} from '@core/utils';
import dayjs from 'dayjs';
import useTheme from '@core/hooks/useTheme';
import CountdownLite from '@this/pages/SportGame/components/CountdownLite';
import DpIcon from '@views/kmg/mobile/components/Icon';
import DpImage from '@views/kmg/mobile/components/Image';
import Overlay from '@template/components/Overlay';
import styles from './style.scss';

const LeagueLists = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {matchDetail} = useMatchDetail();
  const {matchList} = useMatchListDataByLeagueId(matchDetail?.leagueId);
  const {dispatch, ACTIONS} = usePublicState();
  const {mobileTheme} = useTheme();
  const onBack = () => {
    dispatch(ACTIONS.SPORT.switchVisiabelByDetail(false));
  };
  const LeagueSelect = () => {
    return (
      <div className={styles.wrapper}>
        <div className='header'>
          <DpIcon className={`go-back ${isOpen ? 'open' : 'close'}`} onClick={onBack} type="arrow" fill={isOpen ? mobileTheme.dpNormal : '#fff'} />
          <div
            className='match-league'
            onClick={() => {
              if (matchList.length) {
                setIsOpen(!isOpen);
              }
            }}
          >
            <p className={isOpen ? 'open' : 'close'}>{matchDetail?.leagueName}</p>
            <DpIcon className={isOpen ? 'open' : 'close'} width={12} height={12} type="arrow" fill={isOpen ? mobileTheme.dpNormal : '#fff'} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <LeagueSelect />
      <Overlay display={isOpen} zIndex={20} close={close}>
        <div className={styles.wrapper1}>
          <LeagueSelect />
          <ul className='league-open'>
            {matchList.map((league) => (
              <li
                key={league.matchId}
                onClick={() => {
                  dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: league.matchId}));
                  setIsOpen(!isOpen);
                }}
                className={league.matchId === matchDetail.matchId ? 'active' : ''}
              >
                <div className='team'>
                  <div>
                    <DpImage size={38} type='team' src={league?.teams.home.icon} alt="team-logo1" />
                  </div>
                  <p>{league.teams.home.name}</p>
                </div>
                <div className='score'>
                  {league.isLive ? (
                    <>
                      <p className='time'>
                        {getMatchStatusByPeriod(league.matchClock.period)}
                        {
                          (league.matchClock.period !== 'HT' && league.matchClock.period !== 'FT' && league.matchClock.second > 0) && league.sportId === 1 ?
                          <CountdownLite seconds={league.matchClock.second} /> :
                          <span>{league.matchClock.playTime}</span>
                        }
                      </p>
                      <p className='score'>{`${league.score.home} - ${league.score.away}`}</p>
                    </>
                  ) : (
                    <div className='not-started'>
                      <p className='time'>{dayjs(league.matchClock.startTime).format('HH:mm')}</p>
                      <p className='time mt-8'>{dayjs(league.matchClock.startTime).format('YYYY年MM月DD日')}</p>
                    </div>
                  )}
                </div>
                <div className='team'>
                  <div>
                    <DpImage size={38} type='team' src={league?.teams.away.icon} alt="team-logo1" />
                  </div>
                  <p>{league.teams.away.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Overlay>
    </>
  );
};

export default LeagueLists;
