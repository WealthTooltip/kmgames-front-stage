import MatchDetail from './events';
import './style.scss';
import {TMatch} from '@core/services/Table';
import StatusBars from './status';
import StatusRightBars from './status/rightBars';
import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';

export default ({match}: {match: TMatch}) => {
  const {getScoreByTypeId} = useMatchStatistics();
  const ballPossession = getScoreByTypeId(EStaticsType.BallPossession);
  const attack = getScoreByTypeId(EStaticsType.attak);
  const shotsOnGoal = getScoreByTypeId(EStaticsType.shotsOnGoal);
  const dangerAttack = getScoreByTypeId(EStaticsType.dangerAttack);
  const shotsOffGoal = getScoreByTypeId(EStaticsType.shotsOffGoal);

  return (
    <div className="match-detail-view">
      <div className='match-detail-head flex flex-between'>
        <MatchDetail match={match} type="home" />
        <StatusBars match={match} home = {ballPossession[0]} away = {ballPossession[1]} text = {EStaticsTypeName[EStaticsType.BallPossession]}/>
        <MatchDetail match={match} type="away"/>
      </div>
      <div className='match-detail-item flex flex-between'>
        <StatusBars match={match} home = {attack[0]} away = {attack[1]} text = {EStaticsTypeName[EStaticsType.attak]}/>
        <StatusRightBars match={match} home = {shotsOnGoal[0]} away = {shotsOnGoal[1]} text = {EStaticsTypeName[EStaticsType.shotsOnGoal]}/>
      </div>
      <div className='match-detail-item flex flex-between'>
        <StatusBars match={match} home = {dangerAttack[0]} away = {dangerAttack[1]} text = {EStaticsTypeName[EStaticsType.dangerAttack]}/>
        <StatusRightBars match={match} home = {shotsOffGoal[0]} away = {shotsOffGoal[1]} text = {EStaticsTypeName[EStaticsType.shotsOffGoal]}/>
      </div>
    </div>
  );
};

