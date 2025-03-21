/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 17:36:28
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/constants/enum/sport/index.ts
 * @Description:
 */
export enum EPollIntervalGuardKeys {
  /** 比赛列表使用联赛ids */
  MATCH_LIST_BY_LEAGUE_IDS = 'sport/get-match-list-by-league-ids',
  /** 比赛统计 */
  MATCH_STATISTICS = 'sport/get-match-statistics',
  /** 比赛详情 */
  MATCH_DETAIL = 'sport/get-match-detail',
  /** 投注赔率 */
  BETTING_ODDS = 'sport/get-betting-odds',
  /** 联赛列表 */
  LEAGUE_STATISTICS = 'sport/get-league-list',
  /** 早盘数量数据 */
  EARLY_MATCH_COUNT = 'sport/get-early-market-data',
  /** 赛果列表 */
  GAME_RESULT_STATISTICS = 'sport/get-game-result-list',
  /** 收藏数据 */
  FAVORITE_COUNT = 'sport/favorite-count',
}

export enum ENonPollKeys {
  /** 一个赛果信息 */
  GAME_RESULT_DETAIL = 'sport/get-game-result-detail',
}

// 轮询守卫事件
export enum EPollIntervalGuardEvent {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE_QUERYS = 'UPDATE-QUERYS',
  START = 'START',
  PAUSE = 'PAUSE'
}

// 轮询守卫状态
export enum EPollIntervalGuardStatus {
  /** 进行中 */
  RUNNING = 'RUNNING',
  /** 暂停 */
  PAUSE = 'PAUSE',
  /** 已结束 */
  STOPED = 'STOPED'
}

// 排序方式，时间，热门
export enum ESortBy {
  TIME = 'time',
  HOT = 'hot'
}

export enum MenuType {
  LEAGUE = 'LEAGUE',
  FAVORITE = 'FAVORITE',
}

// 投注类别，专家，热门
export enum EGameBettingType {
  BEGINNER = 'BEGINNER',
  ADVANCED = 'ADVANCED',
}

// 定义并约束投注模式，专家，热门
export const ALL_GAME_BETTING_TYPE: { code: EGameBettingType, name: string }[] = [
  {
    code: EGameBettingType.ADVANCED,
    name: '专业',
  },
  {
    code: EGameBettingType.BEGINNER,
    name: '新手',
  },
];

// 定义并约束排序方式，时间，热门
export const ALL_SORTBY: { code: ESortBy, name: string }[] = [
  {
    code: ESortBy.TIME,
    name: '时间',
  },
  {
    code: ESortBy.HOT,
    name: '热门',
  },
];

// 早盘，今日，滚球
export enum EMatchTypes {
  EARLY = 'early',
  UPCOMING = 'upcoming',
  IN_PLAY = 'in-play',
  TODAY = 'today'
}

export const ALL_MATCH_TYPES: Array<{ code: EMatchTypes, name: string, shortName?: string }> = [
  {
    code: EMatchTypes.TODAY,
    name: '今日',
    shortName: '今日',
  },
  {
    code: EMatchTypes.IN_PLAY,
    name: '滚球盘',
    shortName: '滚球',
  },
  {
    code: EMatchTypes.UPCOMING,
    name: '未开赛',
    shortName: '未开赛',
  },
  {
    code: EMatchTypes.EARLY,
    name: '早盘',
    shortName: '早盘',
  },
];

// 体育 电竞 种类
export enum EGameType {
  SPORTS = 0,
  ESPORTS = 1,
}

// 赛事类型
export enum ESportType {
  FOOTBALL = 1,
  BASKETBALL = 2,
  TENNIS = 3,
  E_SPORTS = 4,
  SNOOKER = 5,
  VOLLEYBALL = 6,
  SPECIAL_PROJECTS = 7,
  DARTS = 8,
  RUGBY = 9,
  BOXING_MMA = 10,
  HANDBALL = 11,
  ICE_HOCKEY = 12,
  CRICKET = 13,
  FINANCIAL_BETTING = 14,
  LOTTERY = 15,
  AMERICAN_FOOTBALL = 16,
  GOLF = 17,
  BASEBALL = 18,
  BADMINTON = 19,
  BEAUTY_CONTEST = 20,
  RACING = 21,
  BEACH_SOCCER = 22,
  TABLE_TENNIS = 23,
  SOFTBALL = 24,
  INDOOR_SOCCER = 25,
  BEACH_VOLLEYBALL = 26,
  WINTER_SPORTS = 27,
  FIELD_HOCKEY = 28,
  CYCLING = 29,
  GYMNASTICS = 30,
  TRACK_AND_FIELD = 31,
  MORE_SPORTS = 32,
  WATER_SPORTS = 33,
  DOTA = 276,
  CSGO = 277,
  LOL = 278,
  KING = 279,
}

// 电竞赛事类型
export enum EESportType {
  LOL = 278,
  DOTA2 = 276,
  KINGOFGLORY = 279,
  CS2 = 277,
}

