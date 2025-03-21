/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 15:05:32
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/services/db.ts
 * @Description:
 */
import Dexie from 'dexie';
import CONFIG from '@this/configs';
import {TMatch} from './Table.d';

// 继承 Dexie 并声明表的类型
class KmgDatabase extends Dexie {
  public matches: Dexie.Table<TMatch, number>;

  constructor() {
    super(CONFIG.SPORT.DATABASE_NAME);
    this.version(CONFIG.SPORT.DATABASE_VERSION).stores({
      matches: 'matchId,updateTime,leagueId',
    });
    this.matches = this.table('matches');
  }
}

// 创建数据库实例
const db = new KmgDatabase();

export default db;
