
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, home, away}: {match: TMatch, home: number, away: number}) => {
  const width = 106;
  return (
    <div className="status-bar flex flex-between items-center">
      <span className='status-text'>{home}</span>
      <div className="status-left" style={{width: width * home / (home + away)}}>
      </div>
      <div className="status-right" style={{width: width * away / (home + away)}}>
      </div>
    </div>
  );
};

