import './style.scss';
import {TMatch} from '@core/services/Table';
import StatusBars from './status';
import {EStaticsType} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import MatchDetailLeft from './left';

export default ({match}: { match: TMatch }) => {
  const {getScoreByTypeId} = useMatchStatistics();
  const twoPointAttempted = getScoreByTypeId(EStaticsType.twoPointAttempted);
  const threePointAttempted = getScoreByTypeId(EStaticsType.twoPointAttempted);
  const Fouls = getScoreByTypeId(EStaticsType.Fouls);
  const penalties = getScoreByTypeId(EStaticsType.penalties);
  // const getBasketballScore = (type: string) => {
  //   const temp = match.score.periodScore.find((item) => item.period === type);
  //   return temp ? [temp.home, temp.away] : [0, 0];
  // };
  // const {getScoreByScores} = useMatchStatistics();

  // const q1 = getBasketballScore('q1');
  // const q2 = getBasketballScore('q2');
  // const q3 = getBasketballScore('q3');
  // const q4 = getBasketballScore('q4');
  // const p1 = getScoreByScores(EStaticsScoreType.q1);
  // const p3 = getScoreByScores(EStaticsScoreType.q3);
  // const p4 = getScoreByScores(EStaticsScoreType.q3);
  return (

    <div className="match-detail-view flex flex-between">
      <MatchDetailLeft match={match} />
      <div className='match-detail-item flex flex-col'>
        <StatusBars match={match} home={twoPointAttempted[0]} away={twoPointAttempted[1]} text={'2分'} />
        <StatusBars match={match} home={threePointAttempted[0]} away={threePointAttempted[1]} text={'3分'} />
        <StatusBars match={match} home={Fouls[0]} away={Fouls[1]} text={'罚球'} />
        <StatusBars match={match} home={penalties[0]} away={penalties[1]} text={'犯规'} />
      </div>

    </div>
  );
};

