
import './style.scss';
import {TMatch} from '@core/services/Table';

export default ({match, type, home, text}: { match: TMatch, type: String, home: number, text: String }) => {
  const width = 80;
  return (
    <>
      {
        type == 'home' ? (
          <div className="status-tennis-bar flex flex-col items-center">

            <span className='status-red-text'>{home}</span>
            <div className="status-tennis-red" style={{width: width}}>
            </div>
            <span className='hint-text'>{text}</span>
          </div>) : (
          <div className="status-tennis-bar flex flex-col items-center">

            <span className='status-blue-text'>{home}</span>
            <div className="status-tennis-blue" style={{width: width}}>
            </div>
            <span className='hint-text'>{text}</span>
          </div>
        )
      }
    </>
  );
};

