import {IGuideData} from '.';

export const guideData: IGuideData[] = [

  {
    id: 0,
    content: '2.5球',
    title: '2.5球',
    subtitle: '投注大2.5全赢，投注小2.5全输',
    sumGoal: 3,
    items: {
      big: {target: '大2.5', status: '全赢'},
      small: {target: '小2.5', status: '全输'},
    },
  },
  {
    id: 1,
    content: '2.5/3球',
    title: '2.5/3球',
    subtitle: '投注大2.5/3赢一半，投注小2.5/3输一半',
    sumGoal: 3,
    items: {
      big: {target: '大2.5/3', status: '赢一半'},
      small: {target: '小2.5', status: '输一半'},
    },
  },
  {
    id: 2,
    content: '3球',
    title: '3球',
    subtitle: '投注大3退回本金（走水），投注小3退回本金（本金）',
    sumGoal: 3,
    items: {
      big: {target: '大3', status: '退回本金'},
      small: {target: '小2.5', status: '退回本金'},
    },
  },
  {
    id: 3,
    content: '3/3.5球',
    title: '3/3.5球',
    subtitle: '投注大3/3.5输一半，投注小3/3.5赢一半',
    sumGoal: 3,
    items: {
      big: {target: '大3/3.5', status: '输一半'},
      small: {target: '小3/3.5', status: '赢一半'},
    },
  },
];
