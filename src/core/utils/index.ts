import {Detail} from '@core/apis/models/dashboard/get-betting-record';
import {EHandicapType, EOddType, ESportType, HANDICAP_TYPE_MAP} from '@core/constants/enum/sport';
import {TMatch, TOrder} from '@core/services/Table';
export enum TCtidTypes {
  goalScore = 0,
  cornerScore = 1,
  punishScore = 2,
  homeGoalScore = 12,
  awayGoalScore = 13,
  minutes15Score = 16,
  minutes15To30Score = 17
}
// 通过玩法 code 获取玩法名称
export const getPlayNameByKc = ({code, name, ctid, sportId}: {code: string, name?: string, ctid?: number, sportId?: number}) => {
  if (ctid !== undefined && name !== undefined && ctid !== 0) return name;
  switch (code) {
    case 'FT_OU':
      switch (sportId) {
        case 5:
          return '总局数';
        default:
          return '全场大小';
      };
    case 'HT_OU':
      return '半场大小';
    case 'FT_OE':
      return '全场单双';
    case 'HT_OE':
      return '单双-上半场';
    case 'FT_AH':
      switch (sportId) {
        case 6:
          return '全场让盘';
        case 23:
          return '全场让分';
        case 5:
        case 19:
          return '全场让局';
        default:
          return '全场让球';
      };
    case 'HT_AH':
      return '半场让球';
    case 'FT_1X2':
    case 'FT_ML':
      return '全场独赢';
    case 'HT_1X2':
    case 'HT_ML':
      return '半场独赢';
    case 'FT_CS':
      return '全场波胆';
    case 'HT_CS':
      return '波胆-上半场';
    case 'BothTeamsToScore':
      return '双方进球';
    case 'FTS_AH':
      return '全场让局';
    case 'FTS_OU':
      return '总局数';
    case 'FT_XX':
      return '全场总分';
    case 'Winner_1X2':
      return '独赢1X2';
    case 'Winner':
      return '全场独赢';
    case 'PT_AH':
      return '让分';
    case 'PT_OU':
      switch (sportId) {
        case 19:
          return '全场总分';
        default:
          return '总分大小';
      }
    default:
      return name;
  }
};
// getBetPalyName(data.details[0].kindsCode)
// 通过玩法 code 获取主客队名称
export const getBetPalyName = (code: string) => {
  switch (code) {
    case 'FT_AH':
    case 'HT_AH':
    case 'HT_OU':
    case 'FT_OU':
      return 'betHomeOrAway';
    case 'HT_1X2':
    case 'FT_1X2':
    case 'HT_CS':
    case 'FT_CS':
    case 'HT_OE':
    case 'FT_OE':
      return 'betHandicap';
    default:
      return 'betHomeOrAway';
  }
};

// 通过 体育类型 id 获取 玩法列表 （显示在赛事列表）
export const getPlayListBySid = (sid: number) => {
  switch (sid) {
    case 1:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
    case 2:
      return ['FT_ML', 'FT_AH', 'FT_OU', 'HT_ML', 'HT_AH', 'HT_OU'];
    case 3:
      return ['FT_ML', 'FTS_AH', 'FTS_OU'];
    case 5:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    // 排球数据 总分code暂不清楚等有数据后对接
    case 6:
      return ['FT_ML', 'FT_AH', 'FT_XX'];
    case 8:
      return ['Winner'];
    case 10:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 11:
      return ['FT_AH', 'FT_OU', 'FT_OE'];
    case 12:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'FT_OE'];
    case 13:
      return ['Winner_1X2', 'FT_ML'];
    case 16:
      return ['FT_ML', 'FT_AH', 'FT_OU', 'HT_ML', 'HT_AH', 'HT_OU'];
    case 19:
      return ['FT_ML', 'FT_AH', 'PT_AH', 'PT_OU'];
    case 23:
      return ['FT_ML', 'FT_AH', 'PT_OU'];
    case 276:
    case 277:
    case 278:
    case 279:
      return ['win_final'];
    default:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
  }
};

