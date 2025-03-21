
import dayjs from 'dayjs';
import './style.scss';
import {TMatch} from '@core/services/Table';
import StatusBar from '../status';
import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';
import {EStaticsScoreType, EStaticsType} from '@core/constants/enum/sport';

export default ({match}: { match: TMatch }) => {
  const getBasketballScore = (type: string) => {
    const temp = match.score.periodScore.find((item) => item.period === type);
    return temp ? [temp.home, temp.away] : [0, 0];
  };
  const {getScoreByScores} = useMatchStatistics();

  const q1 = getBasketballScore('q1');
  const q2 = getBasketballScore('q2');
  const q3 = getBasketballScore('q3');
  const q4 = getBasketballScore('q4');
  const p1 = getScoreByScores(EStaticsScoreType.q1);
  const p2 = getScoreByScores(EStaticsScoreType.q2);
  const p3 = getScoreByScores(EStaticsScoreType.q3);
  const p4 = getScoreByScores(EStaticsScoreType.q4);
  const {getScoreByTypeId} = useMatchStatistics();
  const pause = getScoreByTypeId(EStaticsType.Timeouts);
  return (
    <div className='flex flex-col'>
      <div className='flex flex-between'>
        <div className='left-full-detail flex-col flex '>
          <span className='date-time flex-start'>{dayjs(match.matchClock.startTime).format('MM月DD日')}</span>
          <span className='date-time'>{dayjs(match.matchClock.startTime).format('HH:mm')}</span>
          <span style={{marginTop: 8}}>波士顿凯尔特人</span>
          <span style={{marginTop: 16}}>犹他爵士</span>

        </div>
        <div className='right-full-detail flex'>
          <div className='right-full-detail-col flex-col items-center'>
            <div className='items-center'>Q1</div>
            <div className='items-center'>{q1[0] || p1[0]}</div>
            <div className='items-center'>{q1[1] || p1[1]}</div>
          </div>
          <div className='right-full-detail-col flex-col items-center'>
            <div className='items-center'>Q2</div>
            <div className='items-center'>{q2[0] || p2[0]}</div>
            <div className='items-center'>{q2[1] || p2[1]}</div>
          </div>
          <div className='right-full-detail-col flex-col items-center'>
            <div className='items-center'>半场</div>
            <div className='items-center'>{(q1[0] || p1[0]) + (q2[0] || p2[0])}</div>
            <div className='items-center'>{(q1[1] || p1[1]) + (q2[1] || p2[1])}</div>
          </div>
          <div className='right-full-detail-col flex-col items-center'>
            <div className='items-center'>Q3</div>
            <div className='items-center'>{q3[0] || p3[0]}</div>
            <div className='items-center'>{q3[1] || p3[1]}</div>
          </div>
          <div className='right-full-detail-col blue-col flex-col items-center'>
            <div className='items-center'>Q4</div>
            <div className='items-center'>{q4[0] || p4[0]}</div>
            <div className='items-center'>{q4[1] || p4[1]}</div>
          </div>
          <div className='right-full-detail-col blue-col flex-col items-center'>
            <div className='items-center'>总分</div>
            <div className='items-center'>{match.score.home}</div>
            <div className='items-center'>{match.score.away}</div>
          </div>

        </div>
      </div>

      <div style={{marginTop: 16}}>
        <StatusBar match={match} home={pause[0]} away={pause[1]} text={'暂停'} />
      </div>
    </div>
  );
};

