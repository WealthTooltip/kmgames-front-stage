/*
 * @Author: Passion.KMG
 * @Date: 2024-01-02 14:50:00
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchDetail/Medias/index.tsx
 * @Description:
 */
import {useLatest} from 'react-use';
import dayjs from 'dayjs';
import classnames from 'classnames';
// import useMathMedia from '@core/hooks/sports/useMathMedia';
import useEventEmitter from '@core/hooks/useEventEmitter';
import DpIcon from '@views/kmg/desktop/components/Icon';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';

// import Live from './Live';
import {TMatch} from '@core/services/Table';
import {TMitt} from '@constants/enum/mitt';
import usePublicState from '@core/hooks/usePublicState';
import {useState} from 'react';
import useMathMedia from '@core/hooks/sports/useMathMedia';
import DpImage from '@this/components/Image';
import Timer from '@views/kmg/desktop/components/Timer';
import {getMatchStatusByPeriod} from '@core/utils';
import ScoreComponent from '../../MatchDetail/Medias/ScoreComponent';
import Live from '@this/pages/SportGame/components/MatchDetail/Medias/Live';

interface IProps {
  match: TMatch;
}
export default ({match}: IProps) => {
  const {mediaData} = useMathMedia({matchId: match?.mid1, videoId: match?.pdId});
  // const [selected, setSelected] = React.useState<TMitt['syncMediaSelected']['selected'] | null>(null);
  const {matchDetail, detailUpdateTime, setIsReload, isReload} = useMatchDetail();
  // const [showScore, setShowScore] = React.useState(true);
  // 最新的比赛数据同步给Emmiter
  const latestMatch = useLatest(match);
  // 最后一次订阅的对象
  const lastSubscribe = React.useRef<TMitt['syncMediaSelected']>({matchId: null, selected: null});
  const {dispatch, ACTIONS} = usePublicState();
  const [selected, setSelected] = useState('score');

  const {emit} = useEventEmitter<TMitt['syncMediaSelected']>({
    mittName: 'syncMediaSelected',
    on: (data) => {
      if (data.matchId !== latestMatch.current.matchId) {
        lastSubscribe.current = data;
        return;
      }
      setSelected(data.selected);
    },
  });
  React.useEffect(() => {
    if (lastSubscribe.current.matchId === match.matchId) {
      // setSelected(lastSubscribe.current.selected);
      lastSubscribe.current = {matchId: null, selected: null};
      return;
    }
    // setSelected('score');
    emit({matchId: match.matchId, selected: 'score'});
  }, [match?.matchId]);

  // const handleSelect = React.useCallback((selected: TMitt['syncMediaSelected']['selected']) => {
  //   emit({matchId: match.matchId, selected});
  //   setSelected(selected);
  // }, [match]);

  // const hasList = ['score', ...mediaAvailableStatus];

  return (
    <>
      <div className={classnames('match-detail-actions border-bottom')}>
        <div className='' onClick={() => {
          dispatch(ACTIONS.SPORT.updateDisplayFullScreen(false));
        }}>
          <DpIcon type='arrowBack' />
        </div>
        <div className='team-name-bg flex'>
          <DpImage size={20} width={20} className='team-logo' type='team' src={match.teams.home.icon} />
        </div>
        <div className='team-home flex' >
          <span className="team-name">{match.teams.home.name}</span>
          <span className="item">{match.score.home}</span>
        </div>
        <div className='flex flex-wrap flex-col items-center justify-center match-time'>
          {matchDetail?.isLive == true ? (
            <div className="flex-col flex items-center">
              <span className='match-part'>{getMatchStatusByPeriod(matchDetail.matchClock.period)}</span>
              <span className='match-time-text'>
                {
                  matchDetail?.playTypes.length > 0 && !['FT', 'HT'].includes(matchDetail.matchClock.period) && matchDetail.matchClock.second > 0 && matchDetail.sportId === 1 &&
                  <Timer seconds={matchDetail.matchClock.second} key={`${matchDetail?.matchId}_${matchDetail.matchClock.second}_${detailUpdateTime}`} />
                }
              </span>
            </div>
          ) : (
            <div className="flex-col flex items-center">
              <span>{dayjs(match.matchClock.startTime).format('MM月DD日')}</span>
              <span className="not-live-watch">{dayjs(match.matchClock.startTime).format('HH:mm')}</span>
            </div>
          )}
          {/* <span className='match-part'>{matchDetail.matchClock.startTime}</span> */}
          {/* <span className='match-time-text'>{match.updateTime}</span>
           */}


        </div>
        <div className='team-away flex' >
          <span className="item">{match.score.home} </span>
          <span className="team-name">{match.teams.away.name}</span>
        </div>
        <div className='team-away-name-bg flex'>
          <DpImage size={20} width={20} className='team-logo' type='team' src={match.teams.away.icon} />
        </div>
        <div className='flex justify-end items-center'>
          {/* <DpIcon type='fullscreen' className='mr-10 pointer' /> */}
          <DpIcon className='mr-5' width={20} height={20} type='chart' />
          <DpIcon
            width={20}
            height={20}
            type='reload'
            onClick={() => setIsReload(true)}
            className={`pointer reload-icon ${isReload && 'rotate-infinite'}`}
          />
        </div>
      </div>
      {(
        <div className={classnames('video-wrapper', `sport-${match.sportId}`)} style={{width: '100%', height: '360px'}}>
          {
            selected === 'score' && !!match && <ScoreComponent match={match} />
          }
          {
            selected === 'video' && mediaData?.videos?.length && <Live videos={mediaData?.videos} />
          }
          {
            selected === 'animation' && mediaData?.animation?.length && <iframe src={mediaData?.animation} />
          }
        </div>
      )}
    </>
  );
};
