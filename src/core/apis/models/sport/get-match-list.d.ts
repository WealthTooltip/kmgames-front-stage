/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 16:27:49
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/apis/models/sport/get-match-list.d.ts
 * @Description: 接口get-match-list的返回数据类型
 */

import {OddBetType} from '@core/services/Table';

/**
 * Represents the data structure for a sports match including match details and play type details.
 */
export type TMatchData = Array<TMatchDetail>;

export type TMatchDetail = {
  md: TMatchDetails;
  ptds: TPlayTypeDetail[];
};

/**
 * Detailed information about a specific match.
 */
export type TMatchDetails = {
  /** Match ID, 赛事id */
  mid: number;

  /** Country ID, 国家id */
  cid: number;

  /** Sport ID, 体育类型id */
  sid: number;

  /** League ID, 联赛id */
  lid: number;

  /** 是否滚球中0否1是 */
  ip: number;

  /** 玩法数量 */
  bc: number;

  /** League Name, 联赛名称 */
  ln: string;

  /** Match Name, 比赛名称 */
  mn: string;

  /** Home Team ID, 主队teamId */
  htid: number;

  /** 是否有角球 */
  hcn: boolean;

  /** Away Team ID, 客队teamId */
  atid: number;

  /** Playing field name */
  pf: string;

  /** Indicates if the match is on a neutral ground, 是否中立场地 */
  isNe: number;

  /** Level of the event, 赛事等级 */
  lv: number;

  /** Video URL, if available, 视频地址 */
  u: string | null;

  /** JSON string representing the match status, 赛事标签 */
  s: string;

  /** Current score of the match, 当前比分 */
  cs: string;

  /** Match start time as a string, 比赛开始时间 */
  bt: string;

  /** Indicates if the match is open for sale, 是否开售 */
  ss: number;

  /** Information about the home team */
  ht: TTeamInfo;

  /** Information about the away team */
  at: TTeamInfo;

  /** pmid 获取视频 球队logo等资源 */
  pmid: number;

  /** 视频id */
  pdid: string;

  /** 188赛事ID */
  mid1: number;

  /** 赛事比分 红黄牌角球数据 */
  me: {
    hs: number;
    as: number;
    hc: number;
    ac: number;
    hy: number;
    ay: number;
    hr: number;
    ar: number;
    pd: string;
    t: string;
    hf: string;
    ps: string;
    r: string;
  }
};

/**
 * Information about a team in the match.
 */
export type TTeamInfo = {
  /** Team ID, 主队teamId 或 客队teamId */
  tid: number;

  /** Team Name, 队名 */
  tn: string;

  /** Team logo */
  lg: string;

  /** Team level, 球队等级 */
  lv: number;
};

/**
 * Details of a play type in the match.
 */
export type TPlayTypeDetail = {
  /** Bet Items Name, 玩法名称 */
  bn: string;

  /** Kinds Code, 玩法code */
  kc: string;

  /** List of handicap lines */
  hcl: THandicapLine[];
  hf: string;
  ctid: number;
};

/**
 * A specific handicap line in a play type.
 */
export type THandicapLine = {
  /** Source Bet Items Mid, 数据源玩法关联ID */
  sbim: number;

  /** List of bet item lines */
  bil: TBetItemLine[];
};

/**
 * A specific bet item line in a handicap line.
 */
export type TBetItemLine = {
  /** Bet item ID, 投注项id */
  bid: string;

  /** Indicates if the bet is for Home or Away, 主队或客队 */
  hoa: 'Home' | 'Away' | 'Over' | 'Under' | '';

  /** Handicap value, 盘口值 */
  h: string;

  /** Odds rate, 赔率 */
  od: number;

  /** Indicates if the bet is available for wagering, 是否可下注 */
  s?: number;
  /** 电竞赛果 */
  w: 0 | 1;
  /** 赔率类型 */
  ot: OddBetType;
};
