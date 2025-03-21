
import useSportsGameInit from '@core/hooks/sports/useSportsGameInit';
import usePollInterval from '@core/hooks/sports/usePollInterval';
import pageWrapper from '@this/components/PageWrapper';
import 'swiper/css';
import css from './style.scss';
import React, {useEffect, useMemo, useState} from 'react';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import DpRecordBar from './components/RecordBar';
import useTheme from '@core/hooks/useTheme';
import {ETHEME} from '@views/kmg/desktop/configs';
import DpCollapse from './components/Collapse';
import DpLineChart from './components/LineChart';
import DpMatchEvent, {matcheventList} from './components/MatchEvent';
import SwitchButton from './components/SwitchButton';
import {PieChart} from 'react-minimal-pie-chart';
import DpNoData from './components/NoData';

enum MatchHalf {
  FullTime = 'm1',
  FirstHalf = 'm2',
  SecondHalf = 'm3',
}

interface footResult {
  type: EStaticsType;
  score: string;
}

const matchResults: footResult[] = [
  {
    type: EStaticsType.shotsOnGoal,
    score: '进球',
  },
  {
    type: EStaticsType.shotsOffGoal,
    score: '乌龙球',
  },
  {
    type: EStaticsType.penalties,
    score: '点球',
  },
  {
    type: EStaticsType.mpenalties,
    score: '点球未进',
  },
  {
    type: EStaticsType.assist,
    score: '助攻',
  },
  {
    type: EStaticsType.yellow,
    score: '黄牌',
  },
  {
    type: EStaticsType.red,
    score: '红牌',
  },
  {
    type: EStaticsType.substitutions,
    score: '换人',
  },
  {
    type: EStaticsType.yellowRed,
    score: '两黄一红',
  },
  {
    type: EStaticsType.cornerKicks,
    score: '角球',
  },
];

