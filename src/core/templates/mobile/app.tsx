/*
 * @Description: 工程入口
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2024-01-15 16:28:21
 * @LastEditors: Galen.GE
 */

import ReactDom from 'react-dom/client';
import {Provider} from 'react-redux';
import {configureStore} from '@core/store';
import {AliveScope} from 'react-activation';
import './styles/main.scss';
import './styles/public.scss';

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