export const ALL_ESPORTS: { code: EESportType, name: string }[] = [
  {
    code: EESportType.LOL,
    name: '英雄联盟',
  },
  {
    code: EESportType.DOTA2,
    name: 'DOTA2',
  },
  {
    code: EESportType.KINGOFGLORY,
    name: '王者荣耀',
  },
  {
    code: EESportType.CS2,
    name: 'CS:GO/CS2',
  },
];

// 定义并约束数组
export const ALL_SPORTS: { code: ESportType, name: string }[] = [
  {
    code: ESportType.FOOTBALL,
    name: '足球',
  },
  {
    code: ESportType.BASKETBALL,
    name: '篮球',
  },
  {
    code: ESportType.TENNIS,
    name: '网球',
  },
  {
    code: ESportType.VOLLEYBALL,
    name: '排球',
  },
];

// 定义并约束数组
export const ALL_SPORTS_MAP = {
  [ESportType.FOOTBALL]: '足球',
  [ESportType.BASKETBALL]: '篮球',
  [ESportType.TENNIS]: '网球',
  [ESportType.VOLLEYBALL]: '排球',
  [ESportType.E_SPORTS]: '电子竞技',
  [ESportType.SNOOKER]: '斯诺克',
  [ESportType.SPECIAL_PROJECTS]: '特别项目',
  [ESportType.DARTS]: '飞镖',
  [ESportType.RUGBY]: '橄榄球',
  [ESportType.BOXING_MMA]: '拳击/格斗',
  [ESportType.HANDBALL]: '手球',
  [ESportType.ICE_HOCKEY]: '冰球',
  [ESportType.CRICKET]: '板球',
  [ESportType.FINANCIAL_BETTING]: '金融投注',
  [ESportType.LOTTERY]: '彩票',
  [ESportType.AMERICAN_FOOTBALL]: '美式足球',
  [ESportType.GOLF]: '高尔夫球',
  [ESportType.BASEBALL]: '棒球',
  [ESportType.BADMINTON]: '羽毛球',
  [ESportType.BEAUTY_CONTEST]: '选美大赛',
  [ESportType.RACING]: '赛车',
  [ESportType.BEACH_SOCCER]: '沙滩足球',
  [ESportType.TABLE_TENNIS]: '乒乓球',
  [ESportType.SOFTBALL]: '垒球',
  [ESportType.INDOOR_SOCCER]: '室内足球',
  [ESportType.BEACH_VOLLEYBALL]: '沙滩排球',
  [ESportType.WINTER_SPORTS]: '冬季运动',
  [ESportType.FIELD_HOCKEY]: '曲棍球',
  [ESportType.CYCLING]: '自行车',
  [ESportType.GYMNASTICS]: '体操',
  [ESportType.TRACK_AND_FIELD]: '田径',
  [ESportType.MORE_SPORTS]: '更多运动',
  [ESportType.WATER_SPORTS]: '水上运动',
  [ESportType.DOTA]: 'DOTA 2',
  [ESportType.CSGO]: 'CS2',
  [ESportType.LOL]: '英雄联盟',
  [ESportType.KING]: '王者荣耀',
};

// 赔率类型 欧洲盘 亚洲盘
export enum EOddType {
  EUROPE = 1,
  ASIA = 2,
  ML = 3,
}

export const EOddTypeMap = {
  'HK': EOddType.ASIA,
  'ML': EOddType.ML,
  'OU': EOddType.EUROPE,
};

// 订单结算状态 1:全部状态, 0:未结算, 1:已结算, 2:结算异常
export enum EOrderTypeStatus {
  ALL = -1,
  UNSETTLED = 0,
  SETTLED = 1,
  ABNORMAL = 2,
  RESERVER = 3,
}

// 订单状态, -1:全部状态, 0:待处理, 1:已结算, 2:取消(人工), 3:待确认, 4:风控拒单, 5:撤单(赛事取消)
export enum EOrderStatus {
  ALL = -1,
  PENDING = 0,
  SETTLED = 1,
  CANCELLED = 2,
  CONFIRMING = 3,
  REJECTED = 4,
  WITHDRAWN = 5,
  AUTO_CANCLLED = 21,
  MANUAL_CANCLLED = 22
}
// 注单结果, 0:无结果, 2:走水, 3:输, 4:赢, 5:赢一半, 6:输一半, 7:赛事取消, 8:赛事延期, 11:比赛延迟, 12:比赛中断, 13:未知, 15:比赛放弃, 16:异常盘口, 17:未知赛事状态, 18:比赛取消, 19:比赛延期
export enum EBetResultType {
  NO_RESULT = 0,
  FLAT = 2,
  LOSE = 3,
  WIN = 4,
  WIN_HALF = 5,
  LOSE_HALF = 6,
  MACHT_CANCLE = 7,
  MACHT_DELAY = 8,
  GAME_DELAY = 11,
  GAME_INTERRUPTED = 12,
  UNKNOWN = 13,
  GAME_ABANDONED = 15,
  ABNORMAL = 16,
  UNKNOWN_STATUS = 17,
  GAME_CANCEL = 18,
  GAME_POSTPONED = 19,
}
// 注单结果类型对应值
export const BET_RESULT_TYPE_MAP: { [key in EBetResultType]: string } = {
  [EBetResultType.NO_RESULT]: '无结果',
  [EBetResultType.FLAT]: '走水',
  [EBetResultType.LOSE]: '输',
  [EBetResultType.WIN]: '赢',
  [EBetResultType.WIN_HALF]: '赢半',
  [EBetResultType.LOSE_HALF]: '输半',
  [EBetResultType.MACHT_CANCLE]: '赛事取消',
  [EBetResultType.MACHT_DELAY]: '赛事延期',
  [EBetResultType.GAME_DELAY]: '比赛延迟',
  [EBetResultType.GAME_INTERRUPTED]: '比赛中断',
  [EBetResultType.UNKNOWN]: '未知',
  [EBetResultType.GAME_ABANDONED]: '比赛放弃',
  [EBetResultType.ABNORMAL]: '异常盘口',
  [EBetResultType.UNKNOWN_STATUS]: '未知赛事状态',
  [EBetResultType.GAME_CANCEL]: '比赛取消',
  [EBetResultType.GAME_POSTPONED]: '比赛延期',
};

