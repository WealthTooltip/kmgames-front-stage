/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 21:13:34
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/constants/configs/sport.ts
 * @Description: 体育相关的配置
 */
import {EPollIntervalGuardKeys} from '@constants/enum/sport';

export const SPORT: {
  DATABASE_NAME: string;
  DATABASE_VERSION: number;
  PAGE_SIZE: number;
  DEFAULT_EXPAND_MATCH_COUNT: number;
  INTERVAL: {
    [key in EPollIntervalGuardKeys]: number;
  }
} = {

  // 数据库名称
  DATABASE_NAME: 'KMG',

  // 项目版本
  DATABASE_VERSION: __DB_VERSION__,

  // 每页条数
  PAGE_SIZE: 50,

  // 滚球盘默认展开的赛事数量
  DEFAULT_EXPAND_MATCH_COUNT: 30,

  // match list轮询间隔时间
  INTERVAL: {
    [EPollIntervalGuardKeys.MATCH_DETAIL]: 10 * 1000,
    [EPollIntervalGuardKeys.MATCH_STATISTICS]: 30 * 1000,
    [EPollIntervalGuardKeys.BETTING_ODDS]: 5 * 1000,
    [EPollIntervalGuardKeys.LEAGUE_STATISTICS]: 30 * 1000,
    [EPollIntervalGuardKeys.MATCH_LIST_BY_LEAGUE_IDS]: 5 * 1000,
    [EPollIntervalGuardKeys.EARLY_MATCH_COUNT]: 15 * 1000,
    [EPollIntervalGuardKeys.GAME_RESULT_STATISTICS]: 30 * 1000,
    [EPollIntervalGuardKeys.FAVORITE_COUNT]: 30 * 60 * 1000,
  },
};

export default SPORT;
