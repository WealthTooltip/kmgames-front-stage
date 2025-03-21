/*
 * @Author: Passion.KMG
 * @Date: 2023-12-15 15:32:25
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/assets/mock/sports/index.ts
 * @Description:
 */
import Mock from 'mockjs';
import {TMatchData} from '@models/sport/get-match-list.d';
import {baseRes} from '../index';

const {Random} = Mock;

export const matchList = baseRes((): TMatchData => {
  // 预定义的足球联赛名称列表
  const leagues = [
    '英格兰超级联赛',
    '西班牙甲级联赛',
    '德国足球甲级联赛',
    '意大利足球甲级联赛',
    '法国足球甲级联赛',
    '欧洲冠军联赛',
    '美洲冠军联赛',
  ];

  // 定义一些示例足球队伍名称
  const teams = [
    '曼城',
    '巴塞罗那',
    '皇家马德里',
    '拜仁慕尼黑',
    '尤文图斯',
    '阿贾克斯',
    '利物浦',
    '切尔西',
    '巴黎圣日耳曼',
    '多特蒙德',
  ];

  // 随机生成两个不同的队伍
  const team1 = Random.pick(teams);
  let team2 = Random.pick(teams);
  while (team1 === team2) {
    team2 = Random.pick(teams); // 确保team2和team1不同
  }

  // 预定义一些足球比赛的玩法名称
  const playTypes = ['胜平负', '让球胜平负', '总进球数', '半全场', '比分', '第一个进球', '角球数', '黄牌数'];

  // 定义一些分数形式的盘口值
  const fractionHandicaps = [
    '0/0.5', // 平手/半球
    '0.5/1', // 半球/一球
    '1/1.5', // 一球/球半
    '1.5/2', // 球半/两球
  ];

  return {
    count: 100,
    pageNum: 1,
    pageSize: 20,
    pageData: Mock.mock({
      'Array|20-50': [
        {
          md: {
            mid: Mock.Random.integer(1, 100000),
            cid: Mock.Random.integer(1, 100000),
            sid: Mock.Random.integer(1, 100000),
            lid: Mock.Random.integer(1, 100000),
            ln: Random.pick(leagues),
            mn: `${team1} vs ${team2}`,
            htid: Mock.Random.integer(1, 100000),
            atid: Mock.Random.integer(1, 100000),
            pf: Random.pick(['主场', '客场']),
            isNe: Mock.Random.integer(0, 1),
            lv: Mock.Random.integer(1, 100000),
            u: Random.url(),
            s: Random.cparagraph(),
            cs: `${Random.natural(0, 5)}-${Random.natural(0, 5)}`,
            bt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
            ss: Mock.Random.integer(1, 100000),
            ht: {
              tid: Mock.Random.integer(1, 100000),
              tn: team1,
              lg: Random.image(),
              lv: Mock.Random.integer(1, 100000),
            },
            at: {
              tid: Mock.Random.integer(1, 100000),
              tn: team2,
              lg: Random.image(),
              lv: Mock.Random.integer(1, 100000),
            },
          },
          ptds: [
            {
              bn: Random.pick(playTypes),
              kc: Random.string('upper', 3),
              hcl: [
                {
                  sbim: Mock.Random.integer(1, 100000),
                  bil: [
                    {
                      bid: Mock.Random.integer(1, 100000),
                      hoa: 'Home',
                      h: Random.pick(fractionHandicaps),
                      od: Random.float(1.0, 10.0, 1, 2),
                      s: Random.pick([0, 1]),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }).Array,
  };
});

export const videoMock = {x1: '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', st1: 1, timestamp: 1703767778989};
