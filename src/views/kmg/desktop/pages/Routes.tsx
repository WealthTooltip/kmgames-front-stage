/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/Routes.tsx
 * @Description:
 */
import {HashRouter, Route, Switch} from 'react-router-dom';
import Framework from '@core/templates/desktop/Framework';
import CONFIGS from '@core/constants/configs';
import useTheme from '@core/hooks/useTheme';
import {ConfigProvider, theme} from 'antd';
import SportGame from './SportGame';
import GamesResult from './GamesResult';
import _Demo from './_Demo';
import {ETHEME} from '../configs';
import Record from './Record';
import Header from '../components/Header';
import Rule from './Rule';

function Routers() {
  const {theme: curTheme} = useTheme();
  return (
    <ConfigProvider
      theme={{
        algorithm: curTheme === ETHEME.DARK ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {fontFamily: CONFIGS.FONT_FAMILY},
      }}
    >
      <HashRouter>
        <Framework>
          <Header />
          <Switch>
            <Route exact path="/" component={SportGame} />
            <Route exact path="/games-result" component={GamesResult} />
            <Route exact path="/demo" component={_Demo} />
            <Route exact path="/record" component={Record} />
            <Route exact path="/esports" component={SportGame} />
            <Route exact path="/rule" component={Rule} />
          </Switch>
        </Framework>
      </HashRouter>
    </ConfigProvider>
  );
}

export default Routers;
