import React, {useMemo, useState} from 'react';
// import DpImage from '@this/components/Image';
import styles from './style.scss';
import DpIcon from '@views/kmg/desktop/components/Icon';
import DpImage from '@this/components/Image';
import {getMatchStatusByPeriod} from '@core/utils';
import Timer from '@views/kmg/desktop/components/Timer';
import ScoreComponent from '../MatchDetail/Medias/ScoreComponent';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsType} from '@core/constants/enum/sport';
import dayjs from 'dayjs';
import usePublicState from '@core/hooks/usePublicState';
import classnames from 'classnames';
import Football from './Football';
import Basketball from './Basketball';
import Tennis from '../MatchDetail/Statistician/Tennis';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import {TVideo} from '@core/hooks/sports/useMathMedia';
import Live from '../MatchDetail/Medias/Live';

export default React.memo(() => {
  const {matchDetail: match, detailUpdateTime} = useMatchDetail();
  const {dispatch, ACTIONS} = usePublicState();
  const {getScoreByTypeId} = useMatchStatistics();
  const yellow = getScoreByTypeId(EStaticsType.yellow);
  const corner = getScoreByTypeId(EStaticsType.cornerKicks);
  const [selected, setSelected] = useState<'video' | 'animation' | 'score'>(null);
  const [random, setRandom] = useState(0);
  const [isReload, setReload] = useState(false);
  const [medias, setMedias] = useState<{
    videos: TVideo[];
    animation: string;
  }>(null);
  useEventEmitter<TMitt['syncMediaData']>({mittName: 'syncMediaData', on: (data) => {
    setSelected(data.selected);
    setMedias(data.mediaData);
  }});
  const staComp = useMemo(() => {
    switch (match?.sportId) {
      case 1:
        return <Football match={match} />;
      case 2:
        return <Basketball match={match} />;
      case 3:
        return <div className='match-infos tennis'><Tennis /></div>;
      default:
        return null;
    };
  }, [match?.sportId]);
  const onBack = () => {
    dispatch(ACTIONS.SPORT.toggleFullScreen({data: false}));
  };
  const handleReload = () => {
    const startTime = Date.now();
    setReload(true);
    setRandom(random + 1);
    const requestEndTime = Date.now();
    setTimeout(() => {
      setReload(false);
    }, 2000 - (requestEndTime - startTime));
  };
  return (
    <div className={styles.wrapper}>
      <div className='match-info'>
        <div className='match-info-header'>
          <DpIcon type='goback' className='match-info-icon pointer' onClick={onBack} />
          {
            match &&
            <div className='flex info-wrap'>
              <div className='home flex'>
                <div className='match-team'>
                  <DpImage size={24} src={match.teams.home.icon} className="team-logo" type="team" />
                </div>
                <div className='match-score'>
                  <span className='score'>{match.matchClock.isRunning && match.score.home}</span>
                  <span className='name'>{match.teams.home.name}</span>
                </div>
              </div>
              <div className='match-time'>
                <span className='part'>{match.playTypes.length > 0 ? getMatchStatusByPeriod(match.matchClock.period) : '已结束'}</span>
                {match.playTypes.length > 0 && (match.matchClock.period !== 'HT' && match.matchClock.period !== 'FT' && match.matchClock.second > 0) && (match.sportId === 1 ? (
                  <Timer
                    seconds={match.matchClock.second}
                    key={`${match?.matchId}_${match.matchClock.second}_${detailUpdateTime}`}
                  />
                ) : match.matchClock.playTime)}
              </div>
              <div className='away flex'>
                <div className='match-score'>
                  <span className='score'>{match.matchClock.isRunning && match.score.away}</span>
                  <span className='name'>{match.teams.away.name}</span>
                </div>
                <div className='match-team'>
                  <DpImage size={24} src={match.teams.away.icon} className="team-logo" type="team" />
                </div>
              </div>
            </div>
          }
          <div>
            {
              selected != 'score' ? (<DpIcon type='reload' className={`match-info-icon ${isReload && 'rotate-infinite'}`} onClick={() => handleReload()}/>) : <></>
            }
          </div>
        </div>
        {
          match &&
          <React.Fragment>
            <div className={classnames('match-info-media', `sid-${match.sportId}`, {'is-video': selected === 'video'})}>
              {
                selected === 'score' &&
                <ScoreComponent isFull={true} match={match} />
              }
              {
                selected === 'video' && medias?.videos.length &&
                <Live videos={medias?.videos} key={random}/>
              }
              {
                selected === 'animation' && medias?.animation.length &&
                <iframe src={medias?.animation} key={random}/>
              }
            </div>
            <div className='match-info-status'>
              <div className="game-info">
                <div className="team home">
                  <DpImage size={64} src={match.teams.home.icon} className="team-logo" type="team" />
                  <div className='team-status'>
                    <div className="team-name">
                      {match.teams.home.name}
                    </div>
                    {
                      match.matchClock.isRunning && match.sportId === 1 &&
                      <div className="events">
                        <div className="event">
                          <div className="corner-card" />
                          {corner[0]}
                        </div>
                        <div className="event">
                          <div className="red-card" />
                          {match.score.homeRedCard}
                        </div>
                        <div className="event">
                          <div className="yellow-card" />
                          {yellow[0]}
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className="score">
                  <span className='time'>
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
                                    match.sportId === 1 ? <Timer seconds={match.matchClock.second} key={`${match.matchId}_${match.matchClock.second}_${detailUpdateTime}`} /> : <span>{match.matchClock.playTime}</span>
                                  }
                                </p>
                              )
                            }
                          </>
                        ) :
                        (
                          <>
                            <p>{dayjs(match.matchClock.startTime).format('MM月DD日')}</p>
                            <p>{dayjs(match.matchClock.startTime).format('HH:mm')}</p>
                          </>
                        )
                    }
                  </span>
                  <span className='score-panel'>
                    {match.score.home} : {match.score.away}
                  </span>
                </div>
                <div className="team away">
                  <DpImage size={64} src={match.teams.away.icon} className="team-logo" type="team" />
                  <div className='team-status'>
                    <div className="team-name">
                      {match.teams.away.name}
                    </div>
                    {
                      match.matchClock.isRunning && match.sportId === 1 &&
                      <div className="events away">
                        <div className="event">
                          <div className="yellow-card" />
                          {yellow[1]}
                        </div>
                        <div className="event">
                          <div className="red-card" />
                          {match.score.awayRedCard}
                        </div>
                        <div className="event">
                          <div className="corner-card" />
                          {corner[1]}
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className='game-status'>
                <div className='status' />
                <span>本场数据</span>
              </div>
            </div>
          </React.Fragment>
        }
      </div>
      {
        staComp
      }
    </div>
  );
});