export const BetResult = React.memo(() => {
  useSportsGameInit();
  usePollInterval();
  const [isOpen, setIsOpen] = useState(true);
  const [selecteSwitchItem, setSelecteSwitchItem] = useState(MatchHalf.FullTime);
  const {matchDetail} = useMatchDetail();
  const {getScoreByTypeId, matchDetailStatistics} = useMatchStatistics();

  const {oCircleList, dCircleList, yRCList} = useMemo(() => {
    const attak = getScoreByTypeId(EStaticsType.attak);
    const danger = getScoreByTypeId(EStaticsType.dangerAttack);
    const kql = getScoreByTypeId(EStaticsType.BallPossession);
    const yellow = getScoreByTypeId(EStaticsType.yellow);
    const red = getScoreByTypeId(EStaticsType.red);
    const corner = getScoreByTypeId(EStaticsType.cornerKicks);
    const foul = getScoreByTypeId(EStaticsType.Fouls);
    const interception = getScoreByTypeId(EStaticsType.interception);
    const clearance = getScoreByTypeId(EStaticsType.clearance);

    const oCircleList= [
      {title: EStaticsTypeName[EStaticsType.attak], hScore: attak[0], aScore: attak[1]},
      {title: EStaticsTypeName[EStaticsType.BallPossession], hScore: kql[0], aScore: kql[1]},
      {title: EStaticsTypeName[EStaticsType.dangerAttack], hScore: danger[0], aScore: danger[1]},
    ];

    const dCircleList= [
      {title: EStaticsTypeName[EStaticsType.interception], hScore: interception[0], aScore: interception[1]},
      {title: EStaticsTypeName[EStaticsType.Fouls], hScore: foul[0], aScore: foul[1]},
      {title: EStaticsTypeName[EStaticsType.dangerAttack], hScore: clearance[0], aScore: clearance[1]},
    ];

    const yRCList = [
      {hYCard: yellow[0], aYCard: yellow[1]},
      {hRCard: red[0], aRCard: red[1]},
      {hCorner: corner[0], aCorner: corner[1]},
    ];

    return {
      oCircleList, dCircleList, yRCList,
    };
  }, [matchDetailStatistics, matchDetail?.matchId]);

  const handleCollapseChange = (openVal: boolean) => {
    setIsOpen(openVal);
  };

  useEffect(() => {
  }, [matchDetail]);

  const {theme} = useTheme();

  return (
    <div className={css.betResultWrapper}>
      <div className='main'>
        {matchDetail ?
        <>
          <div className='event'>
            <DpCollapse
              header="赛事事件"
              open={isOpen}
              onChange={handleCollapseChange}
              className="custom-collapse"
            >
              <div className='graphic-view'>
                <div className='team-info'>
                  <div className='team-board'>
                    <div className='team-item'>
                      <span className='team-mark'>
                        <img src={matchDetail?.teams.home.icon} alt="" />
                      </span>
                      <span className='team-name'>{matchDetail?.teams.home.name}</span>
                    </div>
                    <div className='team-item'>
                      <span className='team-mark'>
                        <img src={matchDetail?.teams.away.icon} alt="" />
                      </span>
                      <span className='team-name'>{matchDetail?.teams.away.name}</span>
                    </div>
                  </div>
                </div>
                <DpMatchEvent eventList={matcheventList}/>
              </div>
              <div className='event-result'>
                <div className='event-overview'>
                  {
                    matchResults.map((item, idx) => {
                      return (
                        <div key={idx} className='event-item'>
                          <div>
                            <img
                              src={require(`./i/${item.type}${theme === ETHEME.DARK ? '_dark' : ''}.webp`)}
                              className='event-img'
                            />
                          </div>
                          <div className='event-score'>
                            {item.score}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </DpCollapse>
          </div>
          <div className='event-analysis'>
            <div className='header'>
              <div className='title'>
                技术统计
              </div>
              <div className='btn-group'>
                <SwitchButton
                  className='switch-btn'
                  options={[
                    {label: '全场', value: MatchHalf.FullTime},
                    {label: '上半场', value: MatchHalf.FirstHalf},
                    {label: '下半场', value: MatchHalf.SecondHalf},
                  ]}
                  width={42}
                  checked={`${selecteSwitchItem}`}
                  onChange={(value: any) => setSelecteSwitchItem(value)}
                />
              </div>
            </div>
            <div className='body'>
              <div className='team-info'>
                <div className='team-board'>
                  <div className='team-item'>
                    <span className='team-mark'>
                      <img src={matchDetail?.teams.home.icon} alt="" />
                    </span>
                    <span className='team-name'>{matchDetail?.teams.home.name}</span>
                  </div>
                  <div className='team-item'>
                    <span className='team-mark'>
                      <img src={matchDetail?.teams.away.icon} alt="" />
                    </span>
                    <span className='team-name'>{matchDetail?.teams.away.name}</span>
                  </div>
                </div>
              </div>
              <div className='record-board'>
                <DpRecordBar
                  data={[
                    {type: EStaticsType.cornerKicks, num: yRCList[2].hCorner},
                    {type: EStaticsType.red, num: yRCList[1].hRCard},
                    {type: EStaticsType.yellow, num: yRCList[0].hYCard},
                  ]} />
                <DpRecordBar
                  data={[
                    {type: EStaticsType.yellow, num: yRCList[0].aYCard},
                    {type: EStaticsType.red, num: yRCList[1].aRCard},
                    {type: EStaticsType.cornerKicks, num: yRCList[2].aCorner},
                  ]}/>
              </div>
              <div className='offensive-view'>
                <div className='title'>进攻端</div>
                <div className='view'>
                  <div className='circle'>
                    {oCircleList.map((item, idx) => {
                      return (
                        <div className='circle-item' key={idx}>
                          <PieChart
                            key={idx}
                            radius={27}
                            lineWidth={0}
                            segmentsStyle={(index) => {
                              return {strokeWidth: 4 + index*2};
                            }}
                            label={({x, y, dx, dy, dataEntry}) => (
                              <g>
                                <span>{item.aScore}</span>
                                <text
                                  x={x}
                                  y={y}
                                  dominantBaseline="central"
                                  textAnchor="middle"
                                  style={{
                                    fontSize: '10px',
                                    fill: '#8E9298',
                                    fontWeight: 400,
                                  }}
                                >
                                  {dataEntry.title}
                                </text>
                              </g>
                            )}
                            totalValue={item.aScore+item.hScore}
                            startAngle={-90}
                            lengthAngle={360}
                            data={(item.hScore === 0 && item.aScore ===0)? [{title: item.title, value: 100, color: (theme === ETHEME.DARK ? '#3C3D45' :'#E9ECF3')}] :
                            [{title: item.title, value: item.hScore, color: '#F6B73D'},
                              {title: item.title, value: item.aScore, color: '#ED4949'}]}
                          />
                          <div className='score'>
                            <div>{item.hScore}</div>
                            <div>{item.aScore}</div>
                          </div>
                        </div>

                      );
                    })}
                  </div>
                  <div className='line'>
                    <DpLineChart
                      hScore={9}
                      aScore={5}
                      aPercent={50}
                      hPercent={80}
                      title='断球'
                      enabled={true}
                    />
                    <DpLineChart
                      hScore={2}
                      aScore={4}
                      aPercent={10}
                      hPercent={50}
                      title='射正'
                      enabled={true}
                    />
                    <DpLineChart
                      hScore={7}
                      aScore={1}
                      aPercent={40}
                      hPercent={30}
                      title='射偏'
                      enabled={true}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='射门被封'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='禁区内射门'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='禁区外射门'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='错失得分机会'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='传球'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='传中次数'
                      enabled={false}
                    />
                  </div>
                </div>
              </div>
              <div className='deffensive-view'>
                <div className='title'>防守端</div>
                <div className='view'>
                  <div className='circle'>
                    {dCircleList.map((item, idx) => {
                      return (
                        <div className='circle-item' key={idx}>
                          <PieChart
                            key={idx}
                            radius={27}
                            lineWidth={0}
                            segmentsStyle={(index) => {
                              return {strokeWidth: 4 + index*2};
                            }}
                            label={({x, y, dx, dy, dataEntry}) => (
                              <g>
                                <span>{item.aScore}</span>
                                <text
                                  x={x}
                                  y={y}
                                  dominantBaseline="central"
                                  textAnchor="middle"
                                  style={{
                                    fontSize: '10px',
                                    fill: '#8E9298',
                                    fontWeight: 400,
                                  }}
                                >
                                  {dataEntry.title}
                                </text>
                              </g>
                            )}
                            totalValue={item.aScore+item.hScore}
                            startAngle={-90}
                            lengthAngle={360}
                            data={(item.hScore === 0 && item.aScore ===0)? [{title: item.title, value: 100, color: (theme === ETHEME.DARK ? '#3C3D45' :'#E9ECF3')}] :
                            [{title: item.title, value: item.hScore, color: '#F6B73D'},
                              {title: item.title, value: item.aScore, color: '#ED4949'}]}
                          />
                          <div className='score'>
                            <div>{item.hScore}</div>
                            <div>{item.aScore}</div>
                          </div>
                        </div>

                      );
                    })}
                  </div>
                  <div className='line'>
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='扑救'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='铲球次数'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='越位'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='丢失球权'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='球门球'
                      enabled={false}
                    />
                    <DpLineChart
                      hScore={0}
                      aScore={0}
                      aPercent={0}
                      hPercent={0}
                      title='界外球'
                      enabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </> :
          <>
            <DpNoData title='赛事事件'/>
            <DpNoData title='技术统计'/>
          </>

        }
        <div className='comment'>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M8.56245 6.4375L6.06245 5L8.56245 3.5625C8.81245 3.4375 8.93745 3.0625 8.74995 2.8125C8.62495 2.5625 8.24995 2.4375 7.99995 2.625L5.49995 4.0625V1.1875C5.56245 0.875 5.31245 0.625 4.99995 0.625C4.68745 0.625 4.43745 0.875 4.43745 1.1875V4.0625L1.93745 2.625C1.74995 2.4375 1.37495 2.5625 1.24995 2.8125C1.12495 3.0625 1.18745 3.4375 1.43745 3.5625L3.93745 5L1.43745 6.4375C1.18745 6.5625 1.06245 6.9375 1.24995 7.1875C1.37495 7.375 1.56245 7.4375 1.74995 7.4375C1.81245 7.4375 1.93745 7.4375 1.99995 7.375L4.49995 5.9375V8.8125C4.43745 9.125 4.68745 9.375 4.99995 9.375C5.31245 9.375 5.56245 9.125 5.56245 8.8125V5.9375L8.06245 7.375C8.12495 7.4375 8.24995 7.4375 8.31245 7.4375C8.49995 7.4375 8.68745 7.3125 8.81245 7.1875C8.87495 6.9375 8.81245 6.5625 8.56245 6.4375Z" fill="#A7AFBB"/>
          </svg>
          <span>
            赛事数据来源于三方，数据内容仅供参考，请以实际比赛数据为准
          </span>
        </div>
      </div>
    </div>
  );
});

export default pageWrapper(BetResult, {title: 'DP体育'});
