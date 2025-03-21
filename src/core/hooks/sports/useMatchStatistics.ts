/*
 * @Author: Passion.KMG
 * @Date: 2024-01-10 20:08:36
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useMatchStatistics.ts
 * @Description:
 */
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import usePublicState from '../usePublicState';
import TStore from '@core/reducers/_reduxStore';
import {MatchDetailStatistics} from '@core/apis/models/sport/get-match-detail-statistics.d';
import G from '@constants/global';
import {EStaticsType} from '@core/constants/enum/sport';

const useMatchStatistics = () => {
  const detailStatisticsUpdateTime = useSelector((state: TStore) => state.sport.display.detailStatisticsUpdateTime);
  const [matchDetailStatistics, setMatchDetailStatistics] = React.useState<MatchDetailStatistics>(null);
  const {dispatch, ACTIONS} = usePublicState();
  React.useEffect(() => {
    if (detailStatisticsUpdateTime === 0) {
      return;
    }
    setMatchDetailStatistics(G.GET('MATCH_STATISTICS'));
  }, [detailStatisticsUpdateTime]);

  const getScoreByTypeId = useCallback((typeId: EStaticsType) => {
    if (!matchDetailStatistics || !matchDetailStatistics.statics) return [0, 0];
    const temp = matchDetailStatistics.statics.find((item) => item.typeId === typeId);
    const arr = temp ? [Number(temp.team1), Number(temp.team2)] : [0, 0];
    return matchDetailStatistics.neutral === '1' ? arr.reverse() : arr;
  }, [matchDetailStatistics]);

  const getScoreByScores = useCallback((type: string) => {
    if (!matchDetailStatistics || !matchDetailStatistics.scores) return [0, 0];
    const temp = matchDetailStatistics.scores.find((item) => item.type === type);
    const arr = temp ? [Number(temp.team1), Number(temp.team2)] : [0, 0];
    return matchDetailStatistics.neutral === '1' ? arr.reverse() : arr;
  }, [matchDetailStatistics]);

  const clearMatchDetailSta = () => {
    G.SET('MATCH_STATISTICS', null);
    dispatch(ACTIONS.SPORT.updateMatchStatisticsUpdateTime());
  };
  return {
    matchDetailStatistics,
    getScoreByTypeId,
    clearMatchDetailSta,
    getScoreByScores,
  };
};

export default useMatchStatistics;
