/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:01:31
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useGuard.ts
 * @Description: 对守卫的各种类型操作
 */
import {useLatest} from 'react-use';
import {EPollIntervalGuardKeys, EPollIntervalGuardEvent} from '@constants/enum/sport';
import {useSelector} from 'react-redux';
import IStore, {TGuardQuerys} from '@core/reducers/_reduxStore.d';
import usePublicState from '../usePublicState';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const pollIntervalGuard = useSelector((state: IStore) => state.sport.pollIntervalGuard);
  const pollIntervalGuardLatest = useLatest(pollIntervalGuard);
  const [isReload, setIsReload] = React.useState(false);

  /**
   * @description 添加守卫
   * @param key 守卫的key
   * @param querys 守卫的查询条件
   */
  const addGuard = React.useCallback((key: EPollIntervalGuardKeys, querys?: TGuardQuerys, callback?: Function) => {
    dispatch(ACTIONS.SPORT.setPollIntervalGuard({
      key,
      event: EPollIntervalGuardEvent.ADD,
      querys,
      callback,
    }));
  }, []);

  /**
   * @description 更新守卫查询条件
   * @param key 守卫的key
   * @param querys 更新的查询条件
   */
  const updateQuerys = React.useCallback((key: EPollIntervalGuardKeys, querys: TGuardQuerys) => {
    dispatch(ACTIONS.SPORT.setPollIntervalGuard({
      key,
      event: EPollIntervalGuardEvent.UPDATE_QUERYS,
      querys,
    }));
  }, []);

  /**
   * @description 移除一个守卫
   * @param key 守卫的key
   */
  const removeGuard = React.useCallback((key: EPollIntervalGuardKeys) => {
    dispatch(ACTIONS.SPORT.setPollIntervalGuard({
      key,
      event: EPollIntervalGuardEvent.REMOVE,
    }));
  }, []);

  /**
   * @description 开始运行一个守卫
   * @param key 守卫的key
   */
  const startGuard = React.useCallback((key: EPollIntervalGuardKeys) => {
    dispatch(ACTIONS.SPORT.setPollIntervalGuard({
      key,
      event: EPollIntervalGuardEvent.START,
    }));
  }, []);

  /**
   * @description 暂停一个守卫
   * @param key 守卫的key
   */
  const pauseGuard = React.useCallback((key: EPollIntervalGuardKeys) => {
    dispatch(ACTIONS.SPORT.setPollIntervalGuard({
      key,
      event: EPollIntervalGuardEvent.PAUSE,
    }));
  }, []);

  /**
   * @description 获取查询条件
   * @param key 守卫的key
   * @returns
   */
  const getQuerys = React.useCallback((key: EPollIntervalGuardKeys): any => pollIntervalGuardLatest.current[key]?.querys, []);

  /**
   * @description 重置一个守卫，立即刷新重新请求
   * @param key 守卫的key
   * @returns
   */
  const resetGuard = React.useCallback((key: EPollIntervalGuardKeys) => {
    setIsReload(true);
    const querys = getQuerys(key);
    removeGuard(key);
    addGuard(key, querys);
    setTimeout(() => setIsReload(false), 2000);
  }, [pollIntervalGuard]);

  /**
   * @description reload 一个守卫
   * @param key 守卫的key
   * @returns
   */
  const reloadGuard = React.useCallback((key: EPollIntervalGuardKeys) => {
    const querys = getQuerys(key);
    reloadGuard(key);
    requestAnimationFrame(() => {
      addGuard(key, querys);
    });
  }, []);

  return {
    addGuard,
    updateQuerys,
    getQuerys,
    removeGuard,
    startGuard,
    pauseGuard,
    resetGuard,
    reloadGuard,
    isReload,
  };
};
