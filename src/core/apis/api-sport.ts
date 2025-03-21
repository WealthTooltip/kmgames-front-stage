/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 16:26:50
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/apis/api-sport.ts
 * @Description: 体育相关接口
 */

export default {

  // 获取赛事列表
  'sport/get-match-list': 'kmg/sport/matches',

  // 获取赛事统计
  'sport/get-match-statistics': 'kmg/sport/type/countStat',

  // 获取赛事详情
  'sport/get-match-detail': 'kmg/sport/matches/$',

  // 获取赛事详情统计数据
  'sport/get-match-detail-statistics': 'kmg/sport/matches/$/videoData',

  // 赔率轮询
  'sport/get-betting-odds': 'kmg/sport/matches/betItems',

  // 联赛轮询
  'sport/get-league-list': 'kmg/sport/leagues/statistics/v3',

  // 提交订单
  'sport/submit-order': 'kmg/betorder/order',

  // 提交订单
  'sport/cancel-order': 'kmg/betorder/cancel',

  // 用户注单令牌
  'sport/betorder-auth-order': 'kmg/betorder/auth',

  // 获取所有的视频和联赛，球队logo数据
  'sport/get-video-source-list': 'api/v3/video/iconM',

  // 获取单个赛事视频资源
  'sport/get-match-video': 'api/v3/video/play',

  // 收藏比赛
  'sport/match-favorites-add': 'kmg/match/favorites/add',

  // 取消收藏比赛
  'sport/match-favorites-del': 'kmg/match/favorites/del',

  // 获取收藏比赛列表
  'sport/match-favorites-list': 'kmg/match/favorites/list',

  // 通过赛事IDs获取赛事详情
  'sport/get-match-list-by-league-ids': 'kmg/sport/matches/byLids',

  // 通过赛事获取早盘天数信息
  'sport/get-early-market-data': 'kmg/sport/matches/countByDay',

  // 通过赛事ids获取赛事列表
  'sport/get-match-list-by-match-ids': 'kmg/match/favorites/matches',

  // 获取赛果列表
  'sport/get-game-result-list': 'kmg/sport/matches/statistics',

  // 获取一个赛果信息
  'sport/get-game-result-detail': 'kmg/sport/matches/settlementResult',
};
