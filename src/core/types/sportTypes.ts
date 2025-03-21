/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:58:02
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/types/sportTypes.ts
 * @Description: 体育相关
 */

/** 比赛列表 */
export const GET_MATCH_LIST = 'SPORT/GET_MATCH_LIST';

/** 比赛统计 */
export const GET_MATCH_STATISTICS = 'SPORT/GET_MATCH_STATISTICS';

/** 设置轮询守卫 */
export const SET_POLL_INTERVAL_GUARD = 'SPORT/SET_POLL_INTERVAL_GUARD';

/** 移除所有轮询守卫 */
export const REMOVE_ALL_POLL_INTERVAL_GUARD = 'SPORT/REMOVE_ALL_POLL_INTERVAL_GUARD';

/** 更新赛事列表更新时间 */
export const UPDATE_MATCH_LIST_UPDATE_TIME = 'SPORT/UPDATE_MATCH_LIST_UPDATE_TIME';

/** 更新比赛详情更新时间 */
export const UPDATE_MATCH_DETAIL_UPDATE_TIME = 'SPORT/UPDATE_MATCH_DETAIL_UPDATE_TIME';

/** 更新比赛统计更新时间 */
export const UPDATE_MATCH_STATISTICS_UPDATE_TIME = 'SPORT/UPDATE_MATCH_STATISTICS_UPDATE_TIME';

/** 设置用户设置 */
export const UPDATE_USER_SETTINGS = 'SPORT/UPDATE_USER_SETTINGS';

/** 添加订单 */
export const ADD_ORDER = 'SPORT/ADD_ORDER';

/** 移除订单 */
export const REMOVE_ORDER = 'SPORT/REMOVE_ORDER';

/** 清空订单 */
export const REMOVE_ALL_ORDER = 'SPORT/REMOVE_ALL_ORDER';

/** 已投注订单 */
export const SHOW_CONFIRMED_ORDER = 'SPORT/SHOW_CONFIRMED_ORDER';
export const CLOSE_CONFIRMED_ORDER = 'SPORT/CLOSE_CONFIRMED_ORDER';

/** 添加已提交确认的订单列表 */
export const ADD_CONFIRMED_ORDERS = 'SPORT/ADD_CONFIRMED_ORDER';

/** 删除已提交确认的订单列表 */
export const REMOVE_CONFIRMED_ORDERS = 'SPORT/REMOVE_CONFIRMED_ORDER';

/** 更新订单 */
export const UPDATE_ORDER = 'SPORT/UPDATE_ORDER';

/** 更新订单金额 */
export const UPDATE_ORDER_MONEY = 'SPORT/UPDATE_ORDER_MONEY';

/** 更新列表显示状态 */
export const UPDATE_DISPLAY_TYPE = 'SPORT/UPDATE_DISPLAY_TYPE';

/** Full Screen */
export const UPDATE_DISPLAY_FULL_SCREEN = 'SPORT/UPDATE_DISPLAY_FULL_SCREEN';

/** 更新列表显示状态 */
export const UPDATE_DISPLAY_ZOOM_STATAUS = 'SPORT/UPDATE_DISPLAY_ZOOM_STATAUS';

/** 更新比赛详情 */
export const UPDATE_CURRENT_MATCH = 'SPORT/UPDATE_CURRENT_MATCH';

/** 更新投注栏赔率信息 */
export const UPDATE_BETTING_ODDS = 'SPORT/UPDATE_BETTING_ODDS';

/** 获取联赛列表 */
export const GET_LEAGUE_LIST = 'SPORT/GET_LEAGUE_LIST';

/** 更新联赛列表 */
export const UPDATE_LEAGUE_LIST = 'SPORT/UPDATE_LEAGUE_LIST';

/** 变更当前选中的联赛Id */
export const UPDATE_CURRENT_LEAGUE_ID = 'SPORT/UPDATE_CURRENT_LEAGUE_ID';

/** 删除所有当前选中的联赛 */
export const REMOVE_ALL_CURRENT_LEAGUE_ID = 'SPORT/REMOVE_ALL_CURRENT_LEAGUE_ID';

/** 获取所有赛事资源数据 */
export const GET_SOURCE_LIST = 'SPORT/GET_SOURCE_LIST';

/** 设置早盘数据数量 */
export const SET_EARLY_GROUP_DATA = 'SPORT/SET_EARLY_GROUP_DATA';

/** 获取早盘数据数量 */
export const GET_EARLY_GROUP_COUNT = 'SPORT/GET_EARLY_GROUP_COUNT';

/** 设置关注 */
export const SET_FAVORITE_MATCH_IDS = 'SPORT/SET_FAVORITE_MATCH_IDS';

/** 取消关注 */
export const CANEL_FAVORITE_MATCH_IDS = 'SPORT/CANEL_FAVORITE_MATCH_IDS';

/** 获取赛事关注列表 */
export const GET_FAVORITE_MATCH_IDS = 'SPORT/GET_FAVORITE_MATCH_IDS';

/** 修改收藏页面显示状态 */
export const UPDATE_SHOW_FAVORITE = 'SPORT/UPDATE_SHOW_FAVORITE';

/** 设置全屏状态 */
export const SET_FULLSCREEN = 'SPORT/SET_FULLSCREEN';

export const HANDLE_SETTING_MENU = 'SPORT/HANDLE_SETTING_MENU';

export const UPDATE_SETTING_MENU = 'SPORT/UPDATE_SETTING_MENU';
/** 设置预约状态 */
export const UPDATE_ORDER_RESERVE = 'SPORT/UPDATE_ORDER_RESERVE';

/** 获取赛果列表 */
export const GET_GAME_RESULT_LIST = 'SPORT/GET_GAME_RESULT_LIST';
/** 获取一个赛果信息 */
export const GET_GAME_RESULT_DETAIL = 'SPORT/GET_GAME_RESULT_DETAIL';
/** */
export const UPDATE_GAME_RESULT_PAGE_INFO = 'UPDATE_GAME_RESULT_PAGE_INFO';
export const RESET_GAME_RESULT_PAGE_INFO = 'RESET_GAME_RESULT_PAGE_INFO';

/** 设置预约状态 */
export const UPDATE_ORDER_RESERVE_ODD = 'SPORT/UPDATE_ORDER_RESERVE_ODD';

/** 设置路由地址 */
export const UPDATE_PAGE_PATH = 'UPDATE_PAGE_PATH';

/** 盘口教程开关 */
export const HANDLE_HANDICAP_TUTORIAL = 'SPORT/HANDLE_HANDICAP_TUTORIAL';

/** 详情开关 */
export const VISIABLE_DETAIL = 'SPORT/VISIABLE_DETAIL';

/** 更新串关数据 */
export const UPDATE_SERISE = 'SPORT/UPDATE_SERISE';
