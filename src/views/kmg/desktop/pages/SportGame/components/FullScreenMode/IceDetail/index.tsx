import './style.scss';
import {TMatch} from '@core/services/Table';
import StatusBar from './status/status-bar';

// import {EStaticsType, EStaticsTypeName} from '@core/constants/enum/sport';
// import useMatchStatistics from '@core/hooks/sports/useMatchStatistics';

export default ({match}: { match: TMatch }) => {
  return (
    <div className="match-detail-ice-view flex flex-between">
      <div className='flex broke flex-between'>
        <StatusBar match={match} type = "home" home={0} text={'小罚'} />
        <StatusBar match={match} type = "home" home={0} text={'大罚'} />
      </div>
      <div className='flex broke flex-between'>
        <StatusBar match={match} type = "away" home={0} text={'大罚'} />
        <StatusBar match={match} type = "away" home={0} text={'小罚'} />
      </div>
    </div>
  );
};

