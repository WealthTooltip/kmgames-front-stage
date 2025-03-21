import {TMatch} from '@core/services/Table';
import dayjs from 'dayjs';
import classnames from 'classnames';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsScoreType, EStaticsType} from '@core/constants/enum/sport';

interface IProps {
  match: TMatch;
}

export default ({match}: IProps) => {
  const {getScoreByScores, getScoreByTypeId} = useMatchStatistics();
  const getBasketballScore = (type: string) => {
    const temp = match.score.periodScore.find((item) => item.period === type);
    return temp ? [temp.home, temp.away] : [0, 0];
  };
  const sp = match.matchClock.period?.replace('s', '').replace('q', '');
  const q1 = getBasketballScore('q1');
  const q2 = getBasketballScore('q2');
  const q3 = getBasketballScore('q3');
  const q4 = getBasketballScore('q4');
  const p1 = getScoreByScores(EStaticsScoreType.q1);
  const p2 = getScoreByScores(EStaticsScoreType.q2);
  const p3 = getScoreByScores(EStaticsScoreType.q3);
  const p4 = getScoreByScores(EStaticsScoreType.q4);
  const twoPointAttempted = getScoreByTypeId(EStaticsType.twoPointAttempted);
  const threePointAttempted = getScoreByTypeId(EStaticsType.threePointAttempted);
  const Fouls = getScoreByTypeId(EStaticsType.Fouls);
  const freeThrowAttempted = getScoreByTypeId(EStaticsType.freeThrowAttempted);
  const timeouts = getScoreByTypeId(EStaticsType.Timeouts);
  return (
    <div className="match-infos basketball">
      <div className="score-info">
        <div className="item">
          <div>
            {
              dayjs(match.matchClock.startTime).format('MM月DD日 HH:mm')
            }
          </div>
          <div className={classnames({'text-primary': sp === '1'})}>Q1</div>
          <div className={classnames({'text-primary': sp === '2'})}>Q2</div>
          <div className={classnames({'text-primary': sp && Number(sp) < 3})}>半场</div>
          <div className={classnames({'text-primary': sp === '3'})}>Q3</div>
          <div className={classnames({'text-primary': sp === '4'})}>Q4</div>
          <div className={classnames('text-primary')}>总分</div>
        </div>
        <div className="item">
          <div>
            {match.teams.home.name}
          </div>
          <div className={classnames({'text-primary': sp === '1'})}>{q1[0] || p1[0]}</div>
          <div className={classnames({'text-primary': sp === '2'})}>{q2[0] || p2[0]}</div>
          <div className={classnames({'text-primary': Number(sp) < 3})}>{(q1[0] || p1[0]) + (q2[0] || p2[0])}</div>
          <div className={classnames({'text-primary': sp === '3'})}>{q3[0] || p3[0]}</div>
          <div className={classnames({'text-primary': sp === '4'})}>{q4[0] || p4[0]}</div>
          <div className="text-primary">{match.score.home}</div>
        </div>
        <div className="item">
          <div>
            {match.teams.away.name}
          </div>
          <div className={classnames({'text-primary': sp === '1'})}>{q1[1] || p1[1]}</div>
          <div className={classnames({'text-primary': sp === '2'})}>{q2[1] || p1[1]}</div>
          <div className={classnames({'text-primary': Number(sp) < 3})}>{(q1[1] || p1[1]) + (q2[1] || p1[1])}</div>
          <div className={classnames({'text-primary': sp === '3'})}>{q3[1] || p3[1]}</div>
          <div className={classnames({'text-primary': sp === '4'})}>{q4[1] || p4[1]}</div>
          <div className="text-primary">{match.score.away}</div>
        </div>
        <LineItem title="暂停" homeScore={timeouts[0]} awayScore={timeouts[1]} />
      </div>
      <div className="sta-info">
        <LineItem title="2分" homeScore={twoPointAttempted[0]} awayScore={twoPointAttempted[1]} />
        <LineItem title="3分" homeScore={threePointAttempted[0]} awayScore={threePointAttempted[1]} />
        <LineItem title="罚球" homeScore={freeThrowAttempted[0]} awayScore={freeThrowAttempted[1]} />
        <LineItem title="犯规" homeScore={Fouls[0]} awayScore={Fouls[1]} />
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
      <div className="line-box">
        <div className="line-score">{homeScore}</div>
        <div className="left mr-2">
          <span style={{width: homeScore * 100 / ((homeScore + awayScore) || 1) + '%'}}></span>
        </div>
        <div className="title">{title}</div>
        <div className="right">
          <span style={{width: awayScore * 100 / ((homeScore + awayScore) || 1) + '%'}}></span>
        </div>
        <div className="line-score">{awayScore}</div>
      </div>
    </div>
  );
};
