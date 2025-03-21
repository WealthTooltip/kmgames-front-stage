
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, home, away}: { match: TMatch, home: number, away: number }) => {
  const width = 106;
  return (
    <div className="status-bar flex flex-between items-center">
      <div className="status-right" style={{width: width * away / (home + away) + 'px'}}>
      </div>
      <div className="status-left" style={{width: width * home / (home + away) + 'px'}}>
      </div>
      <span className='status-right-text'>{away}</span>
    </div>
  );
};

