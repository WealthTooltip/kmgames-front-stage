// 状态枚举
export enum EOrderStatus {
  PENDING = 0,
  SETTLED = 1,
  CANCELLED = 2,
  CONFIRMING = 3,
  RISK_REJECTED = 4,
  CANCELLED_BY_MATCH = 5,
  AUTO_CANCLLED = 21,
  MANUAL_CANCLLED = 22
}

// 枚举对应值
export const ORDER_STATUS_MAP: { [key in EOrderStatus]: string } = {
  [EOrderStatus.PENDING]: '未结算',
  [EOrderStatus.SETTLED]: '已结算',
  [EOrderStatus.CANCELLED]: '取消(人工)',
  [EOrderStatus.CONFIRMING]: '待确认',
  [EOrderStatus.RISK_REJECTED]: '风控拒单',
  [EOrderStatus.CANCELLED_BY_MATCH]: '撤单(赛事取消)',
  [EOrderStatus.AUTO_CANCLLED]: '预约失败',
  [EOrderStatus.MANUAL_CANCLLED]: '手动取消',
};
