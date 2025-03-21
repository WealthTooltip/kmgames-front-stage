/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 10:22:07
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/pages/SportGame/components/OptionBar/index.tsx
 * @Description:
 */

import React, {useState, useEffect, useRef} from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import IStore, {TStore} from '@core/reducers/_reduxStore.d';
import {useSelector} from 'react-redux';
import useSettings from '@core/hooks/sports/useSettings';
import useGuard from '@core/hooks/sports/useGuard';
// import usePublicState from '@core/hooks/usePublicState';
import DpButton from '@this/components/Button';
import DpSwitchButton from '@this/components/SwitchButton';
// import DpSelect from '@this/components/Select';
import DpIcon from '@this/components/Icon';
import {
  ALL_SORTBY,
  ALL_MATCH_TYPES,
  EMatchTypes,
  EPollIntervalGuardKeys,
  ALL_GAME_BETTING_TYPE,
  ALL_ESPORTS,
} from '@constants/enum/sport';
import styles from './style.scss';

export default function() {
  const {resetGuard, isReload} = useGuard();
  const {
    toggleCollapseAllLeague,
    switchSortByType,
    switchMatchType,
    matchType,
    sortBy,
    isCollapseAll,
    gameBettingType,
    switchGameBettingByType,
    switchSportByType,
  } = useSettings();
  // const {dispatch, ACTIONS} = usePublicState();
  const {pagePath} = useSelector((state: IStore) => state.sport.display);
  const sid = useSelector((state: TStore) => state.sport.userSettings.sid);
  // const [currentLeagueId, setCurrentLeagueId] = useState(0);
  const isESports = React.useMemo(() => {
    return pagePath === '/esports';
  }, [pagePath]);

  // React.useEffect(() => {
  //   dispatch(ACTIONS.SPORT.removeAllSelectLeague());
  //   if (currentLeagueId === 0) {
  //     return;
  //   }
  //   dispatch(ACTIONS.SPORT.toggleSelectLeague({id: currentLeagueId, matchType: EMatchTypes.IN_PLAY}));
  //   dispatch(ACTIONS.SPORT.toggleSelectLeague({id: currentLeagueId, matchType: EMatchTypes.UPCOMING}));
  // }, [currentLeagueId]);
  const onChangeGame = (item: {code: number, name: string}) => {
    switchSportByType(item.code);
  };

  return (
    <div className={styles.wrapper}>
      <div className='action-bar'>
        <div className='game-type flex items-center'>
          <DpButton
            className={`mr-10 ${_.includes([EMatchTypes.IN_PLAY, EMatchTypes.UPCOMING], matchType) ? 'active' : ''} today-btn`}
            text={_.find(ALL_MATCH_TYPES, {code: EMatchTypes.TODAY}).name}
            onClick={() => switchMatchType(EMatchTypes.IN_PLAY)}
          />
          <DpSwitchButton
            value={matchType}
            className='mr-10'
            items={ALL_MATCH_TYPES.filter((i) => i.code !== EMatchTypes.EARLY && i.code !== EMatchTypes.TODAY).map(
                (item) => ({label: item.name, value: item.code}),
            )}
            onChange={(type: EMatchTypes) => switchMatchType(type)}
            disabled={matchType === EMatchTypes.EARLY}
          />
          <DpButton
            className={`mr-10 ${matchType === EMatchTypes.EARLY ? 'active' : ''}`}
            text={_.find(ALL_MATCH_TYPES, {code: EMatchTypes.EARLY}).name}
            onClick={() => switchMatchType(EMatchTypes.EARLY)}
          />
        </div>
        <div className='flex items-center'>
          {
            !isESports &&
              <React.Fragment>
                {/* <DpSelect
                  className='mr-10 match-select'
                  label='选择联赛'
                  value={currentLeagueId}
                  maxLength={15}
                  onChange={(value: number) => setCurrentLeagueId(value)}
                  options={[{label: '全部', value: 0}, ..._.uniqBy(leagueStatistics, 'leagueId').map((item) => ({label: item.leagueName, value: item.leagueId}))]}
                /> */}
                <DpSwitchButton
                  className='mr-10 bet-type-switch'
                  value={gameBettingType}
                  items={ALL_GAME_BETTING_TYPE.map((item) => ({label: item.name, value: item.code}))}
                  onChange={(type: any) => switchGameBettingByType(type)}
                />
                <DpSwitchButton
                  type='button'
                  className='mr-10'
                  value={sortBy}
                  items={ALL_SORTBY.map((item) => ({label: item.name, value: item.code}))}
                  onChange={(type: any) => switchSortByType(type)}
                />
              </React.Fragment>
          }
          <DpIcon
            type='reload'
            className={classnames('mr-10', `pointer reload-icon  ${isReload && 'rotate-infinite'}`)}
            onClick={() => resetGuard(EPollIntervalGuardKeys.LEAGUE_STATISTICS)}
          />
          <DpIcon
            type='expand'
            className={classnames(`pointer ${isCollapseAll ? 'close-all-matchs' : 'open-all-matchs'}`)}
            onClick={toggleCollapseAllLeague}
          />
        </div>
      </div>
      {
        isESports && <div className={classnames('game-bar', `sid-${sid}`)}>
          {
            ALL_ESPORTS.map((item) => (
              <div className={classnames('item', `type-${item.code}`, {active: sid === item.code})} key={`${item.code}_${item.name}`} onClick={() => onChangeGame(item)}>
                <div className="logo"></div>
                <div className="name">{item.name}</div>
              </div>
            ))
          }
        </div>
      }
      {
        matchType === EMatchTypes.EARLY &&
        <div className='status-bar'>
          {matchType === EMatchTypes.EARLY && <DatePicker />}
        </div>
      }
    </div>
  );
}

