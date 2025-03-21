/*
 * @Author: Galen.GE
 * @Date: 2023-07-18 14:37:57
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/useI18n.ts
 * @Description: 语言国际化服务
 */

import Cookies from 'js-cookie';
import {LanguageMap} from '@constants/enum/common';
import tt from '@helpers/i18n';
import TT from '@core/templates/public/components/$T';
import CONFIG from '@this/configs';
import G from '@constants/global';

export default () => {
  const [language, setLanguage] = React.useState(G.GET('LANGUAGE'));
  const [currency, setCurrency] = React.useState(G.GET('CURRENCY'));
  const [country, setCountry] = React.useState(G.GET('COUNTRY'));

  /**
   * @description 语言切换
   * @param language 语言
   */
  // 只能从LANG value中选择
  type TLanguages = 'zh-CN' | 'vi-VN' | 'en-US' | 'th-TH' | 'id-ID' | 'ko-KR' | 'ja-JP' | 'ru-RU' | 'fr-FR';
  const handleLanguageChange = (language: TLanguages) => {
    if (__DEV__) {
      console.log('语言切换：', language);
    }
    G.SET('LANGUAGE', 'language');
    Cookies.set('LANGUAGE', language, {expires: 30, path: '/'});
    document.documentElement.lang = language;
    setLanguage(language);
    location.reload();
  };

  /**
   * @description 货币切换
   * @param currency 货币
  */
  const handleCurrencyChange = (currency: string) => {
    if (__DEV__) {
      console.log('货币切换：', currency);
    }
    G.SET('CURRENCY', currency);
    Cookies.set('CURRENCY', currency, {expires: 30, path: '/'});
    setCurrency(currency);
    location.reload();
  };

  /**
   * @description 国家切换
   * @param country 国家
  */
  const handleCountryChange = (country: string) => {
    if (__DEV__) {
      console.log('国家切换：', country);
    }
    G.SET('COUNTRY', country);
    Cookies.set('COUNTRY', country, {expires: 30, path: '/'});
    setCountry(country);
    location.reload();
  };

  return {
    handleLanguageChange,
    handleCurrencyChange,
    handleCountryChange,
    language,
    currency,
    country,
    supportLanguages: _.filter(LanguageMap, (item: any) => _.includes(CONFIG.SUPPORT_LANGUAGES, item.value)),
  };
};

// 翻译组件
export const $T = TT;

// 独立翻译服务
export const $t = tt;
