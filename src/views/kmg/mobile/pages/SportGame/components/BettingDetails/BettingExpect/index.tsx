import React, {useState} from 'react';
import styles from './style.scss';
import LineChart from './components/LineChart';
import DpIcon from '@views/kmg/mobile/components/Icon';
import SwitchButton from '@core/templates/mobile/components/SwitchButton';
import DetailButton from './components/DetailButton';
import {PieChart} from 'react-minimal-pie-chart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type {ChartData, ChartOptions} from 'chart.js';
import {Line} from 'react-chartjs-2';
import useTheme from '@core/hooks/useTheme';
import TeamMatchDetail from './components/TeamMatchDetail';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

export type TabProps = 'TEAMMATCH' | 'BLANK' | 'GOAL' | 'TREND' | 'ODDS';

export default React.memo(() => {
  const {jsTheme} = useTheme();
  const [detailTab, setDetailTab] = useState<TabProps>('BLANK');
  const areaChartOptions :ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {display: false},
      tooltip: {enabled: false},
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          color: jsTheme.dpAncillary,
        },
      },
      x: {
        display: false,
        ticks: {
          maxTicksLimit: 0,
          maxRotation: 0,
        },
      },
    },
  };
  const labels = ['09:06 09/15', '09:06 09/15', '09:06 09/15', '09:06 09/15', '09:06 09/15', '09:06 09/15', '09:06 09/15'];
  const chartData = [
    {title: 'GREEN', value: 20, color: 'url(#green0)'},
    {title: 'YELLOW', value: 30, color: 'url(#yellow0)'},
    {title: 'RED', value: 50, color: 'url(#red0)'},
  ];
  const chartData1 = [
    {title: 'GREEN', value: 20, color: 'url(#green1)'},
    {title: 'YELLOW', value: 30, color: 'url(#yellow1)'},
    {title: 'RED', value: 50, color: 'url(#red1)'},
  ];
  const areaChartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        pointStyle: false,
        fill: true,
        label: 'Dataset 1',
        data: [1.2, 2.3, 12.0, 2.5, 5.6, 9.5, 3.5],
        borderColor: 'rgba(246, 183, 61, 0.5)',
        backgroundColor: 'rgba(246, 183, 61, 0.05)',
        borderWidth: 2,
      },
      {
        pointStyle: false,
        fill: true,
        label: 'Dataset 2',
        data: [3.2, 2.3, 5.0, 6.5, 2.6, 6.5, 13.5],
        borderColor: 'rgba(36, 194, 61, 0.5)',
        backgroundColor: 'rgba(36, 194, 61, 0.05)',
        borderWidth: 2,
      },
      {
        pointStyle: false,
        fill: true,
        label: 'Dataset 2',
        data: [3, 4, 5.2, 1, 4, 9, 7.4],
        borderColor: 'rgba(237, 73, 73,0.5)',
        backgroundColor: 'rgba(237, 73, 73, 0.05)',
        borderWidth: 2,
      },
    ],
  };
  const [activetab, setTab] = useState('1');
  return (
    <div className={styles.wrapper}>
      <svg xmlns="http://www.w3.org/2000/svg" width="78" height="80" viewBox="0 0 78 80" fill="none" className='gradientsvg'>
        <defs>
          <linearGradient id="red0" x1="37" y1="79.5" x2="39" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7E62"/>
            <stop offset="1" stopColor="#ED4949"/>
          </linearGradient>
          <linearGradient id="yellow0" x1="71" y1="30.5" x2="40" y2="73" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFDD63"/>
            <stop offset="1" stopColor="#F6B73D"/>
          </linearGradient>
          <linearGradient id="green0" x1="40" y1="8" x2="69.5" y2="29.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#43CC92"/>
            <stop offset="1" stopColor="#24C23D"/>
          </linearGradient>
        </defs>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="76" height="80" viewBox="0 0 76 80" fill="none" className='gradientsvg'>
        <defs>
          <linearGradient id="red1" x1="39" y1="79.5" x2="37" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7E62"/>
            <stop offset="1" stopColor="#ED4949"/>
          </linearGradient>
          <linearGradient id="yellow1" x1="11.5" y1="62.5" x2="36" y2="73" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFDD63"/>
            <stop offset="1" stopColor="#F6B73D"/>
          </linearGradient>
          <linearGradient id="green1" x1="36" y1="8" x2="12.5" y2="62.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#43CC92"/>
            <stop offset="1" stopColor="#24C23D"/>
          </linearGradient>
        </defs>
      </svg>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>胜率指数</p>
          <div className='select-btn'>
            <SwitchButton
              className='switch-btn'
              options={[{label: '让球', value: '1'}, {label: '大小', value: '2'}, {label: '独赢', value: '3'}]}
              checked={activetab}
              width={39}
              onChange={(e) => setTab(e)}
            />
          </div>
        </div>
        <div className='panel-content'>
          <div className='win-rate-team'>
            <div className='win-rate home'>
              <div className='team-img'></div>
              <div className='detail'>
                <p className='text-normal text-10'>-0.25</p>
                <p className='text-12'>胜率<span className='color-red'>48%</span></p>
                <p className='text-10'>当主队赔率是<span className='color-red'>2.00</span>时</p>
              </div>
              <div className='bar-chart'>
                <div className='rest'></div>
                <div className='bar'></div>
              </div>
            </div>
            <div className='win-rate away'>
              <div className='bar-chart'>
                <div className='rest'></div>
                <div className='bar'></div>
              </div>
              <div className='detail'>
                <p className='text-normal text-10'>+0.25</p>
                <p className='text-12'><span className='color-yellow'>52%</span>胜率</p>
                <p className='text-10'>当主队赔率是<span className='color-yellow'>1.85</span>时</p>
              </div>
              <div className='team-img'></div>
            </div>
          </div>
          <div className='win-rate-description'>
            <DpIcon type='exclamation'/><p>胜率随盘口及赔率变化，数据指数来源于系统计算及三方，仅供参考!</p>
          </div>
        </div>
      </div>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>球队战绩</p>
          <DetailButton onClick={()=> setDetailTab('TEAMMATCH')}/>
        </div>
        <div className='panel-content'>
          <div className='history'>
            <div className='team-history home'>
              <div className='pie-chart'>
                {/* <CanvasJSChart options = {option1}/> */}
                <PieChart
                  radius={40}
                  lineWidth={20}
                  label={({x, y, dx, dy, dataEntry}) => (
                    <g>
                      <text
                        x={x}
                        y={y}
                        dx={dx>0?2.8*dx+6:2.8*dx+1}
                        dy={2.2*dy-8}
                        dominantBaseline="central"
                        textAnchor="middle"
                        style={{
                          fontSize: '10px',
                          fill: dataEntry.color,
                          fontFamily: 'DIN Pro',
                        }}
                      >
                        {dataEntry.value +'%'}
                      </text>
                      <path d={`M${x+1.8*dx} ${y+1.8*dy} L${x+2.2*dx} ${y+2.2*dy} L${dx>0?x+2.2*dx+27:x+2.2*dx-25} ${y+2.2*dy}`} stroke={dataEntry.color} fill='none'/>
                    </g>
                  )}
                  segmentsStyle={(index) => {
                    return {strokeWidth: 6 + index*2};
                  }}
                  startAngle={-90}
                  lengthAngle={360}
                  data={chartData}
                />
              </div>
              <div className='team-name'>
                <div className='team-img'/>
                <p>明斯克</p>
              </div>
              <div className='history-detail'>
                <span className='color-red'>5</span>胜<span className='color-yello'>3</span>平<span className='color-green'>2</span>负<span>(近<span className='color-strong'>10</span>场比赛)</span>
              </div>
            </div>
            <div className='team-history away'>
              <div className='pie-chart'>
                <PieChart
                  radius={40}
                  lineWidth={20}
                  label={({x, y, dx, dy, dataEntry}) => (
                    <g>
                      <text
                        x={x}
                        y={y}
                        dx={dx>0?2.8*dx+1:2.8*dx-5}
                        dy={2.2*dy-8}
                        dominantBaseline="central"
                        textAnchor="middle"
                        style={{
                          fontSize: '10px',
                          fill: dataEntry.color,
                          fontFamily: 'DIN Pro',
                        }}
                      >
                        {dataEntry.value +'%'}
                      </text>
                      <path d={`M${x+1.8*dx} ${y+1.8*dy} L${x+2.2*dx} ${y+2.2*dy} L${dx>0?x+2.2*dx+27:x+2.2*dx-25} ${y+2.2*dy}`} stroke={dataEntry.color} fill='none'/>
                    </g>
                  )}
                  segmentsStyle={(index : any) => {
                    return {strokeWidth: 6 + index*2};
                  }}
                  startAngle={-90}
                  lengthAngle={-360}
                  data={chartData1}
                />
              </div>
              <div className='team-name'>
                <div className='team-img'/>
                <p>莫济里</p>
              </div>
              <div className='history-detail'>
                <span className='color-red'>5</span>胜<span className='color-yellow'>1</span>平<span className='color-green'>4</span>负<span>(近<span className='color-strong'>10</span>场比赛)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>进球分布</p>
          <DetailButton onClick={()=>setDetailTab('GOAL')}/>
        </div>
        <div className='panel-content goal-distribution'>
          <div className='team-goals'>
            <div className='team-goal home'>
              <div className='team-name'>
                <div className='team-img'/>
                <p>明斯克</p>
              </div>
              <div className='team-detail'>
                同赛事下该队在31&apos;~45+&apos;共打入4进球，为进球高发期
              </div>
            </div>
            <div className='team-goal away'>
              <div className='team-name'>
                <div className='team-img'/>
                <p>明斯克</p>
              </div>
              <div className='team-detail'>
                同赛事下该队在31&apos;~45+&apos;共打入4进球，为进球高发期
              </div>
            </div>
          </div>
          <div className='time-goal-detail'>
            <div className='time-goal'>
              <span className='goal'>2</span>
              <span className='text-normal time'>01&apos;<span>～</span>15&apos;</span>
              <span className='goal'>2</span>
            </div>
            <div className='time-detail'>
              <LineChart type='home' value={10}/>
              <LineChart type='away' value={11}/>
            </div>
          </div>
          <div className='time-goal-detail'>
            <div className='time-goal'>
              <span className='goal'>2</span>
              <span className='text-normal time'>01&apos;<span>～</span>15&apos;</span>
              <span className='goal'>2</span>
            </div>
            <div className='time-detail'>
              <LineChart type='home' value={10}/>
              <LineChart type='away' value={11}/>
            </div>
          </div>
          <div className='time-goal-detail'>
            <div className='time-goal'>
              <span className='goal'>3</span>
              <span className='text-normal time'>15&apos;<span>～</span>30&apos;</span>
              <span className='goal'>2</span>
            </div>
            <div className='time-detail'>
              <LineChart type='home' value={45}/>
              <LineChart type='away' value={5}/>
            </div>
          </div>
          <div className='time-goal-detail'>
            <div className='time-goal'>
              <span className='goal'>2</span>
              <span className='text-normal time'>30&apos;<span>～</span>45&apos;</span>
              <span className='goal'>4</span>
            </div>
            <div className='time-detail'>
              <LineChart type='home' value={10}/>
              <LineChart type='away' value={22}/>
            </div>
          </div>
        </div>
      </div>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>盘路走势</p>
          <DetailButton onClick={()=>setDetailTab('TREND')}/>
        </div>
        <div className='panel-content market-trend'>
          <div className='market-name'>
            <div className='team-name home'>
              <div className='team-img'/>
              <p>明斯克</p>
            </div>
            <span className='text-ancillary text-10'>近10场比赛数据</span>
            <div className='team-name away'>
              <div className='team-img'/>
              <p>莫济里</p>
            </div>
          </div>
          <div className='market-charts'>
            <div className='market-chart'>
              <PieChart
                radius={40}
                lineWidth={20}
                label={()=>(
                  <text
                    x={50}
                    y={50}
                    dx={0}
                    dy={0}
                    dominantBaseline="central"
                    textAnchor="middle"
                  >
                    <tspan x='50' y='44' style={{
                      fontSize: '16px',
                      fontFamily: 'DIN Pro',
                      fill: jsTheme.dpStrong,
                      fontWeight: '500',
                      lineHeight: '16px',
                    }}>{'90%'}</tspan>
                    <tspan x='50' y='60' style={{
                      fontSize: '10px',
                      fontFamily: 'PingFang SC',
                      fontWeight: '400',
                      lineHeight: '10px',
                      fill: jsTheme.dpNormal,
                    }}>赢盘率</tspan>
                  </text>
                )}
                segmentsStyle={(index : any) => {
                  return {strokeWidth: 6 + index*2};
                }}
                startAngle={-90}
                lengthAngle={-360}
                data={[
                  {title: 'GREEN', value: 10, color: 'url(#green0)'},
                  {title: 'RED', value: 90, color: 'url(#red0)'},
                ]}
              />
            </div>
            <div className='market-score'>
              <div className='item color-red'>9</div>
              <div className='item color-red'>赢盘</div>
              <div className='item color-red'>5</div>
              <div className='item color-green'>1</div>
              <div className='item color-green'>输盘</div>
              <div className='item color-green'>5</div>
              <div className='item color-yellow'>1</div>
              <div className='item color-yellow'>走盘</div>
              <div className='item color-yellow'>0</div>
            </div>
            <div className='market-chart'>
              <PieChart
                radius={40}
                lineWidth={20}
                label={()=>(
                  <text
                    x={50}
                    y={50}
                    dx={0}
                    dy={0}
                    dominantBaseline="central"
                    textAnchor="middle"
                  >
                    <tspan x='50' y='44' style={{
                      fontSize: '16px',
                      fontFamily: 'DIN Pro',
                      fill: jsTheme.dpStrong,
                    }}>{'50%'}</tspan>
                    <tspan x='50' y='60' style={{
                      fontSize: '10px',
                      fontFamily: 'PingFang SC',
                      fill: jsTheme.dpNormal,
                    }}>赢盘率</tspan>
                  </text>
                )}
                labelPosition={0}
                segmentsStyle={(index : any) => {
                  return {strokeWidth: 6 + index*2};
                }}
                startAngle={-90}
                lengthAngle={360}
                data={[
                  {title: 'GREEN', value: 50, color: 'url(#green1)'},
                  {title: 'RED', value: 50, color: 'url(#red1)'},
                ]}
              />
            </div>
          </div>
          <div className='market-tables'>
            <div className='market-table'>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
            </div>
            <div className='market-table'>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
              <div className='item color-red'>赢</div>
            </div>
          </div>
        </div>
      </div>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>百家赔率</p>
          <DetailButton onClick={()=>setDetailTab('ODDS')}/>
        </div>
        <div className='panel-content odds'>
          <div className='team-odds'>
            <div className='team-odd home'>
              <div className='team-name'>
                <div className='team-img'/>
                <p>明斯克</p>
              </div>
              <div className='team-detail'>
                当赔率3.00的时候,这只球队实际赢得56.00%的比赛
              </div>
            </div>
            <div className='team-odd away'>
              <div className='team-name'>
                <div className='team-img'/>
                <p>明斯克</p>
              </div>
              <div className='team-detail'>
                当赔率3.00的时候,这只球队实际赢得60.00%的比赛
              </div>
            </div>
          </div>
          <div className='area-chart'>
            <div className='chart-header'>
              <div className='item-group'>
                <div className='line-item red'></div>
                <span>主胜</span>
              </div>
              <div className='item-group'>
                <div className='line-item green'></div>
                <span>客胜</span>
              </div>
              <div className='item-group'>
                <div className='line-item yellow'></div>
                <span>和局</span>
              </div>
            </div>
            <div className='chart-content'>
              <Line options={areaChartOptions} data={areaChartData} />
              <div className='chart-labels'>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
                <div className='chart-label'>
                  <div className='time-label'>09:46</div>
                  <div className='date-label'>01/09</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='detail-panel'>
        <div className='panel-header'>
          <p>新闻情报</p>
        </div>
        <div className='panel-content news'>
          <div className='item'>暂无新闻情报</div>
        </div>
      </div>
      {detailTab === 'TEAMMATCH' ? <TeamMatchDetail back={(e: TabProps)=>setDetailTab(e)}/> :''}
    </div>
  );
});
