/*
 * @Author: Passion.KMG
 * @Date: 2023-12-14 11:41:12
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/useDemo.ts
 * @Description:
 */

import {sleep} from '@helpers/unit';
import usePublicState from './usePublicState';
import useI18n from './useI18n';
import useTheme from './useTheme';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const {switchTheme} = useTheme();
  const {language, currency, country, handleLanguageChange} = useI18n();
  const [crash, setCrash] = React.useState<any>({});
  const [showPopup, setShowPopup] = React.useState(false);

  // const showAlert = () => {
  //   dispatch(
  //       ACTIONS.BASE.openAlert({
  //         title: '提示',
  //         content: '这是一个弹窗',
  //         cb: () => {
  //           console.log('bey!');
  //         },
  //         type: 2,
  //       }),
  //   );
  // };

  const showAlertHydra = (type: number) => {
    dispatch(
        ACTIONS.BASE.openAlert({
          title: '提示',
          content: ['这是一个弹窗'],
          cb: () => {
            console.log('bey!');
          },
          btnText: '投注记录',
          type: type,
        }),
    );
  };

  const showConfirm = () => {
    dispatch(
        ACTIONS.BASE.openConfirm({
          title: '提示',
          content: '这是一个弹窗',
          actions: [
            {text: '我要取消', type: 'cancel'},
            {
              text: '我要确定',
              cb: () => {
                console.log('我点了确定');
              },
            },
          ],
        }),
    );
  };

  const showLoading = async () => {
    dispatch(ACTIONS.BASE.openLoading({}));
    await sleep(5000);
    dispatch(ACTIONS.BASE.closeLoading());
  };

  const showI18nInfo = () => {
    dispatch(
        ACTIONS.BASE.openAlert({
          content: `language: ${language}<br/> currency: ${currency}<br/> country: ${country}`,
        }),
    );
  };

  const showToast = (text: string = `这是一个Toast ${_.now()}`, type: 'error' | 'success' | 'info' = 'error') => {
    dispatch(
        ACTIONS.BASE.openToast({
          text,
          types: type,
        }),
    );
  };

  interface IReqDemo {
    type: 'NORMAL' | 'LOADING' | 'CACHE-WITHOUT_REQUEST' | 'CACHE-WITH_REQUEST' | 'MOCK' | 'MOCK-PASSERROR';
  }
  const requestTest = ({type}: IReqDemo) => {
    const cb = (res: {Data: string; Code: number}) => {
      // 错误处理
      if (res.Code != 0) {
        dispatch(
            ACTIONS.BASE.openConfirm({
              title: '错误提示',
              content: '出错了，要重试吗？',
              actions: [
                {
                  text: '重试',
                  cb: () => {
                    requestTest({type: 'LOADING'});
                  },
                },
              ],
            }),
        );
        return;
      }
      dispatch(ACTIONS.BASE.openAlert({content: `当前时间：${res.Data}`}));
    };
    // 普通请求
    if (type === 'NORMAL') {
      dispatch(ACTIONS.BASE.requestDemo({cb}));
    }
    // 打开LOADING
    if (type === 'LOADING') {
      dispatch(ACTIONS.BASE.requestDemo({cb, loading: true}));
    }
    // 带10秒缓存，且不重复请求
    if (type === 'CACHE-WITHOUT_REQUEST') {
      dispatch(ACTIONS.BASE.requestDemo({cb, cache: {expires: 10, forward: false}}));
    }
    // 带10秒缓存，且仍然请求更新缓存
    if (type === 'CACHE-WITH_REQUEST') {
      dispatch(ACTIONS.BASE.requestDemo({cb, cache: {expires: 10, forward: true}}));
    }
    // 使用MOCK数据
    if (type === 'MOCK') {
      dispatch(ACTIONS.BASE.requestDemo({cb, mock: {Code: 100, Desc: 'MOCK CODE 为0的数据'}}));
    }
    // 使用MOCK数据，且不弹出错误提示
    if (type === 'MOCK-PASSERROR') {
      dispatch(ACTIONS.BASE.requestDemo({cb, mock: {Code: 100, Desc: 'MOCK CODE 为0的数据'}, passError: true}));
    }
  };

  return {
    language,
    currency,
    country,
    handleLanguageChange,
    crash,
    setCrash,
    showPopup,
    setShowPopup,
    // showAlert,
    showAlertHydra,
    showConfirm,
    showLoading,
    showI18nInfo,
    requestTest,
    showToast,
    switchTheme,
  };
};