export const getMobilePlayListBySid = (sid: number) => {
  switch (sid) {
    case 1:
      return ['FT_1X2', 'FT_AH', 'FT_OU', 'HT_1X2', 'HT_AH', 'HT_OU'];
    case 2:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 3:
      return ['FT_ML', 'FTS_AH', 'FTS_OU'];
    case 5:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 6:
      return ['FT_ML', 'FT_AH', 'FT_XX'];
    case 8:
      return ['Winner', 'FT_AH', 'FT_OU'];
    case 10:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 11:
      return ['FT_AH', 'FT_OU', 'FT_OE'];
    case 12:
      return ['FT_1X2', 'FT_AH', 'FT_OU'];
    case 13:
      return ['Winner_1X2', 'FT_ML', 'FT_AH'];
    case 16:
      return ['FT_ML', 'FT_AH', 'FT_OU'];
    case 19:
      return ['FT_ML', 'PT_AH', 'PT_OU'];
    case 23:
      return ['FT_ML', 'FT_AH', 'PT_OU'];
    case 276:
    case 277:
    case 278:
    case 279:
      return ['win_final'];
    default:
      return ['FT_1X2', 'FT_AH', 'FT_OU'];
  }
};

// 通过 体育类型 id 获取 玩法列表 （显示在赛事列表）新手版本
export const getNewbiePlayListBySid = (sid: number, round: string) => {
  switch (sid) {
    case 1:
      return ['FT_1X2'];
    case 2:
    case 3:
    case 5:
    case 6:
    case 10:
    case 13:
    case 16:
    case 19:
    case 23:
      return ['FT_ML'];
    case 8:
      return ['Winner'];
    case 276:
    case 277:
    case 278:
    case 279:
      if (round === 'bo2') {
        return ['wdl_final'];
      }
      return ['win_final'];
    default:
      return ['FT_1X2'];
  }
};

// 转换 投注项名称
export const getNameByhoa = (name: string) => {
  switch (name?.toUpperCase()) {
    case 'HOME':
      return '主';
    case 'AWAY':
      return '客';
    case 'DRAW':
      return '平局';
    case 'ODD':
      return '单';
    case 'EVEN':
      return '双';
    case 'OVER':
      return '大';
    case 'UNDER':
      return '小';
    default:
      return name;
  }
};

