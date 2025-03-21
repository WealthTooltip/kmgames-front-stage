/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:38:07
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/SportGame/index.tsx
 * @Description:
 */
import useSportsGameInit from '@core/hooks/sports/useSportsGameInit';
import usePollInterval from '@core/hooks/sports/usePollInterval';
import pageWrapper from '@this/components/PageWrapper';
import MatchTypeSelector from './components/MatchTypeSelector';
import SportTypeSelector from './components/SportTypeSelector';
import OptionBar from './components/OptionBar';
import MainContent from './components/MainContent';
import Navigation from './components/Navigation';
import SingleCart from './components/BetCart/SingleCart';
import BettingSuccessNotice from './components/BettingSuccessNotice';
import SwitchAutoOddNotice from './components/SwitchAutoOddNotice';
import SettingMenu from './components/SettingMenu';
import BettingDetails from './components/BettingDetails';
import OrderRecords from './components/OrderRecords';
// import SearchMenu from './components/SearchMenu';
import 'swiper/css';
import css from './style.scss';
import HandicapTutorial from './components/HandicapTutorial';
import {useLocation} from 'react-router';
import React, {useMemo} from 'react';
import useSettings from '@core/hooks/sports/useSettings';
import {EGameType, EESportType, ESportType} from '@core/constants/enum/sport';

export const SportGame = React.memo(() => {
  useSportsGameInit();
  usePollInterval();
  const location = useLocation();
  const isESports = useMemo(() => {
    return location.pathname === '/esports';
  }, [location]);
  const {switchGameType} = useSettings();
  React.useEffect(() => {
    switchGameType(isESports ? EGameType.ESPORTS : EGameType.SPORTS, isESports ? EESportType.LOL : ESportType.FOOTBALL);
  }, [isESports]);

  return (
    <div className={css.wrapper}>
      <div className='header'>
        <MatchTypeSelector />
        <SportTypeSelector />
        <OptionBar />
      </div>
      {/* <SearchMenu /> */}
      <MainContent />
      <Navigation />
      <SingleCart />
      <SettingMenu />
      <HandicapTutorial />
      <BettingSuccessNotice />
      <SwitchAutoOddNotice />
      <BettingDetails />
      <OrderRecords />
    </div>
  );
});

export default pageWrapper(SportGame, {title: 'DP体育'});
