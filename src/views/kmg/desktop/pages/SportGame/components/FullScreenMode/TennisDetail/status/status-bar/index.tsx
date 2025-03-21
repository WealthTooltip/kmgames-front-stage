
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, home, type, text}: { match: TMatch, home: number, type: String, text: String }) => {
  const width = 80;
  return (
    <div className="status-tennis-bar flex flex-col items-center">

      {type == 'home' ? (<><span className='status-blue-text'>{home}</span><div className="status-tennis-blue" style={{width: width}}>
      </div></>) : (<><span className='status-red-text'>{home}</span><div className="status-tennis-red" style={{width: width}}>
      </div></>)}

      <span className='hint-text'>{text}</span>
    </div>
  );
};

