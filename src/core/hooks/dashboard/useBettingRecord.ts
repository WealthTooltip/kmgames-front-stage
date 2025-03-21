/*
 * @Author: Passion.KMG
 * @Date: 2023-12-18 16:23:06
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/hooks/sports/useBettingRecord.ts
 * @Description: 投注记录
 */
import {EOrderTypeStatus, EOrderStatus} from '@core/constants/enum/sport';
import {TBettingOrder} from '@core/apis/models/dashboard/get-betting-record.d';
import useCommon, {IQuery} from './useCommon';
import usePublicState from '../usePublicState';

type TParams = {
  conditions: {
    billStatus?: EOrderTypeStatus;
    status?: EOrderStatus
  }
} & IQuery

export default () => {
  const {dispatch, ACTIONS} = usePublicState();
  // 查询
  const search = (init: boolean, querys?: TParams['conditions']) => {
    const {pageinationData, setPageinationData} = queryCommon;
    if (pageinationData.loading) return;
    setPageinationData({...pageinationData, loading: true});
    dispatch(ACTIONS.DASHBOARD.getSportBetRecord({
      data: querys,
      cb: (res: any) => {
        const {data} = res;
        const records = init ? data.pageData : [...pageinationData.data, ...data.pageData];
        const pageNum = querys.pageNum + 1;
        const count = data.count || 0;
        const totalPage = Math.ceil(res.data.count / pageinationData.pageSize);
        const lastPage = querys.pageNum === totalPage;
        setPageinationData({...pageinationData, data: records, count, lastPage, totalPage, loading: false, pageNum});
      },
    }));
  };
    // 初始化
  const init: TParams = {
    conditions: {},
    search,
  };
  const queryCommon = useCommon<TBettingOrder>(init);

  return {
    ...queryCommon,
  };
};
