/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:23:06
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/sports/useLeagueAndMatchData.ts
 * @Description: 对比赛的列表的一些操作
 */
import {TMatchDetail} from '@core/apis/models/sport/get-match-list.d';
import {mapMatchList} from '@core/services/dataPurification';
import {TMatch} from '@core/services/Table.d';
import db from '@core/services/db';
import usePublicState from '../usePublicState';
import storage from '@core/helpers/storage';
import {TLeagueStatistic} from '@core/reducers/_reduxStore';
import {EMatchTypes} from '@core/constants/enum/sport';
import getDpStore from '../useDpStore';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  /**
   * @description: 保存赛事列表到数据库
   * @param matchList 赛事列表
   */
  const saveMatchListToDB = React.useCallback((matchList: Array<TMatchDetail>, isSetDisplayState = true) => {
    if (matchList.length === 0) {
      if (isSetDisplayState) {
        dispatch(ACTIONS.SPORT.updateDisplayType('empty'));
        dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId: null}));
      }
      return;
    }
    const cleanData = mapMatchList(matchList, 'match-list');
    // 如果没有比赛或者当前的详情比赛在列表中没有则取第一场比赛
    if (isSetDisplayState) {
      const matchId = cleanData.matches[0]?.matchId;
      dispatch(ACTIONS.SPORT.updateCurrentMatch({matchId}));
    }
    db.transaction('rw', db.matches, async () => {
      let mergedMatches = cleanData.matches;
      const matchExt = storage.get('MATCH_EXT_INFO');
      if (matchExt) {
        mergedMatches = mergeMatchInfos(cleanData.matches, matchExt);
      }
      const cacheList = mergedMatches.slice(0, 10);
      storage.setAny(`${mergedMatches[0].sportId}_match_list`, cacheList);
      const map = _.groupBy(cacheList, 'leagueId');
      const cacheLeagueList: TLeagueStatistic[] = [];
      for (const key in map) {
        if (map.hasOwnProperty(key)) {
          const inPlayList = map[key].filter((mk) => mk.isLive);
          const upComingList = map[key].filter((mk) => !mk.isLive);
          const obj: TLeagueStatistic = {
            sportId: map[key][0].sportId,
            leagueName: map[key][0].leagueName,
            leagueIcon: map[key][0].leagueLogo,
            leagueId: Number(key),
            count: map[key].length,
            countGroup: {
              [EMatchTypes.IN_PLAY]: inPlayList.length,
              [EMatchTypes.UPCOMING]: map[key].length - inPlayList.length,
            },
            matchIds: {
              [EMatchTypes.IN_PLAY]: inPlayList.map((a) => a.matchId),
              [EMatchTypes.UPCOMING]: upComingList.map((b) => b.matchId),
            },
            allMatchIds: map[key].map((a) => a.matchId),
            eids: map[key].map((a) => a.mid1),
          };
          if (inPlayList.length) {
            obj.state = EMatchTypes.IN_PLAY;
            cacheLeagueList.push({...obj});
          }
          if (upComingList.length) {
            obj.state = EMatchTypes.UPCOMING;
            cacheLeagueList.push({...obj});
          }
        }
      };
      storage.setAny(`${mergedMatches[0].sportId}_league_list`, cacheLeagueList);
      // 当前使用追加模式，不删除旧数据
      await db.matches.bulkPut(mergedMatches);
      // // 找出所有比赛对应的联赛id
      // const leagueIds = _.uniq(mergedMatches.map((match) => match.leagueId));
      // // 找出数据库中所有联赛对应的比赛
      // const leagueMatches = await db.matches.where('leagueId').anyOf(leagueIds).toArray();
      // // 删除数据中存在，但是最新的数据中不存在的比赛
      // const deleteMatchIds = _.differenceBy(leagueMatches, mergedMatches, 'matchId').map((match) => match.matchId);
      // await db.matches.bulkDelete(deleteMatchIds);
    }).then(() => {
      dispatch(ACTIONS.SPORT.updateMatchListUpdateTime());
      const {sid, sportId} = getDpStore().getState().sport.userSettings;
      if (matchList[0]?.md.sid === sportId || matchList[0]?.md.sid === sid || process.env.CLIENT_MODE === 'mobile') {
        dispatch(ACTIONS.SPORT.updateDisplayType('list'));
      }
    }).catch((err) => {
      _console.error('Failed to update:', err);
    });
  }, []);

  return {
    saveMatchListToDB,
  };
};


// 合并赛事额外信息
export const mergeMatchInfos = (matches: Array<TMatch>, extMatchInfos: any) => {
  const leagues = storage.get('LEAGUE_EXT_INFO') || {};
  const mergedMatches = matches.map((matchItem) => {
    const match = extMatchInfos[matchItem.mid1];
    if (match) leagues[matchItem.leagueId] = match.leagueLogoUrl;
    return match ? {
      ...matchItem,
      leagueLogo: match.leagueLogoUrl,
      teams: {
        home: {
          ...matchItem.teams.home,
          icon: match.homeTeamLogoUrl,
        },
        away: {
          ...matchItem.teams.away,
          icon: match.guestTeamLogoUrl,
        },
      },
      animation: [match.animation_url],
      live: [match.live?.flv_url],
      videoId: match.video_id,
      hasVideo: match.video_status,
      hasAnimate: match.animation_status,
    } : matchItem;
  });
  storage.set('LEAGUE_EXT_INFO', leagues);
  return mergedMatches;
};
