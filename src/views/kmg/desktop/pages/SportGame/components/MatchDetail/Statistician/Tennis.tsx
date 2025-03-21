import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';

const Tennis = () => {
  const {getScoreByTypeId} = useMatchStatistics();
  const serveScore = getScoreByTypeId(EStaticsType.serveScore);
  const doubleFault = getScoreByTypeId(EStaticsType.doubleFault);
  const breakSuccessRate = getScoreByTypeId(EStaticsType.BreakSuccessRate);
  return (
    <div className="tennis-statistic">
      <div className="title-list">
        <div className="item">{serveScore[0]}</div>
        <div className="item">{doubleFault[0]}</div>
        <div className="item">{breakSuccessRate[0]}%</div>
        <div className="item">{breakSuccessRate[1]}%</div>
        <div className="item">{doubleFault[1]}</div>
        <div className="item">{serveScore[1]}</div>
      </div>
      <div className="line">
        <div className="line-item">
          {EStaticsTypeName[EStaticsType.serveScore]}
        </div>
        <div className="line-item">
          {EStaticsTypeName[EStaticsType.doubleFault]}
        </div>
        <div className="line-item">
          {EStaticsTypeName[EStaticsType.BreakSuccessRate]}
        </div>
        <div className="line-item">
          {EStaticsTypeName[EStaticsType.doubleFault]}
        </div>
        <div className="line-item">
          {EStaticsTypeName[EStaticsType.serveScore]}
        </div>
      </div>
    </div>
  );
};

export default Tennis;
