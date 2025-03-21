/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/templates/desktop/app.tsx
 * @Description: PC 端入口
 */

import ReactDom from 'react-dom/client';
import {Provider} from 'react-redux';
import {configureStore} from '@core/store';
import {AliveScope} from 'react-activation';
import './styles/main.scss';

export const store = configureStore();
const root = ReactDom.createRoot(document.getElementById('root'));

export default (Routes: React.FC): void => {
  root.render(
      // @ts-ignore
      <Provider store={store}>
        <AliveScope>
          <Routes />
        </AliveScope>
      </Provider>,
  );
};
