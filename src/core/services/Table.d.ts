/*
 * @Author: Passion.KMG
 * @Date: 2023-12-16 17:24:09
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/services/Table.d.ts
 * @Description: 界面上使用的赛事数据类型
 */

import {EOddType} from '@core/constants/enum/sport';

// 比赛表
export type TMatch = {
  // 更新时间
  updateTime: number;
  // 场次排序
  sortNo: number;
  // 赛事id
  matchId: number;
  // pmid
  pmId: number;
  // 视频ID
  pdId: string;
  // 188赛事ID
  mid1: number;
  // 赛事名称
  matchName: string;
  // 联赛id
  leagueId: number;
  // 联赛名称
  leagueName: string;
  // 联赛logo
  leagueLogo?: string;
  // 运动 id
  sportId: number;
  // 玩法数量
  playTypeCount: number;
  // 是否搜藏
  isFavorite: boolean;
  // 是否滚球中
  isLive: boolean;
  // 是否中立
  isNe: boolean;
  // 电竞有几轮
  round: string;
  // 队伍信息
  teams: {
    // 主队
    home: {
      name: string;
      icon: string;
      isHandicap: boolean;
    },
    // 客队
    away: {
      name: string;
      icon: string;
      isHandicap: boolean;
    }
  };
  // 比赛时钟信息
  matchClock: {
    // 收到时间
    receiveTime: number;
    // 开始时间
    startTime: number;
    // 当前时间-秒
    second: number;
    // 已开赛时间
    playTime: string;
    // 阶段 1H(上半场) HT(中场休息)  2H（下半场）FT (比赛结束) q1,q2,q3,q4(篮球1-4节)
    period: string;
    // 是否走表
    isRunning: boolean;
    // 是否倒计时
    isCountDown: boolean;
  };
  // 比分
  score: {
    // 主队
    home: number;
    // 客队
    away: number;
    // 主队红牌
    homeRedCard: number;
    // 客队红牌
    awayRedCard: number;
    // 主队黄牌
    homeYellowCard: number;
    // 客队黄牌
    awayYellowCard: number;
    // 主队角球
    homeCorner: number;
    // 客队角球
    awayCorner: number;
    // 阶段比分
    periodScore: {
      home: number;
      away: number;
      period: string;
    }[];
  };
  // 动画地址合集
  animation: Array<string>;
  // 直播地址合集
  live: Array<string>;
  videoId?: string | number;
  // 是否有视频源
  hasVideo?: boolean;
  // 是否有动画源
  hasAnimate?: boolean;
  // 是否有角球
  hasCorner: boolean;
  // 玩法分组
  playGroup: Array<{
    id: number;
    name: string;
  }>
  // 玩法以及赔率
  playTypes: Array<{
    // 玩法类型
    code: string;
    // 玩法名称
    name: string;
    // 玩法阶段
    period: number | string;
    // 所属玩法id集合
    playGroupIds: number[];
    // 玩法分类
    ctid: number;
    // 带线玩法
    mks: Array<{
      // 线id
      mkId: number;
      // 支持串关
      allowParlay: boolean;
      // 赔率信息
      ops: Array<TOrder>
    }>
  }>
}

export type PlayType = TMatch['playTypes'][0]

export type OddType = TMatch['playTypes'][0]['mks'][0]['ops'][0]

export type OddBetType = 'HK' | 'OU' | 'ML'

export type TOrder = {
    // 比赛ID（查询字段）
    matchId: number;
    matchName: string;
    matchDate: number;
    leagueId: number;
    leagueName: string;
    ctid: number;
    win: 0 | 1;
    // 运动 id
    sportId?: number;
    teams: {
      // 主队
      home: {
        name: string;
        icon: string;
      },
      // 客队
      away: {
        name: string;
        icon: string;
      }
    };
    // 比分
    score: {
      // 主队
      home: number;
      // 客队
      away: number;
      homeRedCard: number,
      awayRedCard: number,
      homeYellowCard: number,
      awayYellowCard: number,
      homeCorner: number,
      awayCorner: number,
    };
    // 线ID（互斥字段）
    mkId: number;
    // 玩法名称（冗余字段，避免多次查询）
    playName: string,
    // 赔率Id
    id: string | number;
    // 玩法全称（一般作为展示使用）
    name: string;
    // 投注项 主 客 和 等
    orderName: string;
    // 纯的name，没有经过任何加工
    betTeam: string;
    // 投注 betHandicap
    betHandicap: string;
    // 投注项已结束 不可投注 但是可以显示赛果
    ended: boolean;
    // 是否锁盘
    locked: boolean;
    // 销售状态（是否显示）
    available: boolean;
    // 赔率
    od: number;
    // 类型
    type: number | string;
    // 相比上一次赔率的变化
    change: 'up' | 'down' | 'none'
    // 标记，用于比较赔率变化
    tag: string;
    money?: number | string;
    maxWin?: number;
    isRunning: boolean;
    // 是否刚刚加入投注栏
    justAddCar:boolean;
    // 上一次赔率
    prevOdd:number;
    minBetAmount: number;
    maxBetAmount: number;
    overAmountLimit: boolean;
    inReservationStatus: boolean;
    reservationOdd: number;
    reservationMarkOdd: number;
    reserveAlert: boolean;
    currentOddType?: EOddType;
    sportNameText: string;
    // 赔率类型
    oddBetType: EOddType;
    // 添加订单时,自动备份一个欧盘赔率
    europeOdd?: number;
}
