
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, home}: { match: TMatch, home: number }) => {
  const width = 80;
  return (
    <div className='items-center'>
      <div className="status-tennis-bar flex flex-col items-center">
        <span className='status-red-text'>{home}%</span>
        <div className="status-tennis-red" style={{width: width}}>
        </div>
      </div>
    </div>
  );
};

