
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, home, away}: { match: TMatch, home: number, away: number }) => {
  const width = 106;
  return (
    <div className="status-basket-bar flex flex-between items-center">
      <div className="status-blank" style={{width: width}}>
      </div>
      <span className='status-right-text'>{home}</span>
    </div>
  );
};

