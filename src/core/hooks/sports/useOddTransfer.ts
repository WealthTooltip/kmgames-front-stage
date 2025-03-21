// 处理赔率显示相关逻辑

import {EOddType} from '@core/constants/enum/sport';
import TStore from '@core/reducers/_reduxStore';
import {addDecimals, truncateDecimals} from '@core/utils/math';
import {useSelector} from 'react-redux';
export const getViewOddFn = (od: number, type: EOddType, currentOddType: number) => {
  if (type === EOddType.ML) {
    od = Number(truncateDecimals(-(1 / od), 2));
  }
  if (type !== EOddType.EUROPE) {
    return truncateDecimals(Number(currentOddType === EOddType.EUROPE ? addDecimals(od, 1) : od), 2);
  }
  return truncateDecimals(od, 2);
};

export const useOddTransfer = () => {
  const currentOddType = useSelector((state: TStore) => state.user.currentOddType);
  // 需要修改赔率的玩法
  const getViewOdd = (od: number, type: EOddType, ct = currentOddType) => getViewOddFn(od, type, ct);
  return {
    getViewOdd,
  };
};
