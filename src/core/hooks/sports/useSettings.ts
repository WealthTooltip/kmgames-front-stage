/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:41:38
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useSettings.ts
 * @Description: 相关设置
 */
import {
  EMatchTypes, ESortBy, EGameBettingType, EPollIntervalGuardKeys, EGameType, ESportType, EESportType,
} from '@constants/enum/sport';
import {useSelector} from 'react-redux';
import useLeagueAndMatchData from './useLeagueAndMatchData';
import usePublicState from '../usePublicState';
import useGuard from './useGuard';
import {findLeagueIdsWithCountGreaterThanN} from '@helpers/unit';
import IStore, {TGameResultPageInfo} from '@core/reducers/_reduxStore.d';
import {TMatchData} from '@core/apis/models/sport/get-match-list.d';
import CONFIG from '@this/configs';
import {isESports} from '@core/utils';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {updateQuerys, getQuerys} = useGuard();
  const {
    sortBy,
    matchType,
    sportId,
    sid,
    collapseLeagueIds,
    gameBettingType,
  } = useSelector((state: IStore) => state.sport.userSettings);
  const leagueStatistics = useSelector((state: IStore) => state.sport.display.leagueStatistics);
  const guardQuerys = useSelector((state: IStore) => state.sport.pollIntervalGuard[EPollIntervalGuardKeys.LEAGUE_STATISTICS])?.querys;
  const {gameResultPageInfo: pageInfoState} = useSelector((state: IStore) => state.sport.userSettings);
  const {saveMatchListToDB} = useLeagueAndMatchData();
  const [isCollapseAll, setIsCollapseAll] = React.useState<boolean>(false);
  const [isCollapseInplay, setIsCollapseInplay] = React.useState<boolean>(false);
  const [isCollapseUpcoming, setIsCollapseUpcoming] = React.useState<boolean>(false);

  React.useEffect(() => {
    const leagueCollapse = findLeagueIdsWithCountGreaterThanN(leagueStatistics, CONFIG.SPORT.DEFAULT_EXPAND_MATCH_COUNT);
    const _collapseLeagueIds = leagueCollapse.map((i) => `${i.state}#${i.id}`);
    // 求交集，如果交集的长度等于大于当前展开的长度，则收起
    const intersection = _.intersection(_collapseLeagueIds, collapseLeagueIds);
    const inPlay = _.intersection(_collapseLeagueIds.filter((item) => item.startsWith(EMatchTypes.IN_PLAY)), collapseLeagueIds.filter((item) => item.startsWith(EMatchTypes.IN_PLAY)));
    const upComing = _.intersection(_collapseLeagueIds.filter((item) => item.startsWith(EMatchTypes.UPCOMING)), collapseLeagueIds.filter((item) => item.startsWith(EMatchTypes.UPCOMING)));
    setIsCollapseAll(intersection.length >= _collapseLeagueIds.length);
    setIsCollapseInplay(inPlay.length >= _collapseLeagueIds.filter((item) => item.startsWith(EMatchTypes.IN_PLAY)).length);
    setIsCollapseUpcoming(upComing.length >= _collapseLeagueIds.filter((item) => item.startsWith(EMatchTypes.UPCOMING)).length);
  }, [collapseLeagueIds]);

  // 球类电竞切换
  const switchGameType = React.useCallback((category: EGameType, sportId: number) => {
    dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
    dispatch(ACTIONS.SPORT.toggleFullScreen({data: false}));
    isESports() ? dispatch(ACTIONS.SPORT.updateUserSettings('sportId', EESportType.LOL)) : dispatch(ACTIONS.SPORT.updateUserSettings('sportId', ESportType.FOOTBALL));
    dispatch(ACTIONS.SPORT.updateUserSettings('sid', EESportType.LOL));
    updateQuerys(EPollIntervalGuardKeys.MATCH_STATISTICS, {category});
    updateQuerys(EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS, {category});
    updateQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS, {category, sportId, di: 0});
    updateQuerys(EPollIntervalGuardKeys.EARLY_MATCH_COUNT, {category, sportId, di: 0});
  }, []);

  /**
   * @description: 切换赛事类型
   * @param {EOrderBy} type
   */
  const switchSportByType = React.useCallback((sportId: number): void => {
    sessionStorage.removeItem('media');
    dispatch(ACTIONS.SPORT.updateUserSettings('sportId', sportId));
    dispatch(ACTIONS.SPORT.updateUserSettings('sid', sportId));
    dispatch(ACTIONS.SPORT.updateDisplayZoomStatus(false));
    dispatch(ACTIONS.SPORT.toggleFullScreen({data: false}));
    updateQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS, {sportId, di: 0});
    updateQuerys(EPollIntervalGuardKeys.EARLY_MATCH_COUNT, {sportId, di: 0});
  }, []);

  /**
   *
   * @description: 切換賽果頁面信息
   * @param {EOrderBy} type
   */
  const switchGameResultPageInfo = React.useCallback((pageInfo: TGameResultPageInfo): void => {
    dispatch(ACTIONS.SPORT.updateGameResultPageInfo(pageInfo));
    /**
     * dispatch an action to update state
     */
  }, [pageInfoState]);

  /**
   * @description: 切换排序类型
   * @param {EOrderBy} type
   */
  const switchSortByType = React.useCallback((type: ESortBy): void => {
    dispatch(ACTIONS.SPORT.updateUserSettings('sortBy', type));
    updateQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS, {sortBy: type, di: 0});
  }, []);

  /**
   * @description: 切换游戏投注模式
   * @param {EOrderBy} type
   */
  const switchGameBettingByType = React.useCallback((type: EGameBettingType): void => {
    dispatch(ACTIONS.SPORT.updateUserSettings('gameBettingType', type));
  }, [gameBettingType]);

  /**
   * @description: 切换比赛类型
   * @param {EMatchTypes} type
   */
  const switchMatchType = React.useCallback((type: EMatchTypes): void => {
    // 如果是滚球切到未开赛，或者未开赛切到滚球，则仅做排序与收起展开的切换
    if (matchType === EMatchTypes.IN_PLAY && type === EMatchTypes.UPCOMING ||
      matchType === EMatchTypes.UPCOMING && type === EMatchTypes.IN_PLAY) {
      dispatch(ACTIONS.SPORT.updateUserSettings('matchType', type));
      return;
    }
    dispatch(ACTIONS.SPORT.updateUserSettings('matchType', type));
    updateQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS, {qt: type, di: 0});
  }, [matchType]);

  /**
   * @description: 切换比赛类型
   * @param {EMatchTypes} type
   */
  const switchQueryDate = React.useCallback((index: number): void => {
    updateQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS, {...guardQuerys, di: index});
  }, [guardQuerys]);

  /**
   * @description: 切换收起展开
   * @param {number} leagueId
   */
  interface IToggleCollapseLeague {
    leagueId: string;
    isRequestData?: boolean;
  }
  const toggleCollapseLeague = React.useCallback(({leagueId, isRequestData}: IToggleCollapseLeague): void => {
    let _collapseLeagueIds = _.cloneDeep(collapseLeagueIds);
    if (_collapseLeagueIds.includes(leagueId)) {
      _collapseLeagueIds = _.pull(_collapseLeagueIds, leagueId);
    } else {
      _collapseLeagueIds.push(leagueId);
      if (isRequestData) {
        const querys = getQuerys(EPollIntervalGuardKeys.LEAGUE_STATISTICS);
        dispatch(ACTIONS.SPORT.getMatchListByLeagueIds({
          data: {
            ...querys,
            leagueIds: [Number(leagueId.split('#')[1])],
          },
          cb: (res: {data: TMatchData}) => {
            saveMatchListToDB(res.data, false);
          },
        }));
      }
    }
    dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', _collapseLeagueIds));
  }, [collapseLeagueIds, matchType]);

  /**
   * @description: 切换全部收起展开
   * @param {void}
   */
  const toggleCollapseAllLeague = React.useCallback((): void => {
    if (isCollapseAll) {
      dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', []));
      return;
    }
    const leagueCollapse = findLeagueIdsWithCountGreaterThanN(leagueStatistics, CONFIG.SPORT.DEFAULT_EXPAND_MATCH_COUNT);
    const _collapseLeagueIds = leagueCollapse.map((i) => `${i.state}#${i.id}`);
    dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', _collapseLeagueIds));
    // 如果交集为空, 则全部收起
  }, [isCollapseAll, leagueStatistics]);

  const toggleCollapseLeagueByMatchType = React.useCallback((type: EMatchTypes) => {
    const toggle = type === EMatchTypes.IN_PLAY ? isCollapseInplay : isCollapseUpcoming;
    const leagueCollapse = findLeagueIdsWithCountGreaterThanN(leagueStatistics, CONFIG.SPORT.DEFAULT_EXPAND_MATCH_COUNT);
    const lids = leagueCollapse.filter((item) => item.state === type).map((item) => `${type}#${item.id}`);
    const lidsMap = lids.reduce((a: any, b) => {
      a[b] = true;
      return a;
    }, {});
    dispatch(ACTIONS.SPORT.updateUserSettings('collapseLeagueIds', toggle ? collapseLeagueIds.filter((item) => !lidsMap[item]) : _.uniq([...collapseLeagueIds, ...lids])));
  }, [leagueStatistics, collapseLeagueIds, isCollapseInplay, isCollapseUpcoming]);

  const handleSettingMenu = () => {
    dispatch(ACTIONS.SPORT.handleSettingMenu());
  };

  const handleHandicap = (val: number) => {
    dispatch(ACTIONS.USER.setOddType({data: val}));
  };

  return {
    matchType,
    sortBy,
    sportId,
    sid,
    gameBettingType,
    collapseLeagueIds,
    switchSportByType,
    switchGameResultPageInfo,
    switchSortByType,
    switchMatchType,
    toggleCollapseLeague,
    toggleCollapseAllLeague,
    switchGameBettingByType,
    switchQueryDate,
    isCollapseAll,
    switchGameType,
    handleSettingMenu,
    toggleCollapseLeagueByMatchType,
    isCollapseInplay,
    isCollapseUpcoming,
    handleHandicap,
  };
};
