import React, {useEffect, useRef, useState} from 'react';
import usePublicState from '@core/hooks/usePublicState';
import {useHistory} from 'react-router-dom';
import style from './style.scss';
import {ETHEME} from '../../configs';
import {useLocation} from 'react-router';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';

export default React.memo(() => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  const location = useLocation();
  const {user, base, dispatch, ACTIONS} = usePublicState();
  const [timeString, setTimeString] = useState(formatTime(Date.now()));
  const history = useHistory();
  const {emit} = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite'});
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeString(formatTime(base.serverTime + new Date().getTime() - base.serverTime));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // 底线滑动效果
  const menuItems = [
    {content: '体育投注', path: '/'},
    {content: '电子竞技', path: '/esports'},
    {content: '注单历史', path: '/record'},
    {content: '赛果', path: '/games-result'},
    {content: '体育竞猜规则', path: '/rule'},
    // {content: 'DEMO', path: '/demo'},
  ];

  type MenuItemRef = React.MutableRefObject<(HTMLLIElement | null)[]>;
  const menuItemElements: MenuItemRef = useRef([]);
  const hrElementRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(menuItems.findIndex((item) => item.path === location.pathname));

  const handleClick = (idx: number) => {
    setSelectedIndex(idx);
  };

  useEffect(() => {
    setSelectedIndex(menuItems.findIndex((item) => item.path === location.pathname));
  }, [location]);

  useEffect(() => {
    const unlineSize = (menuItemElements.current[selectedIndex])?.offsetWidth || 0;
    let unlineShift = 0;
    let idx = 0;
    while (idx < selectedIndex) {
      unlineShift += (menuItemElements.current[idx])?.offsetWidth || 0;
      idx++;
    }

    const hrElement = hrElementRef.current;

    if (hrElement) {
      hrElement.style.marginLeft = `${unlineShift}px`;
      hrElement.style.width = `${unlineSize}px`;
    }
    dispatch(ACTIONS.SPORT.updatePagePath(menuItems[selectedIndex].path));
    emit({display: false});
  }, [selectedIndex]);

  interface MenuItem {content: string, path: string};

  const renderItem = (
      onClick: (idx: number) => void,
  ) => ({content, path}: MenuItem, idx: number) => {
    return (
      <li
        key={idx}
        className={`${selectedIndex === idx ? 'active' : ''} menu-item`}
        ref={(el) => menuItemElements.current.push(el)}
        onClick={() => {
          onClick(idx);
          history.push(path);
        }}
      >
        {content}
      </li>
    );
  };

  const renderItems = (
      items: MenuItem[],
      onClick: (idx: number) => void,
  ) => items.map(renderItem(onClick));

  return (
    <header className={style.wrapper}>
      <div className="contents">
        <img className="logo" src={require('./i/icon-logo.png')} alt="Logo" />
        <ul className="menu-container">
          {renderItems(
              menuItems,
              handleClick,
          )}
          <hr id="underline" ref={hrElementRef}/>
        </ul>
        <div className="ad">
          <img
            src={require(`./i/ad${user.theme === ETHEME.DARK ? '_dark' : ''}.png`)}
            alt="Ad"
          />
          <div className="date">
            <span>{timeString}</span> GMT+8
          </div>
        </div>
      </div>
    </header>
  );
});
