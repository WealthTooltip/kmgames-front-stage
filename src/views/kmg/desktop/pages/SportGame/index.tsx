/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:38:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/index.tsx
 * @Description:
 */

import useSportsGameInit from '@core/hooks/sports/useSportsGameInit';
import usePollInterval from '@core/hooks/sports/usePollInterval';
import pageWrapper from '../../components/PageWrapper';
import MenuSidePanel from './components/MenuSidePanel';
import AnnounceBar from './components/AnnounceBar';
import SportTypeSelector from './components/SportTypeSelector';
import OptionBar from './components/OptionBar';
import MatchDetail from './components/MatchDetail';
import LeagueList from './components/LeagueList';
import MatchInfo from './components/MatchInfo';
import styles from './style.scss';
import ZoomMatchDetail from './components/ZoomMatchDetail';
import KeepAlive from '@core/templates/desktop/components/KeepAlive';
import React, {useMemo} from 'react';
import FavoriteDetail from './components/FavoriteDetail';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';
import BettingModeModalPopup from '@core/templates/desktop/components/PopupModal/bettingModeModalPopup';
import useSettings from '@core/hooks/sports/useSettings';
import {ALL_GAME_BETTING_TYPE, EGameType, EESportType, ESportType} from '@constants/enum/sport';
import storage from '@helpers/storage';
import usePublicState from '@core/hooks/usePublicState';
import db from '@core/services/db';

export const SportGame = React.memo(() => {
  useSportsGameInit();
  usePollInterval();
  const [openModal, setOpenModal] = React.useState(!storage.get('CUR_GAME_BETTING_TYPE'));
  const [loading, setLoading] = React.useState(false);
  const {gameBettingType, switchGameBettingByType, switchGameType, switchSportByType} = useSettings();
  const pagePath = useSelector((state: TStore) => state.sport.display.pagePath);
  const {dispatch, ACTIONS} = usePublicState();
  const isESports = useMemo(() => {
    return pagePath === '/esports';
  }, [pagePath]);
  let timer: any = 0;
  React.useEffect(() => {
    db.matches.clear().then(() => {
      // dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: null}));
      dispatch(ACTIONS.SPORT.updateMatchListUpdateTime());
    });
    clearTimeout(timer);
    timer = setTimeout(() => {
      switchGameType(isESports ? EGameType.ESPORTS : EGameType.SPORTS, isESports ? EESportType.LOL : ESportType.FOOTBALL);
    }, 100);
  }, [isESports]);
  React.useEffect(() => {
    return () => switchSportByType(ESportType.FOOTBALL);
  }, []);

  return (
    <>
      <BettingModeModalPopup
        open={openModal}
        loading={loading}
        mode={ALL_GAME_BETTING_TYPE[1].code === gameBettingType ? 1 : 0}
        onCancel={() => setOpenModal(false)}
        onSelect={(mode) => {
          setLoading(true);
          switchGameBettingByType(ALL_GAME_BETTING_TYPE[mode].code);
          setOpenModal(false);
        }}
      />
      {!openModal && (
        <div className={styles.wrapper}>
          <div className='container'>
            <MenuSidePanel />
            <div className='content'>
              <AnnounceBar />
              {
                !isESports &&
                <SportTypeSelector />
              }
              <div className='match-container'>
                <MainContent />
                <div className='match-detail'>
                  <MatchDetail />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default pageWrapper(SportGame, {title: 'DP体育', withFooter: false, withHeader: true});

// 主体内容显示
export const MainContent = () => {
  const [showFavorite, setShowFavorite] = React.useState(false);
  useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite', on: ({display}) => setShowFavorite(display)});
  const {zoomStatus, fullScreen, pagePath} = useSelector((state: TStore) => state.sport.display);

  if (fullScreen) {
    return <MatchInfo />;
  }

  if (zoomStatus || showFavorite) {
    return (
      <>
        { zoomStatus && <ZoomMatchDetail />}
        {
          showFavorite &&
          <div className={`match-list ${zoomStatus && 'hidden'}`}>
            <FavoriteDetail />
          </div>
        }
      </>
    );
  }

  return (
    <div className='match-list'>
      <KeepAlive key={pagePath} cacheKey='matchList'>
        <OptionBar />
        <LeagueList />
      </KeepAlive>
    </div>

  );
};
