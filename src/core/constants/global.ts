/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/constants/global.ts
 * @Description: 全局变量，所有的全局变量都应该在此！
 */
// @ts-nocheck
import mitt from 'mitt';

export type TKeys = 'COUNTRY' // 国家
            | 'CURRENCY' // 货币
            | 'LANGUAGE' // 语言
            | 'REQUEST_CANCLE_TOKEN' // 请求取消令牌
            | 'MATCH_LIST_ODDS' // 比赛列表赔率
            | 'MATCH_DETAIL_ODDS' // 比赛详情赔率
            | 'FAVORITE_MATCH_ODDS' // 收藏比赛列表赔
            | 'ODD_TYPE' // 欧盘/亚盘
            | 'CUR_THEME' // 主题色
            | 'MATCH_EXT_INFO' // 比赛额外信息（临时使用全局变量，后续可能修改）
            | 'MATCH_DETAIL' // 比赛详情
            | 'MATCH_STATISTICS' // 比赛统计

// 初始化
const INIT = () => {
  SET('REQUEST_CANCLE_TOKEN', {});
  SET('MATCH_EXT_INFO', {});
  SET('MATCH_STATISTICS', {});
};

// 获取全局变量
const GET = (key: string): any => window[key];

// 设置全局变量值
const SET = (key: string, value: any) => {
  window[key] = value;
};

export default {
  GET: (key: TKeys) => GET(key),
  SET: (key: TKeys, value: any) => SET(key, value),
  INIT,
};
