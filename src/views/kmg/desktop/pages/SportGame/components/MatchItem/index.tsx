/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchItem/index.tsx
 * @Description:
 */
import {useLatest} from 'react-use';
import {useInView} from 'react-intersection-observer';
import classnames from 'classnames';
import {useSelector} from 'react-redux';
import {PlayType, TMatch} from '@core/services/Table';
import {Tooltip} from 'antd';
import useEventEmitter from '@core/hooks/useEventEmitter';
import MatchInfos from './MatchInfos';
import BettingOdds from './BettingOdds';
import DpIcon from '@views/kmg/desktop/components/Icon';
import {getPlayListBySid, transforMarkets} from '@core/utils';
import {TMitt} from '@constants/enum/mitt';
import IStore from '@core/reducers/_reduxStore';
import styles from './style.scss';

interface IProps{
  match: TMatch
}
export default React.memo(({match}: IProps) => {
  const gameList = getPlayListBySid(match.sportId);
  const {ref, inView} = useInView({
    threshold: 0,
  });
  const currentMatchId = useSelector((state: IStore) => state.sport.display.currentMatchId);
  const markets: (undefined | PlayType)[] = transforMarkets(match, gameList);
  const [selected, setSelected] = React.useState<TMitt['syncMediaSelected']['selected'] | null>(null);
  const useLatestMatch = useLatest(match);

  const {emit} = useEventEmitter<TMitt['syncMediaSelected']>({mittName: 'syncMediaSelected', on: (data) => {
    // if (data.matchId !== useLatestMatch.current.matchId) {
    //   setSelected(null);
    //   return;
    // }
    if (data.matchId !== useLatestMatch.current.matchId) return setSelected(null);
    setSelected(data.selected);
  }});

  const handleSelect = React.useCallback((selected: TMitt['syncMediaSelected']['selected']) => {
    emit({matchId: match.matchId, selected});
    setSelected(selected);
  }, [currentMatchId]);

  return (
    <div className={classnames(styles.match_item, {'active': currentMatchId === match.matchId})} ref={ref}>
      {
        inView &&
        <>
          <MatchInfos match={match} />
          <BettingOdds markets={markets} sportId={match.sportId} gameList={gameList} />
          <div className="video-list">
            <Tooltip title="比分板" placement="top">
              <div className="pointer" onClick={() => handleSelect('score')}>
                <DpIcon type="score" active={selected === 'score'} />
              </div>
            </Tooltip>
            {
              match.hasVideo &&
              <Tooltip title="视频源" placement="top">
                <div className="pointer" onClick={() => handleSelect('video')}>
                  <DpIcon type="video" active={selected === 'video'} />
                </div>
              </Tooltip>
            }
            {
              match.hasAnimate &&
              <Tooltip title="动画直播" placement="top">
                <div className="pointer" onClick={() => handleSelect('animation')}>
                  <DpIcon type="animation" active={selected === 'animation'} />
                </div>
              </Tooltip>
            }
          </div>
        </>
      }
    </div>
  );
});
