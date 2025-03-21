
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, home, away}: {match: TMatch, home: number, away: number}) => {
  const width = 106;
  return (
    <div className="status-basket-bar flex flex-between items-center">
      <span className='status-text'>{home}</span>
      <div className="status-blank" style={{width: width}}>
      </div>
    </div>
  );
};

