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
  const [totalSize, setTotalSize] = useState(0);
  const [totalInfo, setTotalInfo] = useState({
    totalOrderAmount: 0,
    totalProfitAmount: 0,
  });
  // 判断是否是追加更多,还是点击翻页
  const [add, setAdd] = useState(false);
  const [key, setKey] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [h5Reload, setH5Reload] = useState(false);
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
  const cancelOrder = useCallback((orderId: string, isH5: boolean = false) => {
    // 取消订单
    dispatch(ACTIONS.SPORT.cancelOrder({
      data: [orderId],
      cb: () => {
        dispatch(ACTIONS.BASE.openToast({text: '预约取消', types: 'success'}));
        isH5 ? setH5Reload(true) : setCancel(true);
      },
    }));
  }, [params]);
  const showConfirm = (orderId: string, isH5: boolean = false) => {
    dispatch(
        ACTIONS.BASE.openConfirm({
          title: '温馨提示',
          content: '确定取消本场比赛预约',
          actions: [
            {
              text: '确定',
              cb: () => cancelOrder(orderId, isH5),
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
        isReserve: '1',
        status: '0',
      },
      cb: (res: any) => {
        setLoading(false);
        if (!res) {
          return;
        }
        const {data} = res;
        const {count, pageData, pageNum, pageSize} = data.pager;
        setHasMore(pageSize * pageNum < count);
        setTotalSize(count);
        setTotalInfo({totalOrderAmount: data.totalOrderAmount, totalProfitAmount: data.totalProfitAmount});
        setList(pageData);
        setCancel(false);
      },
    }));
  }, [cancel]);
  useEffect(() => {
    if (!h5Reload) {
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
        const {pageData} = data.pager;
        setList(pageData);
        setH5Reload(false);
      },
    }));
  }, [h5Reload]);
  useEffect(() => {
    if (!key) {
      return;
    }
    setLoading(true);
    dispatch(ACTIONS.DASHBOARD.getSportBetHistory({
      data: params,
      cb: (res: any) => {
        setLoading(false);
        if (!res || _.isEmpty(res.data)) {
          return;
        }
        const {data} = res;
        const {count, pageData, pageNum, pageSize} = data.pager;
        setHasMore(pageSize * pageNum < count);
        setTotalSize(count);
        setTotalInfo({totalOrderAmount: data.totalOrderAmount, totalProfitAmount: data.totalProfitAmount});
        setList(!add ? pageData : [...list, ...pageData]);
      },
    }));
  }, [params, add, key]);
  return {getList, cancelOrder, showConfirm, list, loading, hasMore, totalSize, params, totalInfo};
};
