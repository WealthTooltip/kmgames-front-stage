/*
 * @Author: Passion.KMG
 * @Date: 2023-12-14 14:04:43
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/useTheme.ts
 * @Description:
 */
import ACTIONS from '@actions/index';
import IStore from '@core/reducers/_reduxStore';
import {useDispatch, useSelector} from 'react-redux';
import {EDARK, ELIGHT, ETHEME, EMLIGHT, EMDARK} from '@this/configs';
import {useMemo} from 'react';

export default () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: IStore) => state.user.theme);
  const jsTheme = useMemo(() => {
    return theme === ETHEME.DARK ? EDARK : ELIGHT;
  }, [theme]);
  const mobileTheme = useMemo(() => {
    return theme === ETHEME.DARK ? EMDARK : EMLIGHT;
  }, [theme]);
  // 换肤
  const switchTheme = (theme: ETHEME) => {
    dispatch(ACTIONS.USER.setTheme({data: theme}));
    document.documentElement.setAttribute('data-theme', theme);
  };

  return {
    theme,
    jsTheme,
    mobileTheme,
    switchTheme,
  };
};
