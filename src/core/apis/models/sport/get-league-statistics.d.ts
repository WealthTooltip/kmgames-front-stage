/*
 * @Author: Passion.KMG
 * @Date: 2024-01-03 19:01:26
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/apis/models/sport/get-league-statistics.d.ts
 * @Description:
 */
export type TLeagueStatisticsItem = {
  lid: number;
  cip: number;
  c: number;
  lg: string;
  ln: string;
  ipmids: number[];
  mids: number[];
  mid1s: number[];
};
