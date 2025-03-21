/*
 * @Author: Galen.GE
 * @Date: 2023-07-21 11:13:36
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/hooks/dashboard/common.ts
 * @Description:
*/
export interface IQuery{
  conditions: any; // 条件
  search: Function; // 查询函数
}
const baseParams = {
  data: [] as any[],
  pageNum: 1,
  pageSize: 10,
  totalPage: 0,
  count: 0,
  lastPage: false,
  loading: false,
};
export default <T>({search, conditions}: IQuery) => {
  // 初始化查询条件
  const [querys, setQuerys] = React.useState({pageNum: 1, pageSize: 10, ...conditions});
  const [pageinationData, setPageinationData] = React.useState({...baseParams});
  // 手动激活查询方法
  const doQuery = (init: boolean, fields?: any) => {
    setQuerys({
      ...querys, pageNum: pageinationData.pageNum, pageSize: pageinationData.pageSize, ...fields,
    });
    search(init, {
      ...querys, pageNum: pageinationData.pageNum, pageSize: pageinationData.pageSize, ...fields,
    });
  };
  return {
    setQuerys: (field: any) => setQuerys({...querys, ...field}),
    setPageinationData,
    pageinationData,
    doQuery,
    querys,
  };
};
