/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:41:38
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useRenderData.ts
 * @Description: 页面所需要的动态数据
 */
import {useSelector} from 'react-redux';
import IStore, {TGameResultStatistic, TLeagueStatistic} from '@core/reducers/_reduxStore.d';
import {TMatch} from '@core/services/Table';
import db from '@core/services/db';
import storage from '@core/helpers/storage';
import {useEffect, useState} from 'react';

// 使用 matchId 获取比赛数据
export const useMatchDataByMatchId = (matchId: number) => {
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const [match, setMatch] = useState<TMatch>(null);

  useEffect(() => {
    if (!matchId) {
      return;
    }
    db.matches.where('matchId').equals(matchId).toArray()
        .then((matches) => {
          setMatch(_.first(matches));
        })
        .catch((error) => {
          console.warn('Failed to find matches:', error);
        });
  }, [matchListUpdateTime]);

  return {
    match,
  };
};

// 使用 leagueId 获取所属所有比赛列表数据
export const useMatchListDataByLeagueId = (leagueId: number): {
  matchList: Array<TMatch>
} => {
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const [matchList, setMatchList] = useState<Array<TMatch>>([]);

  useEffect(() => {
    if (!leagueId) {
      return;
    }
    db.matches.where('leagueId').equals(leagueId).toArray()
        .then((matches) => {
          setMatchList(_.orderBy(matches, 'sortNo'));
        })
        .catch((error) => {
          console.warn('Failed to find matches:', error);
        });
  }, [matchListUpdateTime]);

  return {
    matchList,
  };
};

// 获取所有视频
export const useMatchListData = (): {
  matchList: Array<TMatch>
} => {
  const {matchListUpdateTime} = useSelector((state: IStore) => state.sport.display);
  const [matchList, setMatchList] = useState<Array<TMatch>>([]);

  useEffect(() => {
    db.matches.toArray()
        .then((matches) => {
          setMatchList(_.orderBy(matches, 'sortNo'));
        })
        .catch((error) => {
          console.warn('Failed to find matches:', error);
        });
  }, [matchListUpdateTime]);

  return {
    matchList,
  };
};

// 获取所有当前联赛列表
export const useLeagueListData = (): {
  leagues: Array<TLeagueStatistic>
} => {
  const [leagues, setLeagues] = useState<Array<TLeagueStatistic>>();
  const leagueStatistics = useSelector((state: IStore) => state.sport.display.leagueStatistics);
  const getLeagueIcon = (eids: number[]) => {
    const matchExtInfo = storage.get('MATCH_EXT_INFO') || [];
    const eid = eids.find((eid) => !!matchExtInfo[eid]);
    return eid ? matchExtInfo[eid].leagueLogoUrl : '';
  };

  useEffect(() => {
    if (!leagueStatistics.length) {
      setLeagues([]);
      return;
    }
    setLeagues(leagueStatistics.map((item) => {
      return {
        ...item,
        leagueIcon: (storage.get('LEAGUE_EXT_INFO') || {})[item.leagueId] || getLeagueIcon(item.eids),
      };
    }));
  }, [leagueStatistics]);

  return {
    leagues,
  };
};

// 获取赛果列表
export interface passData {
  gamesResult: Array<TGameResultStatistic>,
  loading: boolean,
  noData: boolean,
}
export const useGameResultListData = (): passData => {
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [gamesResult, setGameResult] = useState<Array<TGameResultStatistic>>([]);
  const {gameResultStatistics} = useSelector((state: IStore) => state.sport.display);

  useEffect(() => {
    if (!gameResultStatistics.length) {
      setGameResult([]);
      setNoData(true);
      setLoading(false);
    } else {
      setNoData(false);
      setLoading(false);
      setGameResult(gameResultStatistics.map((item) => ({...item})));
    }
  }, [gameResultStatistics]);

  return {gamesResult, loading, noData};
};