// 盘口类型, OU:欧盘,1; HK:香港盘,2; ML:马来盘,3; ID:印尼盘,4; US:美式盘,5; GB:英式盘,6;
export enum EHandicapType {
  OU = 1,
  HK = 2,
  ML = 3,
  ID = 4,
  US = 5,
  GB = 6
}

// 盘口类型对应值
export const HANDICAP_TYPE_MAP: { [key in EHandicapType]: string } = {
  [EHandicapType.OU]: '欧盘',
  [EHandicapType.HK]: '亚盘',
  [EHandicapType.ML]: '马来盘',
  [EHandicapType.ID]: '印尼盘',
  [EHandicapType.US]: '美式盘',
  [EHandicapType.GB]: '英式盘',
};

export enum EStaticsScoreType {
  q1 = 'Period1',
  q2 = 'Period2',
  q3 = 'Period3',
  q4 = 'Period4',
  q5 = 'Period5',
};

export enum EStaticsType {
  /** 控球率 */
  BallPossession = '1',
  /** 角球 */
  cornerKicks = '2',
  /** 助攻 */
  assist = '3',
  /** 传球 */
  pass = '4',
  /** 犯规 */
  Fouls = '5',
  /** 任意球 */
  freeKicks = '6',
  /** 球门球 */
  goalkeeperKicks = '7',
  /** 扑救 */
  goalkeeperSaves = '8',
  /** 射门 */
  goalKicks = '9',
  /** 越位 */
  offsides = '10',
  /** 射偏 */
  shotsOffGoal = '11',
  /** 射正 */
  shotsOnGoal = '12',
  /** 界外球 */
  throwIns = '13',
  /** 黄牌 */
  yellow = '14',
  /** 红牌 */
  red = '15',
  /** 黄红牌 */
  yellowRed = '16',
  /** 进攻 */
  attak = '17',
  /** 危险进攻 */
  dangerAttack = '18',
  /** 伤停 */
  injuriesperiod = '19',
  /** 安全球率 */
  ballsafepercentage = '20',
  /** 投篮 */
  fieldGoalAttempted = '21',
  /** 投篮命中 */
  fieldGoalMade = '22',
  /** 三分 */
  threePointAttempted = '23',
  /** 三分命中 */
  threePointMade = '24',
  /** 罚球 */
  freeThrowAttempted = '25',
  /** 罚球命中 */
  freeThrowMade = '26',
  /** 点球未进 */
  mpenalties = '27',
  /** 断球 */
  interception = '28',
  /** 解围 */
  clearance = '29',
  /** 点球 */
  penalties = '37',
  /** 换人 */
  substitutions = '38',
  /** 暂停 */
  Timeouts = '41',
  /** 两分 */
  twoPointAttempted = '43',
  /** 两分命中 */
  twoPointMade = '44',
  /** 双发失误 */
  doubleFault = '51',
  /** 发球得分 */
  serveScore = '52',
  /** 破发成功率 */
  BreakSuccessRate = '54',
}

// 统计数据 typeId 对应的类型
export const EStaticsTypeName = {
  [EStaticsType.BallPossession]: '控球率',
  [EStaticsType.attak]: '进攻',
  [EStaticsType.dangerAttack]: '危险进攻',
  [EStaticsType.shotsOnGoal]: '射正球门',
  [EStaticsType.shotsOffGoal]: '射偏球门',
  [EStaticsType.twoPointAttempted]: '两分',
  [EStaticsType.twoPointMade]: '两分命中',
  [EStaticsType.Timeouts]: '暂停',
  [EStaticsType.penalties]: '点球',
  [EStaticsType.threePointAttempted]: '三分',
  [EStaticsType.threePointMade]: '三分命中',
  [EStaticsType.serveScore]: '发球得分',
  [EStaticsType.doubleFault]: '双发失误',
  [EStaticsType.BreakSuccessRate]: '破发成功率',
  [EStaticsType.Fouls]: '犯规',
  [EStaticsType.clearance]: '解围',
  [EStaticsType.interception]: '断球',
};

