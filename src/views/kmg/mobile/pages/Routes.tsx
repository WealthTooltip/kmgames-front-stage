/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/views/kmg/mobile/pages/Routes.tsx
 * @Description:
 */
import {HashRouter, Route, Switch} from 'react-router-dom';
import Framework from '@core/templates/mobile/Framework';
import useTheme from '@core/hooks/useTheme';
import CONFIGS from '@core/constants/configs';
import {ConfigProvider, theme} from 'antd';
import _Demo from './_Demo/index';
import SportGame from './SportGame';
import {ETHEME} from '../configs';

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
          <Switch>
            <Route exact path="/" component={SportGame} />
            <Route exact path="/esports" component={SportGame} />
            <Route exact path="/demo" component={_Demo} />
          </Switch>
        </Framework>
      </HashRouter>
    </ConfigProvider>
  );
}

export default Routers;
