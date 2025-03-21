import usePublicState from '../usePublicState';
import {useCallback, useEffect, useState} from 'react';
type TParams = {
  [any: string]: any
  isAdd?: boolean
}
export default (initialParams: TParams) => {
  const {dispatch, ACTIONS} = usePublicState();
  const [params, setParams] = useState(initialParams);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  // 判断是否是追加更多,还是点击翻页
  const [add, setAdd] = useState(false);
  const [key, setKey] = useState(false);
  const [cancel, setCancel] = useState(false);
  const getList = useCallback(
      (param: TParams, option?: TParams) => {
        if (option && option.isAdd) {
          setAdd(true);
        } else {
          setAdd(false);
        }
        setParams({...params, ...param});
        setKey(true);
      },
      [params],
  );
  const cancelOrder = useCallback((orderId: string) => {
    // 取消订单
    dispatch(ACTIONS.SPORT.cancelOrder({
      data: [orderId],
      cb: () => {
        dispatch(ACTIONS.BASE.openToast({text: '预约取消', types: 'success'}));
        setCancel(true);
      },
    }));
  }, [params]);
  const showConfirm = (orderId: string) => {
    dispatch(
        ACTIONS.BASE.openConfirm({
          title: '温馨提示',
          content: '确定取消本场比赛预约',
          actions: [
            {
              text: '确定',
              cb: () => cancelOrder(orderId),
            },
          ],
        }),
    );
  };
  useEffect(() => {
    if (!cancel) {
      return;
    }
    dispatch(ACTIONS.BASE.closeModal());
    setLoading(true);
    dispatch(ACTIONS.DASHBOARD.getSportBetHistory({
      data: {
        ...params,
        billStatus: undefined,
        isReserve: '1',
      },
      cb: (res: any) => {
        setLoading(false);
        if (!res) {
          return;
        }
        const {data} = res;
        const {count, pageData, pageNum, pageSize} = data.pager;
        setHasMore(pageSize * pageNum < count);
        setTotal(count);
        setList(pageData);
        setCancel(false);
      },
    }));
  }, [cancel]);
  useEffect(() => {
    if (!key) {
      return;
    }
    setLoading(true);
    dispatch(ACTIONS.DASHBOARD.getSportBetRecord({
      data: params,
      cb: (res: any) => {
        setLoading(false);
        if (!res) {
          return;
        }
        const {data} = res;
        const {count, pageData, pageNum, pageSize} = data;
        setHasMore(pageSize * pageNum < count);
        setTotal(count);
        setList(!add ? pageData : [...list, ...pageData]);
      },
    }));
  }, [params, add, key]);
  return {getList, list, loading, hasMore, total, params, showConfirm};
};
