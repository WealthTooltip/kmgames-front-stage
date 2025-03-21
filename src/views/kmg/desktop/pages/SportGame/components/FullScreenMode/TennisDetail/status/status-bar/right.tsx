
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, type, home}: { match: TMatch, type: String, home: number }) => {
  const width = 80;
  return (
    <div className='items-center'>
      <div className="status-tennis-bar flex flex-col items-center">
        {type == 'away' ?
          (<><span className='status-red-text'>{home}%</span>
            <div className="status-tennis-red" style={{width: width}}>
            </div></>
          ) : (<><span className='status-blue-text'>{home}%</span>
            <div className="status-tennis-blue" style={{width: width}}>
            </div></>)}

      </div>
    </div >
  );
};

