import {footballTags} from '@views/kmg/desktop/pages/GamesResult/components/ResultTable/components/Icons';
import {EGameResult} from './gamesResult';

export enum ESportsCategory {
  FOOTBALL = 1,
  BASKETBALL = 2,
  TENNIS = 3,
  E_SPORTS = 4,
  SNOOKER = 5,
  VOLLEYBALL = 6,
  SPECIAL_PROJECTS = 7,
  DARTS = 8,
  RUGBY = 9,
  BOXING_MMA = 10,
  HANDBALL = 11,
  ICE_HOCKEY = 12,
  CRICKET = 13,
  FINANCIAL_BETTING = 14,
  LOTTERY = 15,
  AMERICAN_FOOTBALL = 16,
  GOLF = 17,
  BASEBALL = 18,
  BADMINTON = 19,
  BEAUTY_CONTEST = 20,
  RACING = 21,
  BEACH_SOCCER = 22,
  TABLE_TENNIS = 23,
  SOFTBALL = 24,
  INDOOR_SOCCER = 25,
  BEACH_VOLLEYBALL = 26,
  WINTER_SPORTS = 27,
  FIELD_HOCKEY = 28,
  CYCLING = 29,
  GYMNASTICS = 30,
  TRACK_AND_FIELD = 31,
  MORE_SPORTS = 32,
  WATER_SPORTS = 33,
  DOTA = 276,
  CSGO = 277,
  LOL = 278,
  KING = 279,
}

export const sportsCategory = [
  {
    sportId: 1,
    name: '足球',
    resultIcons: footballTags,
  },
  {
    sportId: 2,
    name: '篮球',
    resultIcons: footballTags,
  },
  {
    sportId: 3,
    name: '网球',
    resultIcons: footballTags,
  },
  {
    sportId: 4,
    name: '电子竞技',
    resultIcons: footballTags,
  },
  {
    sportId: 5,
    name: '斯诺克',
    resultIcons: footballTags,
  },
  {
    sportId: 6,
    name: '排球',
    resultIcons: footballTags,
  },
  {
    sportId: 7,
    name: '特别项目',
    resultIcons: footballTags,
  },
  {
    sportId: 8,
    name: '飞镖',
    resultIcons: footballTags,
  },
  {
    sportId: 9,
    name: '橄榄球',
    resultIcons: footballTags,
  },
  {
    sportId: 10,
    name: '拳击/格斗',
    resultIcons: footballTags,
  },
  {
    sportId: 11,
    name: '手球',
    resultIcons: footballTags,
  },
  {
    sportId: 12,
    name: '冰球',
    resultIcons: footballTags,
  },
  {
    sportId: 13,
    name: '板球',
    resultIcons: footballTags,
  },
  {
    sportId: 14,
    name: '金融投注',
    resultIcons: footballTags,
  },
  {
    sportId: 15,
    name: '彩票',
    resultIcons: footballTags,
  },
  {
    sportId: 16,
    name: '美式足球',
    resultIcons: footballTags,
  },
  {
    sportId: 17,
    name: '高尔夫球',
    resultIcons: footballTags,
  },
  {
    sportId: 18,
    name: '棒球',
    resultIcons: footballTags,
  },
  {
    sportId: 19,
    name: '羽毛球',
    resultIcons: footballTags,
  },
  {
    sportId: 20,
    name: '选美大赛',
    resultIcons: footballTags,
  },
  {
    sportId: 21,
    name: '赛车',
    resultIcons: footballTags,
  },
  {
    sportId: 22,
    name: '沙滩足球',
    resultIcons: footballTags,
  },
  {
    sportId: 23,
    name: '乒乓球',
    resultIcons: footballTags,
  },
  {
    sportId: 24,
    name: '垒球',
    resultIcons: footballTags,
  },
  {
    sportId: 25,
    name: '室内足球',
    resultIcons: footballTags,
  },
  {
    sportId: 26,
    name: '沙滩排球',
    resultIcons: footballTags,
  },
  {
    sportId: 27,
    name: '冬季运动',
    resultIcons: footballTags,
  },
  {
    sportId: 28,
    name: '曲棍球',
    resultIcons: footballTags,
  },
  {
    sportId: 29,
    name: '自行车',
    resultIcons: footballTags,
  },
  {
    sportId: 30,
    name: '体操',
    resultIcons: footballTags,
  },
  {
    sportId: 31,
    name: '田径',
    resultIcons: footballTags,
  },
  {
    sportId: 32,
    name: '更多运动',
    resultIcons: footballTags,
  },
  {
    sportId: 33,
    name: '水上运动',
    resultIcons: footballTags,
  },
];

export const eSportsCategory = [
  {
    sportId: 276,
    name: 'DOTA2',
    resultIcons: footballTags,
  },
  {
    sportId: 277,
    name: 'CS:GO/CS2',
    resultIcons: footballTags,
  },
  {
    sportId: 278,
    name: '英雄联盟',
    resultIcons: footballTags,
  },
  {
    sportId: 279,
    name: '王者荣耀',
    resultIcons: footballTags,
  },
];

export interface IconProps {
  title: string;
  element: React.ReactElement;
}
export default [...sportsCategory, ...eSportsCategory] as {
  sportId: number;
  name: string;
  resultIcons?: Record<EGameResult, IconProps>;
}[];
