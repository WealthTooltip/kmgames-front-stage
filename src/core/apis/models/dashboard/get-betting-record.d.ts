import {EOrderStatus} from '@constants/enum/sport/orderTypes';
import {EBetResultType, EHandicapType, ESportType} from '@constants/enum/sport';

export type Detail = {
  orderId: number;
  marketType: EHandicapType;
  oddFinally: number;
  sportId: ESportType;
  sportNameCn: string;
  sportNameEn: string;
  matchId: number;
  matchName: string;
  scoreBenchmark?: string; // 根据实际情况可能需要调整
  settleScore:string;
  leagueId: number;
  leagueNameEn?: string; // 根据实际情况可能需要调整
  leagueNameCn?: string; // 根据实际情况可能需要调整
  betItemId: number;
  betItemName: string;
  createTime: string;
  homeTeamNameEn: string;
  awayTeamNameEn: string;
  homeTeamNameCn: string;
  awayTeamNameCn: string;
  betResult: EBetResultType;
  kindsCode?:string;
  betHomeOrAway?:string;
  betHandicap?:string;
  isInplay:number;
  beginTime:string
  settleTime:string
  betItemCTID: number;
  oddValue:number;
};

export type TBettingOrder = {
  id: number;
  pid: number;
  userName: string;
  isCrossCompetition: number;
  settleAmount: null | number; // 根据实际情况可能需要调整
  profitAmount: null | number; // 根据实际情况可能需要调整
  status: EOrderStatus;
  billStatus: number;
  betCount: number;
  seriesType: number;
  seriesValue: string;
  settleTimes: number;
  isSettlementAgain: number;
  productAmountTotal: number;
  orderAmount: number;
  preBetAmount: null | number; // 根据实际情况可能需要调整
  deviceType: number;
  deviceIMEI?: string; // 根据实际情况可能需要调整
  remark?: string; // 根据实际情况可能需要调整
  isDelete: number;
  createTime: string;
  createUser: string;
  updateTime?: string; // 根据实际情况可能需要调整
  updateUser?: string; // 根据实际情况可能需要调整
  confirmTime: string;
  currency: string;
  exchangeRate: null | number; // 根据实际情况可能需要调整
  maxWinAmount: number;
  oddAcceptionType: number;
  settleTime?: string; // 根据实际情况可能需要调整
  isPreBet: number;
  betAllResult: string;
  marketType: EHandicapType;
  oddValue: number;
  oddFinally: number;
  details: Detail[];
  isReserve:number,
};

export type Series = {
  multiple: number,
  minBetAmount: number,
  maxBetAmount: number,
  firstText: number,
  secondText: number,
  money: string,
  odds: Array<number>,
  oddsTotal: string,
  id: string,
  type: string
};
