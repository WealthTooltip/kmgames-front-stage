/*
 * @Author: Passion.KMG
 * @Date: 2024-01-09 12:12:03
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useFavorites.ts
 * @Description:
 */

import {useSelector} from 'react-redux';
import usePublicState from '../usePublicState';
import TStore from '@core/reducers/_reduxStore';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const favoriteIds = useSelector((state: TStore) => state.sport.display.favoriteIds);

  const getFavoriteList = () => {
    dispatch(ACTIONS.SPORT.getFavorites());
  };

  const addFavorites = (data: number[]) => {
    // 求差集
    const diff = _.difference(data, favoriteIds);
    dispatch(ACTIONS.SPORT.addFavorites(diff));
  };

  const cancelFavorites = (data: number[]) => {
    dispatch(ACTIONS.SPORT.delFavorites(data));
  };

  // 切换关注比赛
  const onToggleFavorite = React.useCallback((e: React.MouseEvent, matchIds: number[]) => {
    e.stopPropagation();
    if (_.isEmpty(matchIds)) {
      return;
    }
    if (isFavorite(matchIds)) {
      cancelFavorites(matchIds);
    } else {
      addFavorites(matchIds);
    }
  }, [favoriteIds]);

  // 是否关注比赛
  const isFavorite = React.useCallback((matchId: number[]): boolean => {
    if (_.isEmpty(matchId)) {
      return false;
    }
    return _.intersection(favoriteIds, matchId).length === matchId.length;
  }, [favoriteIds]);

  return {
    getFavoriteList,
    favoriteIds,
    isFavorite,
    addFavorites,
    cancelFavorites,
    onToggleFavorite,
  };
};