export const transforMarkets = (match: TMatch, betTypeList: string[]) => {
  if (match.sportId > 33) return transforEsportsMarkets(match, betTypeList);
  const obj = match.playTypes.reduce((o: any, b) => {
    if (b.ctid === 0 && !o[b.code]) {
      o[b.code] = b;
    };
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

export const transforEsportsMarkets = (match: TMatch, betTypeList: string[]) => {
  const obj = match.playTypes.reduce((o: any, b) => {
    if (!o[`${b.code.split('_')[0]}_${b.playGroupIds[0]}`]) o[`${b.code.split('_')[0]}_${b.playGroupIds[0]}`] = b;
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

export const mobileTransforMarkets = (sportId: number, playTypes: TMatch['playTypes'], betTypeList: string[]) => {
  if (sportId > 33) return mobileTransforEsportsMarkets(playTypes, betTypeList);
  const obj = playTypes.reduce((o: any, b) => {
    if (b.ctid === 0) {
      o[b.code] = b;
    };
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

export const mobileTransforEsportsMarkets = (playTypes: TMatch['playTypes'], betTypeList: string[]) => {
  const obj = playTypes.reduce((o: any, b) => {
    o[`${b.code.split('_')[0]}_${b.playGroupIds[0]}`] = b;
    return o;
  }, {});
  return betTypeList.map((betType) => obj[betType]);
};

// 投注项通过权重排序
export const getWeightsByBetName = (name: string) => {
  if (name === 'Home') return 0;
  if (name === 'Away') return 1;
  return 2;
};

// 波胆数据格式转换
export const transferBoDan = (list: TOrder[]) => {
  const listData: TOrder[] = [];
  const list1: TOrder[] = [];
  const list2: TOrder[] = [];
  const list3: TOrder[] = [];
  let other: TOrder = null;
  list.forEach((item) => {
    const temp = {...item};
    if (temp.name === 'AOS') {
      temp.name = '其他';
      other = temp;
    } else {
      const h = temp.name.match(/H(\S*)A/)[1];
      const a = temp.name.split('A')[1];
      temp.name = `${h}-${a}`;
      if (/[0-9]/.test(h) && /[0-9]/.test(a)) {
        if (h > a) list1.push(temp);
        if (h === a) list2.push(temp);
        if (h < a) list3.push(temp);
      }
    }
  });
  list1.sort(BoDanSort);
  list2.sort(BoDanSort);
  list3.sort(BoDanSort);
  if (other) {
    list2.push(other);
  }
  const len = Math.max(list1.length, list2.length, list3.length);
  for (let i = 0; i < len; i++) {
    listData[0 + (i * 3)] = list1[i] || null;
    listData[1 + (i * 3)] = list2[i] || null;
    listData[2 + (i * 3)] = list3[i] || null;
  }
  return listData;
};

const BoDanSort = (a: TOrder, b: TOrder) => {
  const [aFirst, aSecond] = a.name.split('-');
  const [bFirst, bSecond] = b.name.split('-');
  if (aFirst !== bFirst) {
    return parseInt(aFirst) - parseInt(bFirst);
  }
  return parseInt(aSecond) - parseInt(bSecond);
};

// 通过 period 获取当前赛事状态名称
export const getMatchStatusByPeriod = _.memoize((period: string) => {
  switch (period?.toUpperCase()) {
    case '1H':
      return '上半场';
    case 'HT':
      return '中场休息';
    case '2H':
      return '下半场';
    case 'FT':
      return '比赛结束';
    case 'Q1':
      return '第1节';
    case 'Q2':
      return '第2节';
    case 'Q3':
      return '第3节';
    case 'Q4':
      return '第4节';
    case 'S1':
      return '第一盘';
    case 'S2':
      return '第二盘';
    case 'S3':
      return '第三盘';
    case 'S4':
      return '第四盘';
    case 'S5':
      return '第五盘';
    case 'OT':
      return '加时赛';
    case 'I1':
      return '第1局';
    case 'I2':
      return '第2局';
    case 'I3':
      return '第3局';
    case '':
    case null:
    case undefined:
      return '未开赛';
    default:
      return '比赛中';
  }
});
export const getCurrentOddTypeText=(currentOddType: EOddType, sportId: number)=>{
  if (sportId > 33) return '';
  return `[${HANDICAP_TYPE_MAP[currentOddType]}]`;
};
export function arraysHaveSameElements<T>(array1: T[], array2: T[]): boolean {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  if (set1.size !== set2.size) {
    return false; // 数组长度不同，元素肯定不一样
  }

  for (const element of set1) {
    if (!set2.has(element)) {
      return false; // 数组元素不一样
    }
  }

  return true; // 数组包含相同的元素
}
// 获取投注球队或其他类型
export const getBetGameTypes =(info:Detail)=>{
  const t = info.betHandicap;
  if (['FT_CS', 'HT_CS'].includes(info.kindsCode)) {
    if (t ==='AOS') return '其他';
    return t.charAt(1) +'-' + t.charAt(3);
  };
  switch (info.betHandicap) {
    case 'Home':
      return info.homeTeamNameCn;
    case 'Away':
      return info.awayTeamNameCn;
    case 'Draw':
      return getNameByhoa(info.betHandicap);
    case 'Odd':
      return getNameByhoa(info.betHandicap);
    case 'Even':
      return getNameByhoa(info.betHandicap);
    case 'Over':
      return getNameByhoa(info.betHandicap);
    case 'Under':
      return getNameByhoa(info.betHandicap);
    default:
      return info.betHandicap;
  }
};
// 获取投注球队或其他玩法---------适用于已投注接口数据返回
export const getBetTeamType = (info:Detail)=>{
  const t = info.betHandicap;
  // 体育独赢
  if (['HT_1X2', 'FT_1X2', 'FT_ML', 'HT_ML', 'win_18280', 'S1_ML', 'Winner_1X2'].includes(info.kindsCode)) {
    if (t ==='Home') return info.homeTeamNameCn;
    if (t ==='Away') return info.awayTeamNameCn;
    if (t ==='Draw') return '平局';
  };
  // 体育波胆
  if (['FT_CS', 'HT_CS'].includes(info.kindsCode)) {
    if (t ==='AOS') return '其他';
    return t.charAt(1) +'-' + t.charAt(3);
  };
  // 体育单双
  if (['FT_OE', 'HT_OE'].includes(info.kindsCode)) {
    return getNameByhoa(info.betHandicap);
  };
  // 电子竞技
  if (info.sportId > 33) {
    if (['win_18280'].includes(info.kindsCode)) {
      if (t ===info.homeTeamNameCn) return info.homeTeamNameCn;
      if (t ===info.awayTeamNameCn) return info.awayTeamNameCn;
      return '';
    };
    return t;
  }
  switch (info.betHomeOrAway || info.betHandicap) {
    case 'Home':
      return info.homeTeamNameCn;
    case 'Away':
      return info.awayTeamNameCn;
    default:
      return getNameByhoa(info.betHomeOrAway);
  }
};

// 获取注单玩法具体详情-----------适用于下注时本地数据展示
type TeamType = 'home' | 'away' | undefined;
export const getOrderBetTypeAtBetting = (order:TOrder)=>{
  const {betTeam, orderName, teams} = order;
  const lname = betTeam.toLowerCase();
  if (['FT_CS', 'HT_CS'].includes(order.tag.split(/-/)[1])) {
    if (orderName ==='AOS') return '其他';
    const [home, away]= assertHomeAwayScore(orderName);
    return home +'-' + away;
  };
  if (betTeam === orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  if (betTeam === orderName && !['home', 'away'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['over', 'under'].includes(lname)) {
    return getNameByhoa(betTeam);
  }
  if (betTeam !== orderName && ['home', 'away'].includes(lname)) {
    return teams[lname as TeamType].name;
  }
  return orderName;
};

// 是否滚球, 0:不是, 1:是
export const isPlayingMatch = (n: number)=>{
  return n === 1 ?'滚球' : '早盘';
};

// 获取注单玩法中具体数值或直接返回空-适用于下注时本地数据展示
export const getBetHandiCapAtBetting = (name: string, sprotId?: number)=>{
  // 电子竞技-过滤
  if (sprotId && sprotId > 33) {
    return '';
  }
  return name;
};

// 判断第二列是否显示
export const isVisiableSecondText = (betHandicap: string)=>{
  // 只有数字才显示
  const temp = Number(betHandicap.split('/')[0]);
  if (!isNaN(temp) && isFinite(temp)) return true;
  return false;
};
export const assertHomeAwayScore = (scoreString:string) => {
  if (!scoreString) return '';
  const score = scoreString.replace('A', ' ').replace('H', '').split(' ');
  if (!score) return '';
  return score;
};
export const displayHomeAwayScore = (scoreString:string, sprotId?: ESportType) => {
  if (sprotId > 33) return '';
  if (sprotId === ESportType.TENNIS) return '';
  const [home, away] = assertHomeAwayScore(scoreString);
  return `(${home + '-' + away})`;
};

export const getTeamScoreByCtipType = (order: TOrder, ctipType: TCtidTypes, gameType?: ESportType) => {
  if (!order.isRunning) return '';
  if (order.sportId > 33) return '';
  if (gameType === ESportType.TENNIS) return '';
  switch (ctipType) {
    case TCtidTypes.goalScore:
      return `(${order.score.home}-${order.score.away})`;
    case TCtidTypes.cornerScore:
      return `(${order.score.homeCorner}-${order.score.awayCorner})`;
    default:
      break;
  }
  return ``;
};
/**
 * type: 玩法种类
 * sportId: 游戏种类Id
 * currentOddType: 当前选择是亚盘或欧盘
 * 1. 如果是电竞,则默认都是欧盘
 * 2. 如果体育项目, 个别玩法只有欧盘
 * 3. 如果当前玩法支持 欧盘及亚盘, 那就选择当前盘口类型
 */
export const chooseEuropeOrAsia = (type: EOddType, sportId:number, currentOddType: EOddType) => {
  // 大于33是电竞
  if (sportId > 33) return EOddType.EUROPE;
  if (type !== EOddType.EUROPE) {
    return currentOddType;
  };
  return EOddType.EUROPE;
};

export const chooseEuropeOrAsiaText = (type: EOddType | EHandicapType, sportId: number) => {
  // 大于33是电竞
  if (sportId > 33) return '';
  return `[${HANDICAP_TYPE_MAP[type]}]`;
};

export const isESports = () => {
  return window.location.hash.endsWith('/esports');
};
