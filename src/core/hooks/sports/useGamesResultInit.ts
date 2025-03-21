/*
 * @Author: Weima.KMG
 * @Date: 2024-1-28
 * @LastEditors: Weima.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useGamesResultInit.ts
 * @Description
 */
import {useMount, useUnmount} from 'react-use';
import usePublicState from '../usePublicState';
import {useSelector} from 'react-redux';
import TStore, {TGameResultPageInfo} from '@core/reducers/_reduxStore';
import dayjs from 'dayjs';
import {dateFormat} from '@views/kmg/desktop/components/DateRangePicker';
import {useEffect, useState} from 'react';
import {sportsCategory} from '@core/constants/enum/sport/sportsCategory';

export const initGameResultPageInfo: TGameResultPageInfo = {
  sportId: 1,
  pageNum: 1,
  pageSize: 10,
  beginTime: dayjs().subtract(7, 'day').format(dateFormat),
  endTime: dayjs().format(dateFormat),
};

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {matchStatistics} = useSelector((state: TStore) => state.sport.display);
  const {gameResultPageInfo} = useSelector((state: TStore) => state.sport.userSettings);
  const [pageInfo, setPageInfo] = useState<TGameResultPageInfo>(initGameResultPageInfo);
  const [gameResultOpts, setGameResultOpts] = useState<Array<{label: string, value: number}>>(_.map(matchStatistics, (match) => ({label: match.sportName, value: match.sportId})));

  // 管理页面页号
  useEffect(() => {
    setPageInfo(gameResultPageInfo);
    dispatch(ACTIONS.SPORT.getGameResultList({params: gameResultPageInfo}));
  }, [gameResultPageInfo]);

  // 管理页面体育列表
  useEffect(() => {
    const sportsCategoryArr = _.map(sportsCategory, (sport) => sport.sportId);
    const sportsMatchStatistics = _.filter(matchStatistics, (match) => !!match.count && _.indexOf(sportsCategoryArr, match.sportId) >= 0);

    sportsMatchStatistics.length && setGameResultOpts(sportsMatchStatistics.map((opt) => ({label: opt.sportName, value: opt.sportId})));
  }, [matchStatistics]);

  useMount(() => {
    dispatch(ACTIONS.SPORT.getMatchStatistics({params: {querys: undefined}}));
  });

  useUnmount(() => {
    dispatch(ACTIONS.SPORT.resetGameResultPageInfo());
  });

  return {
    pageInfo,
    setPageInfo,
    gameResultOpts,
  };
};
