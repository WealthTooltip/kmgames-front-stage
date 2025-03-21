import {IProps} from '.';
import {americanFootball, badminton, baseball, basketball, beachVolleyball, boxing, champion, cricket, esport, football, handball, hockey, instruction, pass, pingpong, puck, rugby, snooker, tennis, volleyball} from '../detail/data';

export const menuList: IProps[] = [

  {
    title: '一般体育说明',
    tdata: instruction,
  },
  {
    title: '投注教程',
  },
  {
    title: '连串过关/复式过关/组合过关',
    tdata: pass,
  },
  {
    title: '冠军',
    tdata: champion,
  },
  {
    title: '足球',
    tdata: football,
  },
  {
    title: '篮球',
    tdata: basketball,
  },
  {
    title: '网球',
    tdata: tennis,
  },
  {
    title: '斯诺克/台球',
    tdata: snooker,
  },
  {
    title: '排球',
    tdata: volleyball,
  },
  {
    title: '特别项目',
  },
  {
    title: '飞镖',
  },
  {
    title: '联合式橄榄球',
    tdata: rugby,
  },
  {
    title: '拳击/格斗',
    tdata: boxing,
  },
  {
    title: '手球',
    tdata: handball,
  },
  {
    title: '冰球',
    tdata: puck,
  },
  {
    title: '板球',
    tdata: cricket,
  },
  {
    title: '金融投注',
  },
  {
    title: '彩票',
  },
  {
    title: '美式足球',
    tdata: americanFootball,
  },
  {
    title: '高尔夫球',
  },
  {
    title: '棒球',
    tdata: baseball,
  },
  {
    title: '羽毛球',
    tdata: badminton,
  },
  {
    title: '选美大赛',
  },
  {
    title: '赛车',
  },
  {
    title: '沙滩足球',
  },
  {
    title: '乒乓球',
    tdata: pingpong,
  },
  {
    title: '垒球',
  },
  {
    title: '室内足球',
  },
  {
    title: '沙滩排球',
    tdata: beachVolleyball,
  },
  {
    title: '冬季运动',
  },
  {
    title: '曲棍球',
    tdata: hockey,
  },
  {
    title: '自行车',
  },
  {
    title: '体操',
  },
  {
    title: '田径',
  },
  {
    title: '更多运动',
  },
  {
    title: '水上运动',
  },
  {
    title: '电子竞技',
    tdata: esport,
  },
];
