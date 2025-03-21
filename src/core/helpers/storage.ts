/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/helpers/storage.ts
 * @Description: 原生本地存储转换成 web LS 使用方式
 */
type TCache = {expires: Number; data: any};
type TKeys =
  | 'AUTH' // 登录 TOKEN
  | 'USER-PROFILE' // 用户登录信息
  | 'CUR_THEME' // 当前主题
  | 'ODD_TYPE' // 显示的赔率设置 1 欧盘 2 亚盘
  | 'MATCH_EXT_INFO'
  | 'LEAGUE_EXT_INFO' // 联赛logo额外信息
  | 'ORDER_TOKEN' // 下单令牌
  | 'CONFIRM_ACCEPT_ALL_ODD' // 确认接受所有赔率更变
  | 'CUR_GAME_BETTING_TYPE';

/**
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @description: 获取缓存，由于全局变量中的值与缓存系统中的值保持一致，所以直接使用全局变量即可
 * @param {string} key
 * @return {*}
 */
const getCache = (key: string): any => {
  if (!localStorage) {
    return null;
  }
  // 未找到该缓存
  if (!localStorage.getItem(key)) {
    return null;
  }
  const cache: TCache = JSON.parse(localStorage.getItem(key));
  // 过期缓存
  if (_.now() > Number(cache.expires)) {
    if (__DEV__) {
      console.log(`Cache ${key} expired!`);
    }
    localStorage.removeItem(key);
    return null;
  }
  return cache.data;
};

/**
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @description: 设置缓存，先为全局变量添加缓存，再对真缓存进行修改，修改过程中异常，则回滚全局变量
 * @param {string} key
 * @param {any} value
 * @param {number} expires 过期时间，单位 S
 * @return {*}
 */
const setCache = (key: string, value: any, expires?: number) => {
  if (!localStorage) {
    return;
  }
  // 默认60天缓存
  const expiresDate = _.now() + (expires || 3600 * 24 * 60) * 1000;
  localStorage.setItem(key, JSON.stringify({data: value, expires: expiresDate}));
};

/**
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @description: 删除某个缓存值
 * @param {string} key
 * @return {*}
 */
const removeCache = (key: string) => {
  if (!localStorage) {
    return;
  }
  localStorage.removeItem(key);
};

/**
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @description: 清空缓存
 * @return {*}
 */
const clearAll = () => {
  if (!localStorage) {
    return;
  }
  localStorage.clear();
};

/**
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @description: 清空缓存，但保留白名单
 * @return {*}
 */
const clear = () => {
  if (!localStorage) {
    return;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!_.includes(CACHE_WHITE_LIST, key)) {
      localStorage.removeItem(key);
    }
  }
};

// 清空缓存时候的白名单，白名单中的 KEY 不清除
export const CACHE_WHITE_LIST = [
  'AUTH',
  'USER-PROFILE',
  'CUR_GAME_BETTING_TYPE',
];

export default {
  get: (key: TKeys) => getCache(key),
  getAny: getCache,
  set: (key: TKeys, value: any, expires?: number) => setCache(key, value, expires),
  setAny: setCache,
  remove: (key: TKeys) => removeCache(key),
  removeAny: removeCache,
  clearAll,
  clear,
};
