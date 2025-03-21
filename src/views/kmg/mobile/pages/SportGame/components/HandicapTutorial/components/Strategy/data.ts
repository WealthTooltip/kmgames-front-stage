import {IStrategyData} from '.';

export const strategyData: IStrategyData[] = [
  {
    id: 0,
    content: '0球',
    title: '0球 平手盘',
    describe: '均不让球即0',
    items:
            [
              {subtitle: '投注主队全赢，投注客队全输，反之相同',
                teamDetail: {
                  home: {
                    icon: './i/home-icon', score: 1, status: '全赢',
                  },
                  away: {
                    icon: './i/away-icon', score: 0, status: '全输',
                  },
                },
              },
              {subtitle: '打平，退回本金（走水）',
                teamDetail: {
                  home: {
                    icon: './i/home-icon', score: 0, status: '退回本金',
                  },
                  away: {
                    icon: './i/away-icon', score: 0, status: '退回本金',
                  },
                },
              },
            ],
  },
  {
    id: 1,
    content: '0/0.5球',
    title: '0/0.5球 平手半球盘',
    describe: '主队让0/0.5球',
    items:
        [
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '打平，退回本金（走水）',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '输一半',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '赢一半',
              },
            },
          },
        ],
  },
  {
    id: 2,
    content: '0.5球',
    title: '0.5球 半球盘',
    describe: '主队让0.5球',
    items:
        [
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '打平，投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 0, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
        ],
  },
  {
    id: 3,
    content: '0.5/1球',
    title: '0.5球/1球 半球/一球盘',
    describe: '主队让0.5/1球',
    items:
        [
          {subtitle: '投注主队赢一半，投注客队输一半',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '赢一半',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '输一半',
              },
            },
          },
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 2, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 0, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
        ],
  },
  {
    id: 4,
    content: '1球',
    title: '1球 一球盘',
    describe: '主队让1球',
    items:
        [
          {subtitle: '投注主客队均退回本金（走水）',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '退回本金',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '退回本金',
              },
            },
          },
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 2, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '投注主队全输，投注主队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 0, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
        ],
  },
  {
    id: 5,
    content: '1/1.5球',
    title: '1球/1.5球 一球/球半盘',
    describe: '主队让1/1.5球',
    items:
        [
          {subtitle: '投注主队输一半，投注客队赢一半',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '输一半',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '赢一半',
              },
            },
          },
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 2, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '打平，投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 0, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
        ],
  },
  {
    id: 6,
    content: '1.5球',
    title: '1.5 球半盘',
    describe: '主队让1.5球',
    items:
        [
          {subtitle: '投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 2, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '打平，投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 0, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
        ],
  },
  {
    id: 7,
    content: '1.5/2球',
    title: '1.5/2 球半盘',
    describe: '主队让1.5/2球',
    items:
        [
          {subtitle: '投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 1, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
          {subtitle: '投注主队赢一半，投注客队输一半',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 2, status: '赢一半',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '输一半',
              },
            },
          },
          {subtitle: '投注主队全赢，投注客队全输',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 3, status: '全赢',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全输',
              },
            },
          },
          {subtitle: '打平，投注主队全输，投注客队全赢',
            teamDetail: {
              home: {
                icon: './i/home-icon', score: 0, status: '全输',
              },
              away: {
                icon: './i/away-icon', score: 0, status: '全赢',
              },
            },
          },
        ],
  },
];
