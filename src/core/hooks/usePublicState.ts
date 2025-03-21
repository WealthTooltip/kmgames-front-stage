/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/usePublicState.ts
 * @Description:
 */

import TStore from '@core/reducers/_reduxStore.d';
import {Dispatch} from 'redux';
import {useDispatch, useSelector} from 'react-redux';
import ACTIONS from '@core/actions';
import CONIFGS from '@this/configs';
import Enum from '@constants/enum';
import G from '@constants/global';

interface IUsePublicState {
  dispatch : Dispatch,
  ACTIONS : typeof ACTIONS,
  rs : TStore,
  user : TStore['user'],
  base : TStore['base'],
  serverTime: number,
  isLogined : boolean,
  token : string,
  Enum : typeof Enum,
  CONIFGS : typeof CONIFGS,
  G : typeof G
}
export default (): IUsePublicState => {
  const dispatch = useDispatch();

  return {
    dispatch,
    ACTIONS,
    rs: useSelector((state: TStore) => state),
    user: useSelector((state: TStore) => state.user),
    base: useSelector((state: TStore) => state.base),
    serverTime: useSelector((state: TStore) => state.base.serverTime),
    isLogined: _.isEmpty(useSelector((state: TStore) => state.user)),
    token: useSelector((state: TStore) => state.user.token),
    Enum,
    CONIFGS,
    G,
  };
};
