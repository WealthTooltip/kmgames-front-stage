/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/MenuSidePanel/index.tsx
 * @Description:
 */

import {useSelector} from 'react-redux';
import usePublicState from '@core/hooks/usePublicState';
import useProfile from '@core/hooks/users/useProfile';
import {formatCurrency} from '@helpers/unit';
import TStore from '@core/reducers/_reduxStore';
import DpIcon from '@this/components/Icon';
import useSettings from '@core/hooks/sports/useSettings';
import {EMatchTypes, MenuType} from '@core/constants/enum/sport';
import {CSSTransition} from 'react-transition-group';
import {useState} from 'react';
import styles from './style.scss';
import BetRecord from './components/BetRecord';
import BetPanel from './components/OrderCart';
import {LeagueList} from './components/LeagueList';
import {SaveList} from './components/SaveList';
import KeepAlive from '@core/templates/desktop/components/KeepAlive';
import classnames from 'classnames';
import useFavorites from '@core/hooks/sports/useFavorites';
import useEventEmitter from '@core/hooks/useEventEmitter';
import {TMitt} from '@core/constants/enum/mitt';

export default React.memo(() => {
  const {loadingProfile, getProfile} = useProfile();
  const orders = useSelector((state: TStore) => state.sport.bet.orderTags);
  const confirmOrders = useSelector((state: TStore) => state.sport.bet.confirmOrders);
  const info = useSelector((state: TStore) => state.user.info);
  const [showOrders, setShowOrders] = React.useState(false);
  const [showBetRecord, setShowBetRcord] = React.useState(false);
  const {favoriteIds} = useFavorites();
  const {matchType} = useSettings();
  const leagueStatistics = useSelector((state: TStore) => state.sport.display.leagueStatistics);
  const {dispatch, ACTIONS} = usePublicState();
  const [hide, setHide] = useState(false);
  const [currentItem, setCurrentItem] = useState(MenuType.LEAGUE);
  const {emit} = useEventEmitter<TMitt['toggleFavorite']>({mittName: 'toggleFavorite', on: ({display}) => setCurrentItem(display ? MenuType.FAVORITE: MenuType.LEAGUE)});

  React.useEffect(() => {
    emit({display: MenuType.FAVORITE === currentItem});
  }, [currentItem]);

  React.useEffect(() => {
    if (showOrders) {
      setShowBetRcord(false);
    }
  }, [showOrders]);

  React.useEffect(() => {
    setShowOrders(orders.length !== 0 || confirmOrders.length !==0);
  }, [orders.length, confirmOrders.length]);

  const handleGoFav = React.useCallback(() => {
    // if (!favoriteIds || favoriteIds.length === 0) {
    //   dispatch(ACTIONS.BASE.openToast({text: '请先添加收藏赛事', types: 'info'}));
    //   return;
    // }
    dispatch(ACTIONS.SPORT.removeAllSelectLeague());
    dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
    dispatch(ACTIONS.SPORT.updateDisplayFullScreen(false));
    setCurrentItem(currentItem === MenuType.FAVORITE ? MenuType.LEAGUE : MenuType.FAVORITE);
  }, [favoriteIds, currentItem]);
  return (
    <div className={styles.wrapper}>
      <div className='infos'>
        <div className='content'>
          <div className='name'>
            Hi,
            {info.userName}
          </div>
          <div className='balance'>
            {loadingProfile ? (
              <span>刷新中...</span>
            ) : (
              <>
                <span>{hide ? '***' : `¥${formatCurrency(info.totalBalance || 0)}`}</span>
                <DpIcon
                  className='pointer'
                  width={14}
                  height={14}
                  type={hide ? 'closeEye' : 'eye'}
                  onClick={() => setHide((val) => !val)}
                />
              </>
            )}
          </div>
        </div>
        <DpIcon
          width={20}
          height={20}
          className={`refresh ${loadingProfile && 'rotate-infinite'}`}
          type='reload'
          onClick={() => getProfile()}
        />
      </div>

      <CSSTransition
        in={showOrders}
        exit={false}
        timeout={{enter: 300, exit: 0}}
        classNames='fade'
        mountOnEnter
        unmountOnExit>
        <BetPanel hideOrderCart={() => setShowOrders(false)} />
      </CSSTransition>

      <CSSTransition
        in={showBetRecord}
        exit={false}
        timeout={{enter: 300, exit: 0}}
        classNames='fade'
        mountOnEnter
        unmountOnExit>
        <BetRecord hideBetRecord={() => setShowBetRcord(false)} />
      </CSSTransition>

      <CSSTransition
        in={!showOrders && !showBetRecord}
        exit={false}
        timeout={{enter: 300, exit: 0}}
        classNames='fade'
        mountOnEnter
        unmountOnExit>
        <div className={`${!showOrders && !showBetRecord ? '' : 'hide-display'} menus`}>
          <div className='menu-item' onClick={() => setShowBetRcord(true)}>
            <img src={require('./i/icon-bet-record.png')} />
            <span className='name'>投注记录</span>
            <span className="count">
              {info.orderCount}
            </span>
          </div>
          {(orders.length > 0 || confirmOrders.length > 0) && (
            <div className='menu-item theme-active' onClick={() => setShowOrders(true)}>
              <img src={require('./i/my-order.png')} />
              <span className='name'>
                我的注单
              </span>
              <span className="count">
                {orders.length}
              </span>
            </div>
          )}
          <div
            className={classnames('menu-item', {active: currentItem === MenuType.FAVORITE})}
            onClick={handleGoFav}>
            <img src={require('./i/icon-favorite.png')} />
            <span className='name'>我的收藏</span>
            <span className='count'>{favoriteIds.length}</span>
          </div>

          {/* <div className='menu-item'>
            <img src={require('./i/icon-hot.png')} />
            <span className='name'>热门赛事</span>
          </div> */}
          {currentItem === MenuType.LEAGUE && (
            <div
              className={classnames('menu-item sport-type', {active: currentItem === MenuType.LEAGUE})}
              onClick={() => {
                setCurrentItem(MenuType.LEAGUE);
                dispatch(ACTIONS.SPORT.removeAllSelectLeague());
              }}>
              <span className='name'>
                {matchType !== EMatchTypes.EARLY ? '今日' : '早盘'}
                赛事
              </span>
              <span className="count">{_.sumBy(_.uniqBy(leagueStatistics, 'leagueId'), 'count')}</span>
            </div>
          )}
          {currentItem === MenuType.LEAGUE && <LeagueList />}
          {
            currentItem === MenuType.FAVORITE &&
            <KeepAlive cacheKey='fav-list'>
              <SaveList />
            </KeepAlive>
          }
        </div>
      </CSSTransition>
    </div>
  );
});
