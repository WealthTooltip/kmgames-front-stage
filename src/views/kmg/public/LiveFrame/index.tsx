/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @Description:
 */

import ReactDom from 'react-dom/client';
import '@core/templates/desktop/styles/normalize.scss';
import DPlayerComponent from './DPlayerComponent';
import './style.scss';

const root = ReactDom.createRoot(document.getElementById('root'));
const url = new URLSearchParams(window.location.search).get('s');

root.render(
    <div>
      <DPlayerComponent liveUrl={url} />
    </div>,
);
