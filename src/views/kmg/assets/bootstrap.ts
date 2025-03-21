/*
 * @Author: Passion.KMG
 * @Date: 2022-11-30 00:42:02
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/assets/bootstrap.ts
 * @Description: 初始化
 */
// @ts-nocheck
import Cookies from 'js-cookie';

window.__DEV__ = __DEV_MODE__;

if (localStorage && localStorage.getItem('debug')) {
  if (localStorage.getItem('debug') == 0) {
    __DEV__ = false;
  }
  if (localStorage.getItem('debug') == 1) {
    __DEV__ = true;
  }
}

console.log('%c ## WELCOME TO VISIT KMG ###', 'color: #409EFF; font-size: 16px; font-weight: 600;');

window.COUNTRY = Cookies.get('COUNTRY') || 'China';
window.LANGUAGE = Cookies.get('LANGUAGE') || 'zh-CN';
window.CURRENCY = Cookies.get('CURRENCY') || 'CNY';

Cookies.set('COUNTRY', window.COUNTRY, {expires: 30, path: '/'});
Cookies.set('LANGUAGE', window.LANGUAGE, {expires: 30, path: '/'});
Cookies.set('CURRENCY', window.CURRENCY, {expires: 30, path: '/'});

document.documentElement.lang = window.LANGUAGE;

if (__DEV__) {
  console.group('##GE-KMG GLOBAL VARIABLES##');
  console.log('COUNTRY:', window.COUNTRY);
  console.log('LANGUAGE:', window.LANGUAGE);
  console.log('CURRENCY:', window.CURRENCY);
  console.log('开启debug', '控制台输入debug');
  console.log('API-接口缓存：', localStorage.getItem('api_cache') === '1' ? '开启' : '关闭');
  console.groupEnd();
}

// 判断是否为开发环境的高阶函数
const isDev = (callback: Function) => (...params) => {
  if (__DEV__) {
    callback(...params);
  }
};

window._console = {
  log: isDev(console.log),
  info: isDev(console.info),
  warn: isDev(console.warn),
  error: isDev(console.error),
  group: isDev(console.group),
  groupEnd: isDev(console.groupEnd),
  groupCollapsed: isDev(console.groupCollapsed),
  table: isDev(console.table),
  time: isDev(console.time),
  timeEnd: isDev(console.timeEnd),
  timeLog: isDev(console.timeLog),
  clear: isDev(console.clear),
};
