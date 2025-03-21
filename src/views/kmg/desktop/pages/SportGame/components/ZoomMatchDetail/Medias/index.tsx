/*
 * @Author: Passion.KMG
 * @Date: 2024-01-02 14:50:00
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchDetail/Medias/index.tsx
 * @Description:
 */
import {useLatest} from 'react-use';
import classnames from 'classnames';
// import useMathMedia from '@core/hooks/sports/useMathMedia';
import useEventEmitter from '@core/hooks/useEventEmitter';
import DpIcon from '@views/kmg/desktop/components/Icon';
// import Live from './Live';
import {TMatch} from '@core/services/Table';
import {TMitt} from '@constants/enum/mitt';
import usePublicState from '@core/hooks/usePublicState';
import ScoreComponent from '../../MatchDetail/Medias/ScoreComponent';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import useFavorites from '@core/hooks/sports/useFavorites';

interface IProps {
  match: TMatch;
}
export default ({match}: IProps) => {
  // const {mediaData} = useMathMedia({matchId: match?.mid1, videoId: match?.pdId});
  // const [selected, setSelected] = React.useState<TMitt['syncMediaSelected']['selected'] | null>(null);
  const [showScore, setShowScore] = React.useState(true);
  const {setIsReload, isReload} = useMatchDetail();
  // 最新的比赛数据同步给Emmiter
  const latestMatch = useLatest(match);
  // 最后一次订阅的对象
  const lastSubscribe = React.useRef<TMitt['syncMediaSelected']>({matchId: null, selected: null});
  const {dispatch, ACTIONS} = usePublicState();
  const {isFavorite, onToggleFavorite} = useFavorites();

  const {emit} = useEventEmitter<TMitt['syncMediaSelected']>({
    mittName: 'syncMediaSelected',
    on: (data) => {
      if (data.matchId !== latestMatch.current.matchId) {
        lastSubscribe.current = data;
        return;
      }
      // setSelected(data.selected);
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
        <div className='flex-1' onClick={() => {
          dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
        }}>
          <DpIcon type='arrowBack' />
        </div>
        <div className='flex-1 flex justify-center'>
          <span className='team-name'>{match.leagueName}</span>
        </div>
        <div className='flex-1 flex justify-end items-center'>
          { !showScore && (<div className='btn-display' onClick={()=>setShowScore(true)}>
            显示比分栏
          </div>)
          }
          {/* <DpIcon type='fullscreen' className='mr-10 pointer' /> */}
          {/* <DpIcon className='mr-5' width={20} height={20} type='chart' /> */}
          <DpIcon width={20} height={20} type='collect' active={isFavorite([match.matchId])} onClick={(e) => onToggleFavorite(e, [match.matchId])} />
          <DpIcon
            width={20}
            height={20}
            type='reload'
            onClick={() => setIsReload(true)}
            className={`ml-10 pointer reload-icon ${isReload && 'rotate-infinite'}`}
          />
        </div>
      </div>
      {showScore && (
        <div className={classnames('video-wrapper', `sport-${match.sportId}`)}>
          {!!match && <ScoreComponent noBg={match?.sportId > 33} isFull={true} match={match} hideScore={() => setShowScore(false)} />}
        </div>
      )}
    </>
  );
};
