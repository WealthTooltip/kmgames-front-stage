/*
 * @Author: Galen.GE
 * @Date: 2024-01-18 16:19:47
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/constants/enum/sport/betTypes.ts
 * @Description:
 */
export const BetTypes: any = {
  FT_OU: '全场大小',
  HT_OU: '半场大小',
  FT_OE: '全场单双',
  HT_OE: '单双-上半场',
  FT_AH: '全场让球',
  HT_AH: '半场让球',
  FT_1X2: '全场独赢',
  FT_ML: '全场独赢',
  HT_1X2: '半场独赢',
  HT_ML: '半场独赢',
  FT_CS: '全场波胆',
  HT_CS: '波胆-上半场',
  BothTeamsToScore: '双方进球',
  FTS_AH: '全场让局',
  FTS_OU: '总局数',
};

// 通过 体育类型 id 获取 玩法列表 （显示在赛事列表）
export const getPlayTypesBySportId = (id: number) => {
  switch (id) {
    case 2:
      return ['FT_ML', 'FT_AH', 'FT_OU', 'HT_ML', 'HT_AH', 'HT_OU'];
    case 3:
      return ['FT_ML', 'FTS_AH', 'FTS_OU', 'FT_AH'];
    case 1:
    default:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
  }
};
