// 在赛果页面中查看单场比赛详情时使用
export interface ValuedItemsProp {
  label: string | React.ReactElement;
  value: number | string;
};

export default (sportId: number) => {
  switch (sportId) {
    case 1:
      return [
        {label: '全部', value: -1},
        {label: '进球', value: 0},
        {label: '角球', value: 1},
        {label: '罚牌', value: 2},
      ];

    default:
      return [
        {label: '全部', value: -1},
      ];
  }
};
