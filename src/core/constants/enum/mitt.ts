/*
 * @Author: Passion.KMG
 * @Date: 2024-01-02 13:23:06
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/constants/enum/mitt.ts
 * @Description:
 */
import {TVideo} from '@core/hooks/sports/useMathMedia';
import {TLeague} from '@core/reducers/_reduxStore.d';
import {TMatch} from '@core/services/Table.d';
import {EMatchTypes} from './sport';

export type TMitt = {
  // 同步多媒体选中状态(视频、动画、分数)，从详情到列表，从列表到详情
  syncMediaSelected: {
    matchId: number;
    selected: 'video' | 'animation' | 'score'
  },
  // 全屏页面，获取播控数据和选中状态
  initMediaData: {
    matchId: number;
  },
  // 同步播控数据
  syncMediaData: {
    matchId: number;
    mediaData: {
      videos: TVideo[];
      animation: string;
    };
    selected: 'video' | 'animation' | 'score';
  },
  // 同步比赛轮询联赛IDS
  syncMatchPollingLeagueIds: {
    display: boolean;
    leagueIds: number[];
    state: EMatchTypes;
  },
  // 同步收藏赛事的联赛信息给侧边栏
  syncFavoriteLeagueInfo: {
    leagues: TLeague[];
    matches: TMatch[];
  },
  // 同步选中的收藏联赛id
  syncFavoriteLeagueId: {
    leagueId: number;
  },
  // 同步是否显示收藏联赛
  toggleFavorite: {
    display: boolean;
  },
   // 同步是否显示隐藏注单弹框
   toggleBetOrder: {
    display: boolean;
  },
   // 同步是否勾选接受自动赔率
   switchAutoOdd: {
    display: boolean;
  },
  // 主动索要数据
  requestData: {
    type: 'request' | 'response';
  },
  // 同步H5玩法滑动到指定位置
  syncMethodsTab: {
    index: number;
    sportId: number;
  },
  // 展示下单弹框
  visibleBetOrder: {
    display: boolean;
  },
}

// 所有的事件 TMitt 的 key，形成
export type TMittEvent = keyof TMitt;
