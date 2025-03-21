import {TMatch} from '@core/services/Table';
import DpImage from '@views/kmg/desktop/components/Image';
import {Tooltip} from 'antd';
import {getMatchStatusByPeriod} from '@core/utils';
import Timer from '@views/kmg/desktop/components/Timer';
import dayjs from 'dayjs';
import classnames from 'classnames';
import style from './style.scss';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsScoreType, EStaticsType} from '@core/constants/enum/sport';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';

interface IScoreCompProp {
  match: TMatch;
  hideScore?: Function;
  isFull?: boolean;
  noBg?: boolean;
  className?: string;
}
function ScoreComponent({match, hideScore, isFull, noBg}: IScoreCompProp) {
  return (
    <div className={classnames(style.wrapper, 'score-detail text-num', {'is-full': isFull, 'no-bg': noBg})}>
      {
        isFull ? (
          <div className='explain'>
            {
              hideScore && match.sportId <= 33 &&
              <span onClick={() => hideScore()}>隐藏</span>
            }
          </div>
        ) : (
          <Tooltip overlayClassName="explain-tooltip" placement="bottomRight" title="此版面显示的所有直播内容仅供参考，会员亦可使用此内容为指南。我们将尽最大的努力确保显示的内容是正确的，如有错误，本公司将不承担任何责任。对于滚球比分，例如滚球让球，将以投注时在投注单中显示的正确比分为准。">
            <div className="explain">
              <img src={require('../i/info_icon.webp')} width={16} height={16} alt="info" />
            </div>
          </Tooltip>
        )
      }
      {
        !match.matchClock.isRunning ? <NotInPlayComp match={match} /> : <InPlayComp match={match} />
      }
    </div>
  );
}

const NotInPlayComp = ({match, className}: IScoreCompProp) => {
  const {detailUpdateTime} = useMatchDetail();
  return (
    <div className={classnames('score-box', className)}>
      <div className="league-name">{match.leagueName}</div>
      <div className="score-info">
        <div className="logo">
          <div className="team-name">
            <Tooltip title={match.teams.home.name} placement='top'>
              {match.teams.home.name}
            </Tooltip>
          </div>
          <DpImage size={40} className="team-logo" type="team" src={match.teams.home.icon} />
        </div>
        <div className="score">
          {
            !match.matchClock.period ?
              <div className="text-center">
                <p>{dayjs(match.matchClock.startTime).format('MM月DD日')}</p>
                <span>{dayjs(match.matchClock.startTime).format('HH:mm')}</span>
              </div> : match.score.home !== undefined && match.score.away !== undefined &&
              <div className="score-num">{`${match.score.home} : ${match.score.away}`}</div>
          }
        </div>
        <div className="logo">
          <DpImage size={40} className="team-logo" type="team" src={match.teams.away.icon} />
          <div className="team-name away">
            <Tooltip title={match.teams.away.name} placement='top'>
              {match.teams.away.name}
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="match-status">
        {
          !!match.matchClock.period &&
            <span>
              {getMatchStatusByPeriod(match.matchClock.period)}
              {
                match.playTypes.length > 0 && !['FT', 'HT'].includes(match.matchClock.period) && match.matchClock.second > 0 && match.sportId === 1 &&
                <Timer seconds={match.matchClock.second} key={`${match?.matchId}_${match.matchClock.second}_${detailUpdateTime}`} />
              }
            </span>
        }
      </div>
    </div>
  );
};

