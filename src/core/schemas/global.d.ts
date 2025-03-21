/*
 * @Description: 全局变量，包含第三方库引用
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-15 18:20:27
 * @LastEditors: Passion.KMG
 */
declare let $: any;
declare let $t: Function | any;
declare let devConsole: any;
declare let __DEV__: any;
declare let __API_VERSION__: 'local' | 'dev' | 'uat' | 'prod';
declare let __DB_VERSION__: number;
declare let _console: any;

interface Window{
  $SETTINGS: any;
  $LANG: string;
  $CURRENCY: string;
  $RRPORT_CURRENCY: string | null;
  $LANG_TRANS: Object;
}

declare module '*.scss';
declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

// 由于 @types/react-router-dom 与 @types/react-redux 声明冲突? 自定义该模块签名解决该问题
declare module 'react-copy-to-clipboard'{
  export const CopyToClipboard: any;
}

declare module 'react-rnd' {
  export const Rnd: any;
}

declare module 'nzh/cn';
declare module 'qrcode.react';
declare module 'fastclick';
declare module 'react-fastclick';
declare module 'moment/locale/zh-cn';
declare module 'react-mobile-datepicker';
declare module 'antd-mobile/lib/date-picker';
declare module '@core-i18n';
declare module '@view-i18n';
declare module 're-carousel';
declare module 'react-slick';
// font
declare module '*.otf';

