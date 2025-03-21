import './style.scss';
import {TMatch} from '@core/services/Table';
import StatusBar from './status/status-bar';
import StatusRightBar from './status/status-bar/right';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsType} from '@core/constants/enum/sport';

// import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
// import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';

export default ({match}: { match: TMatch }) => {
  // const {getScoreByTypeId} = useMatchStatistics();
  // const attack = getScoreByTypeId(EStaticsType.attak);
  // const shotsOnGoal = getScoreByTypeId(EStaticsType.shotsOnGoal);
  const {getScoreByTypeId} = useMatchStatistics();
  const serveScore = getScoreByTypeId(EStaticsType.serveScore);
  const doubleFault = getScoreByTypeId(EStaticsType.doubleFault);
  const breakSuccessRate = getScoreByTypeId(EStaticsType.BreakSuccessRate);

  return (
    <div className="match-detail-tennis-view flex flex-between">
      <StatusBar match={match} home={serveScore[0]} type="home" text={'发球得分'} />
      <StatusBar match={match} home={serveScore[1]} type="home" text={'双发失误'} />
      <div className="flex items-center flex-col">
        <div className='flex brake flex-between' >
          <StatusRightBar match={match} type="home" home={breakSuccessRate[0]} />
          <StatusRightBar match={match} type="away" home={breakSuccessRate[1]} />
        </div>
        <span className="middle-text">破发成功率</span>
      </div>
      <StatusBar match={match} home={doubleFault[0]} type="away" text={'发球得分'} />
      <StatusBar match={match} home={doubleFault[1]} type="away" text={'双发失误'} />
    </div>
  );
};

