/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/useAuth.ts
 * @Description:
 */
import {EPermission} from '@constants/enum/user';
import usePublicState from './usePublicState';

export default () => {
  const {isLogined, dispatch, ACTIONS} = usePublicState();

  /**
   * @description: 权限控制
   * @param {fn} Function
   * @param {permission} EPermission
   * @return: Function
   * @example:
   * const { authorize } = useAuth();
   * const handle = authorize({ fn: () => {}, permission: EPermission.LOGIN });
   * handle();
   */
  interface IAuthorize {
    fn: Function,
    permission: EPermission
  }
  const authorize = ({fn, permission}: IAuthorize) => (...params: any) => {
    if (permission === EPermission.NONE) {
      fn(...params);
    }
    if (permission === EPermission.LOGIN) {
      if (!isLogined) {
        dispatch(ACTIONS.BASE.openToast({text: '请先登录', types: 'error'}));
        return;
      }
      fn(...params);
    }
  };

  return {
    authorize,
  };
};
