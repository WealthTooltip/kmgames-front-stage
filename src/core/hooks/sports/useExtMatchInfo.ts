/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:01:31
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useExtMatchInfo.ts
 * @Description: 额外的比赛信息
 */

import {undecodeData} from '@core/helpers/unit';
import usePublicState from '../usePublicState';
import storage from '@core/helpers/storage';
import {useSelector} from 'react-redux';
import TStore from '@core/reducers/_reduxStore';
import {useEffect} from 'react';

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  const sportId = useSelector((state: TStore) => state.sport.userSettings.sportId);
  useEffect(() => {
    getExtMatchInfos(sportId);
  }, [sportId]);

  // 获取额外信息
  const getExtMatchInfos = (sportId: number) => {
    dispatch(ACTIONS.SPORT.getExtMatchInfos({
      params: {
        sport_id: sportId,
      },
      cb: (encodeData: { x1: string }) => {
        try {
          const data = undecodeData(encodeData.x1);
          const matchExt = data.reduce((a: any, b: any) => {
            a[b.eid] = b;
            return a;
          }, {});
          const met = storage.get('MATCH_EXT_INFO') || {};
          storage.set('MATCH_EXT_INFO', {...met, ...matchExt});
        } catch (e) {
          console.log('## ERROR TO UNDECODE EXT MATCH DATA! ##');
        }
      },
    }));
  };

  return {
    getExtMatchInfos,
  };
};
