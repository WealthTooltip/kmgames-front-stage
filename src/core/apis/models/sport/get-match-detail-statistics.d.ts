/*
 * @Author: Passion.KMG
 * @Date: 2024-01-11 11:12:40
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/apis/models/sport/get-match-detail-statistics.ts
 * @Description:
 */
/* eslint-disable */
import {EStaticsType} from '@constants/enum/sport';

export interface IMatchDetailApi {
  away_team_en_name: string;
  away_team_half_time_score: string;
  away_team_id: string;
  away_team_name: string;
  away_team_normal_time_score: string;
  away_team_score: string;
  current_period_start_time: string;
  distance: string;
  events: any[];
  group_id: string;
  has_event: string;
  has_eventphase: string;
  has_injury: string;
  has_lineup: string;
  has_liveodds: string;
  has_news: string;
  has_phase: string;
  has_player_statistics: string;
  has_preodds: string;
  has_statistics: string;
  home_team_en_name: string;
  home_team_half_time_score: string;
  home_team_id: string;
  home_team_name: string;
  home_team_normal_time_score: string;
  home_team_score: string;
  id: string;
  is_pending: string;
  is_visible: string;
  lineup: any[];
  lmt_mode: string;
  match_time: string;
  neutral: string;
  player_statics: any[];
  referee_cn_name: string;
  referee_en_name: string;
  referee_id: string;
  referees: Referee[];
  round: string;
  round_id: string;
  round_type: string;
  round_type_id: string;
  scores: Score[];
  season: string;
  season_id: string;
  sidelined: any[];
  sport_id: string;
  stadium_cn_name: string;
  stadium_en_name: string;
  stadium_id: string;
  start_time: string;
  statics: Static[];
  statics_ex: any[];
  status: string;
  status_code: string;
  status_name: string;
  time_length: string;
  time_ot_length: string;
  time_played: string;
  time_remaining: string;
  time_running: string;
  time_update: string;
  tournament_id: string;
  update_timestamp: string;
  weather: string;
  weather_desc: string;
  winner: string;
}

interface Referee {
  country_id: string;
  country_name: string;
  referee_id: string;
  referee_name: string;
  type: string;
}

interface Score {
  match_id: string;
  team1: string;
  team2: string;
  type: string;
  update_time: string;
}

interface Static {
  period: string;
  team1: string;
  team2: string;
  type_cn_name: string;
  type_en_name: string;
  type_id: EStaticsType;
}


export type MatchDetailStatistics = {
  awayTeamHalfTimeScore: string;
  hometTeamHalfTimeScore: string;
  neutral: string;
  scores?: {
    matchId: string;
    team1: string;
    team2: string;
    type: string,
    updateTime: string;
  }[],
  statics?: {
    period: string;
    team1: string;
    team2: string;
    typeCnName: string;
    typeEnName: string;
    typeId?: EStaticsType;
  }[];
}