export const DatePicker = React.memo(() => {
  const earlyGroup = useSelector((state: IStore) => state.sport.display.earlyGroup);
  const scrollContainerRef = React.useRef(null);
  const {switchQueryDate} = useSettings();
  const sportId = useSelector((state: IStore) => state.sport.userSettings.sportId);
  const [index, setIndex] = useState(0);
  // const currentDi = useSelector((state: IStore) => state.sport.userSettings.di);

  if (!earlyGroup) {
    return <></>;
  }
  const scrollToEnd = React.useCallback(() => {
    setIndex(1);
    scrollContainerRef.current.scrollTo({left: 260, behavior: 'smooth'});
  }, []);
  const scrollToStart = React.useCallback(() => {
    setIndex(0);
    scrollContainerRef.current.scrollTo({left: 0, behavior: 'smooth'});
  }, []);

  const week = _.times(7).map((i) => ({
    name: dayjs()
        .add(i + 1, 'day')
        .format('MM月DD日'),
    count: earlyGroup[i + 1],
  }));
  const dates = [{name: '所有日期', count: earlyGroup[0]}, ...week, {name: '其他', count: _.last(earlyGroup)}];

  // 底线滑动效果
  // const [hoverIndex, setHoverIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const handleHoverOn = (idx: number) => setHoverIndex(idx);
  // const handleHoverOff = () => setHoverIndex(-1);
  const handleClick = (idx: number) => setSelectedIndex(idx);

  // const withDefaultIndex = (a: number, def: number = 0): number => (!-~a ? def : a);
  // const dateItems = document.getElementsByClassName('option-item');
  type DateItemRef = React.MutableRefObject<(HTMLSpanElement | null)[]>;
  const dateItems: DateItemRef = useRef([]);
  const hrElementRef = useRef(null);

  useEffect(() => {
    // const underlineIdx = withDefaultIndex(hoverIndex, selectedIndex);
    const unlineSize = (dateItems.current[selectedIndex])?.offsetWidth || 0;
    let unlineShift = 0;
    let idx = 0;
    while (idx < selectedIndex) {
      unlineShift += (dateItems.current[idx])?.offsetWidth || 0;
      idx++;
    }

    // const hrElement = document.getElementById('optionUnderline');
    const hrElement = hrElementRef.current;

    if (hrElement) {
      hrElement.style.marginLeft = `${unlineShift}px`;
      hrElement.style.width = `${unlineSize}px`;
    }
  }, [selectedIndex]);

  useEffect(() => {
    handleClick(0);
  }, [sportId]);

  interface DateItem {
    name: string;
    count: number;
  }

  const renderItem =
    (onClick: (idx: number) => void) =>
      ({name, count}: DateItem, idx: number) =>
        (
          <span
            key={idx}
            ref={(el) => dateItems.current.push(el)}
            className={`option-item`}
            onClick={() => {
              switchQueryDate(idx);
              onClick(idx);
            }}>
            {`${name}(${count || 0})`}
          </span>
        );

  const renderItems = (
      items: DateItem[],
      onClick: (idx: number) => void,
      // hoverOn: (idx: number) => void,
      // hoverOff: () => void,
  ) => items.map(renderItem(onClick));

  return (
    <>
      {
        index > 0 &&
        <span className={classnames(styles.arrow, 'scroll-start')} onClick={scrollToStart}>
          <DpIcon width={22} height={22} type='arrow' />
        </span>
      }
      <div className={styles.datePicker} ref={scrollContainerRef}>
        {renderItems(dates, handleClick)}
        <hr id='optionUnderline' ref={hrElementRef} />
      </div>
      {
        index === 0 &&
        <span className={styles.arrow} onClick={scrollToEnd}>
          <DpIcon width={22} height={22} type='arrow' />
        </span>
      }
    </>
  );
});
