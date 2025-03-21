import {EStaticsType} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import useMatchDetail from '@core/hooks/sports/useMatchDetail';
import classnames from 'classnames';

const Basketball = () => {
  const {matchDetail} = useMatchDetail();
  const {getScoreByTypeId} = useMatchStatistics();
  const twoPointAttempted = getScoreByTypeId(EStaticsType.twoPointAttempted);
  const threePointAttempted = getScoreByTypeId(EStaticsType.threePointAttempted);
  const Fouls = getScoreByTypeId(EStaticsType.Fouls);
  const Timeouts = getScoreByTypeId(EStaticsType.Timeouts);
  const freeThrowAttempted = getScoreByTypeId(EStaticsType.freeThrowAttempted);
  const freeThrowMade = getScoreByTypeId(EStaticsType.freeThrowMade);
  return (
    <div className="basketball-statistic">
      {
        matchDetail &&
        <div className="teams">
          <div className="team">{matchDetail.teams.home.name}</div>
          <div className="team">{matchDetail.teams.away.name}</div>
        </div>
      }
      <div className="sta-content">
        <LineItem title="2分" homeScore={twoPointAttempted[0]} awayScore={twoPointAttempted[1]} />
        <LineItem title="3分" homeScore={threePointAttempted[0]} awayScore={threePointAttempted[1]} />
        <LineItem title="犯规" homeScore={Fouls[0]} awayScore={Fouls[1]} />
        <div className="comp-wrap">
          <div className="stop">
            <span className={classnames({active: Timeouts[0] > 4})}></span>
            <span className={classnames({active: Timeouts[0] > 3})}></span>
            <span className={classnames({active: Timeouts[0] > 2})}></span>
            <span className={classnames({active: Timeouts[0] > 1})}></span>
            <span className={classnames({active: Timeouts[0] > 0})}></span>
          </div>
          <div className="line-wrap">
            <div className="title-list">
              <div className="item">
                <span className="mr-10">
                  {Math.ceil((freeThrowAttempted[0] ? freeThrowMade[0] : 0) * 100 / (freeThrowAttempted[0] || 1))}%
                </span>
                {freeThrowAttempted[0]}
              </div>
              <div className="item">
                <span className="mr-10">
                  {freeThrowAttempted[1]}
                </span>
                {Math.ceil((freeThrowAttempted[1] ? freeThrowMade[1] : 0) / (freeThrowAttempted[1] || 1))}%
              </div>
            </div>
            <div className="line-box">
              <div className="left mr-2">
                <span style={{width: freeThrowAttempted[0] * 100 / ((freeThrowAttempted[0] + freeThrowAttempted[1]) || 1) + '%'}}></span>
              </div>
              <div className="right">
                <span style={{width: freeThrowAttempted[1] * 100 / ((freeThrowAttempted[0] + freeThrowAttempted[1]) || 1) + '%'}}></span>
              </div>
            </div>
          </div>
          <div className="stop">
            <span className={classnames({active: Timeouts[1] > 0})}></span>
            <span className={classnames({active: Timeouts[1] > 1})}></span>
            <span className={classnames({active: Timeouts[1] > 2})}></span>
            <span className={classnames({active: Timeouts[1] > 3})}></span>
            <span className={classnames({active: Timeouts[1] > 4})}></span>
          </div>
        </div>
        <div className="com-title">
          <span>暂停</span>
          <span>罚球</span>
          <span>暂停</span>
        </div>
      </div>
    </div>
  );
};

interface ILineItem {
  title: string;
  homeScore: number;
  awayScore: number;
}

const LineItem = ({
  title,
  homeScore,
  awayScore,
}: ILineItem) => {
  return (
    <div className="line-wrap">
      <div className="title-list">
        <div className="item">{homeScore}</div>
        <div className="title">{title}</div>
        <div className="item">{awayScore}</div>
      </div>
      <div className="line-box">
        <div className="left mr-2">
          <span style={{width: homeScore * 100 / ((homeScore + awayScore) || 1) + '%'}}></span>
        </div>
        <div className="right">
          <span style={{width: awayScore * 100 / ((homeScore + awayScore) || 1) + '%'}}></span>
        </div>
      </div>
    </div>
  );
};

export default Basketball;