const InPlayComp = ({match}: IScoreCompProp) => {
  const {getScoreByTypeId, matchDetailStatistics, getScoreByScores} = useMatchStatistics();
  const getBasketballScore = (type: string) => {
    const temp = match.score.periodScore.find((item) => item.period === type);
    return temp ? [temp.home, temp.away] : [0, 0];
  };
  const getRender = () => {
    const penal = getScoreByTypeId(EStaticsType.penalties);
    const sp = match.matchClock.period?.replace('s', '').replace('q', '');
    const p1 = getScoreByScores(EStaticsScoreType.q1);
    const p2 = getScoreByScores(EStaticsScoreType.q2);
    const p3 = getScoreByScores(EStaticsScoreType.q3);
    const p4 = getScoreByScores(EStaticsScoreType.q4);
    switch (match.sportId) {
      case 1:
        const yellow = getScoreByTypeId(EStaticsType.yellow);
        const corner = getScoreByTypeId(EStaticsType.cornerKicks);
        return (
          <div className="score-table">
            <div className="col-item">
              <div className="title">
                {getMatchStatusByPeriod(match.matchClock.period)}
              </div>
              <div className="item">
                <Tooltip title="角球">
                  <img src={require('../../i/concor.png')} />
                </Tooltip>
              </div>
              <div className="item">
                <Tooltip title="黄牌">
                  <div className="yellow-card" />
                </Tooltip>
              </div>
              <div className="item">
                <Tooltip title="红牌">
                  <div className="red-card" />
                </Tooltip>
              </div>
              <div className="item">
                <Tooltip title="点球">
                  <img src={require('./../../i/penalty.png')} />
                </Tooltip>
              </div>
              <div className="item">
                <Tooltip title="上半场">
                  <img src={require('./../../i/ht.png')} />
                </Tooltip>
              </div>
              <div className="item">
                <Tooltip title="全场">
                  <img src={require('./../../i/ft.png')} />
                </Tooltip>
              </div>
            </div>
            <div className="col-item">
              <div className="title">
                <DpImage size={24} width={24} type="team" src={match.teams.home.icon} />
                <div className="team-name">{match.teams.home.name}</div>
              </div>
              <div className="item">{corner[0]}</div>
              <div className="item">{yellow[0]}</div>
              <div className="item">{match.score.homeRedCard}</div>
              <div className="item">{penal[0]}</div>
              <div className="item">{matchDetailStatistics?.neutral === '1' ? matchDetailStatistics?.awayTeamHalfTimeScore : matchDetailStatistics?.hometTeamHalfTimeScore}</div>
              <div className="item">{match.score.home}</div>
            </div>
            <div className="col-item">
              <div className="title">
                <DpImage size={24} width={24} type="team" src={match.teams.away.icon} />
                <div className="team-name">{match.teams.away.name}</div>
              </div>
              <div className="item">{corner[1]}</div>
              <div className="item">{yellow[1]}</div>
              <div className="item">{match.score.awayRedCard}</div>
              <div className="item">{penal[1]}</div>
              <div className="item">{matchDetailStatistics?.neutral === '1' ? matchDetailStatistics?.hometTeamHalfTimeScore : matchDetailStatistics?.awayTeamHalfTimeScore}</div>
              <div className="item">{match.score.away}</div>
            </div>
          </div>
        );
      case 2:
        const q1 = getBasketballScore('q1');
        const q2 = getBasketballScore('q2');
        const q3 = getBasketballScore('q3');
        const q4 = getBasketballScore('q4');
        return (
          <div className="score-table ">
            <div className="col-item">
              <div className="title flex-col">
                <p>{getMatchStatusByPeriod(match.matchClock.period)}</p>
                <span>{match.matchClock.playTime}</span>
              </div>
              <div className={classnames('item', {'text-primary': sp === '1'})}>Q1</div>
              <div className={classnames('item', {'text-primary': sp === '2'})}>Q2</div>
              <div className={classnames('item', {'text-primary': sp && Number(sp) < 3})}>半场</div>
              <div className={classnames('item', {'text-primary': sp === '3'})}>Q3</div>
              <div className={classnames('item', {'text-primary': sp === '4'})}>Q4</div>
              <div className={classnames('item', {'text-primary': true})}>总分</div>
            </div>
            <div className="col-item">
              <div className="title">
                <DpImage size={24} width={24} type="team" src={match.teams.home.icon} />
                <div className="team-name">{match.teams.home.name}</div>
              </div>
              <div className={classnames('item', {'text-primary': sp === '1'})}>{q1[0] || p1[0]}</div>
              <div className={classnames('item', {'text-primary': sp === '2'})}>{q2[0] || p2[0]}</div>
              <div className={classnames('item', {'text-primary': sp && Number(sp) < 3})}>{(q1[0] || p1[0]) + (q2[0] || p2[0])}</div>
              <div className={classnames('item', {'text-primary': sp === '3'})}>{q3[0] || p3[0]}</div>
              <div className={classnames('item', {'text-primary': sp === '4'})}>{q4[0] || p4[0]}</div>
              <div className="item text-primary">{match.score.home}</div>
            </div>
            <div className="col-item">
              <div className="title">
                <DpImage size={24} width={24} type="team" src={match.teams.away.icon} />
                <div className="team-name">{match.teams.away.name}</div>
              </div>
              <div className={classnames('item', {'text-primary': sp === '1'})}>{q1[1] || p1[1]}</div>
              <div className={classnames('item', {'text-primary': sp === '2'})}>{q2[1] || p2[1]}</div>
              <div className={classnames('item', {'text-primary': sp && Number(sp) < 3})}>{(q1[1] || p1[1]) + (q2[1] || p2[1])}</div>
              <div className={classnames('item', {'text-primary': sp === '3'})}>{q3[1] || p3[1]}</div>
              <div className={classnames('item', {'text-primary': sp === '4'})}>{q4[1] || p4[1]}</div>
              <div className="item text-primary">{match.score.away}</div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="score-table">
            <div className="col-item">
              <div className="title flex-col">
                <p>{getMatchStatusByPeriod(match.matchClock.period)}</p>
                <span>{match.matchClock.playTime}</span>
              </div>
              <div className={classnames('item', {'text-primary': sp === '1'})}>1</div>
              <div className={classnames('item', {'text-primary': sp === '2'})}>2</div>
              <div className={classnames('item', {'text-primary': sp === '3'})}>3</div>
              <div className="item">赛盘</div>
              <div className="item">得分</div>
            </div>
            <div className="col-item">
              <div className="title">
                <DpImage size={24} width={24} type="team" src={match.teams.home.icon} />
                <div className="team-name">{match.teams.home.name}</div>
              </div>
              <div className={classnames('item')}>{p1[0]}</div>
              <div className={classnames('item')}>{p2[0]}</div>
              <div className={classnames('item')}>{p3[0]}</div>
              <div className="item">{sp}</div>
              <div className="item">{match.score.home}</div>
            </div>
            <div className="col-item">
              <div className="title">
                <DpImage size={24} width={24} type="team" src={match.teams.away.icon} />
                <div className="team-name">{match.teams.away.name}</div>
              </div>
              <div className={classnames('item')}>{p1[1]}</div>
              <div className={classnames('item')}>{p2[1]}</div>
              <div className={classnames('item')}>{p3[1]}</div>
              <div className="item">{sp}</div>
              <div className="item">{match.score.away}</div>
            </div>
          </div>
        );
      // case 6:
      // case 23:
      //   return (
      //     <div className="score-table ">
      //       <div className="col-item">
      //         <div className="title flex-col">
      //           <p>{getMatchStatusByPeriod(match.matchClock.period)}</p>
      //           <span>{match.matchClock.playTime}</span>
      //         </div>
      //         {match.score.periodScore.map((score) => (
      //           <>
      //             <div className={classnames('item', {'text-primary': sp === '1'})}>{getMatchStatusByPeriod(score.period)}</div>
      //           </>
      //         ))}
      //         <div className={classnames('item', 'text-primary')}>总分</div>
      //       </div>
      //       <div className="col-item">
      //         <div className="title">
      //           <DpImage size={24} width={24} type="team" src={match.teams.home.icon} />
      //           <div className="team-name">{match.teams.home.name}</div>
      //         </div>
      //         {match.score.periodScore.map((score, idx) => (
      //           <>
      //             <div className={classnames('item', {'text-primary': idx + 1 === match.score.periodScore.length})}>{score.home}</div>
      //           </>
      //         ))}
      //         <div className={classnames('item', 'text-primary')}>{match.score.home}</div>
      //       </div>
      //       <div className="col-item">
      //         <div className="title">
      //           <DpImage size={24} width={24} type="team" src={match.teams.away.icon} />
      //           <div className="team-name">{match.teams.away.name}</div>
      //         </div>
      //         {match.score.periodScore.map((score, idx) => (
      //           <>
      //             <div className={classnames('item', {'text-primary': idx + 1 === match.score.periodScore.length})}>{score.away}</div>
      //           </>
      //         ))}
      //         <div className={classnames('item', 'text-primary')}>{match.score.away}</div>
      //       </div>
      //     </div>
      //   );
      default:
        return <NotInPlayComp className="default-wrapper" match={match} />;
    };
  };
  return (
    <>
      {
        getRender()
      }
    </>
  );
};

export default React.memo(ScoreComponent);
