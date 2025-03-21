import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import DpProgress from './ProgressBar';
import {TMatch} from '@core/services/Table';

interface IProps {
  match: TMatch;
}

export default ({match}: IProps) => {
  const {getScoreByTypeId} = useMatchStatistics();
  const yellow = getScoreByTypeId(EStaticsType.yellow);
  const corner = getScoreByTypeId(EStaticsType.cornerKicks);
  const penal = getScoreByTypeId(EStaticsType.penalties);
  const attak = getScoreByTypeId(EStaticsType.attak);
  const danger = getScoreByTypeId(EStaticsType.dangerAttack);
  const kql = getScoreByTypeId(EStaticsType.BallPossession);
  const sz = getScoreByTypeId(EStaticsType.shotsOnGoal);
  const sp = getScoreByTypeId(EStaticsType.shotsOffGoal);
  return (
    <div className='match-infos football'>
      <div className='match-infos-main'>
        <div className='cards home'>
          <div className='card'>
            <div className="corner-card" />
            <div className="red-card" />
            <div className="yellow-card" />
            <div className="kick-card" />
          </div>
          <div className='value'>
            <span>{corner[0]}</span>
            <span>{match?.score.homeRedCard}</span>
            <span>{yellow[0]}</span>
            <span>{penal[0]}</span>
          </div>
        </div>
        <div className='possession'>
          <DpProgress homeValue={kql[0]} awayValue={kql[1]} title={EStaticsTypeName[EStaticsType.BallPossession]} />
        </div>
        <div className='cards awy'>
          <div className='card'>
            <div className="kick-card" />
            <div className="yellow-card" />
            <div className="red-card" />
            <div className="corner-card" />
          </div>
          <div className='value'>
            <span>{penal[1]}</span>
            <span>{yellow[1]}</span>
            <span>{match?.score.awayRedCard}</span>
            <span>{corner[1]}</span>
          </div>
        </div>
      </div>
      <div className='match-infos-detail'>
        <div className='detail-column'>
          <DpProgress homeValue={attak[0]} awayValue={attak[1]} title={EStaticsTypeName[EStaticsType.attak]}/>
          <DpProgress homeValue={danger[0]} awayValue={danger[1]} title={EStaticsTypeName[EStaticsType.dangerAttack]}/>
        </div>
        <div className='line-vertical'></div>
        <div className='detail-column'>
          <DpProgress homeValue={sz[0]} awayValue={sz[1]} title={EStaticsTypeName[EStaticsType.shotsOnGoal]}/>
          <DpProgress homeValue={sz[0]} awayValue={sp[1]} title={EStaticsTypeName[EStaticsType.shotsOffGoal]}/>
        </div>
      </div>
    </div>
  );
};
