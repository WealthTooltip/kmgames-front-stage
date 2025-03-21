/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MatchItemOfNoob/index.tsx
 * @Description:
 */

import DpIcon from '@views/kmg/desktop/components/Icon';
import {useSelector} from 'react-redux';
import {PlayType, TMatch} from '@core/services/Table';
import IStore from '@core/reducers/_reduxStore';
// import usePublicState from '@core/hooks/usePublicState';
import MatchInfos from './MatchInfos';
import {getNewbiePlayListBySid, transforMarkets} from '@core/utils';
import styles from './style.scss';
import {TMitt} from '@core/constants/enum/mitt';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {Tooltip} from 'antd';
import useFavorites from '@core/hooks/sports/useFavorites';

export type TSyncEmittData = {
  matchId: number;
  selected: 'video' | 'animation' | 'score'
}

interface IProps {
  match: TMatch
}
export default React.memo(({match}: IProps) => {
  // const {dispatch, ACTIONS} = usePublicState();
  const gameList = getNewbiePlayListBySid(match.sportId, match.round);
  const markets: (undefined | PlayType)[] = transforMarkets(match, gameList);
  const currentMatchId = useSelector((state: IStore) => state.sport.display.currentMatchId);
  const [selected, setSelected] = React.useState<TMitt['syncMediaSelected']['selected'] | null>(null);
  const {isFavorite, onToggleFavorite} = useFavorites();

  const {emit} = useEventEmitter<TMitt['syncMediaSelected']>({mittName: 'syncMediaSelected', on: (data) => {
    // if (data.matchId !== match.matchId) {
    //   dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: data.matchId}));
    //   setSelected(null);
    //   return;
    // }
    if (data.matchId !== match.matchId) return setSelected(null);
    setSelected(data.selected);
  }});

  const handleSelect = React.useCallback((selected: TMitt['syncMediaSelected']['selected']) => {
    emit({matchId: match.matchId, selected});
    setSelected(selected);
  }, [currentMatchId]);

  return (
    <div className={`${styles.match_item} ${currentMatchId === match.matchId ? 'active' : ''}`}>
      <MatchInfos match={match} market={markets[0]} />
      <div className="video-list">
        <Tooltip title="收藏" placement="top">
          <div className="pointer">
            <DpIcon type="collect" active={isFavorite([match.matchId])} onClick={(e) => onToggleFavorite(e, [match.matchId])}/>
          </div>
        </Tooltip>
        {
          match.sportId <= 33 && !match.hasVideo && !match.hasAnimate &&
            <Tooltip title="比分板" placement="top">
              <div className="pointer" onClick={() => handleSelect('score')}>
                <span className={selected === 'score' ? 'video-item active' : 'video-item'}>比分</span>
              </div>
            </Tooltip>
        }
        {
          match.hasVideo &&
          <Tooltip title="视频源" placement="top">
            <div className="pointer" onClick={() => handleSelect('video')}>
              <span className={selected === 'video' ? 'video-item active' : 'video-item'}>视频</span>
            </div>
          </Tooltip>
        }
        {
          match.sportId <= 33 && !match.animation &&
          <Tooltip title="动画直播" placement="top">
            <div className="pointer" onClick={() => handleSelect('animation')}>
              <span className={selected === 'animation' ? 'video-item active' : 'video-item'}>动画</span>
            </div>
          </Tooltip>
        }
      </div>
    </div>);
});
