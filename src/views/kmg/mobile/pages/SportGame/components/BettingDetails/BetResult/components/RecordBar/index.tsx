import classNames from 'classnames';
import styles from './style.scss';
import {EStaticsType} from '@core/constants/enum/sport';
import useTheme from '@core/hooks/useTheme';
import {ETHEME} from '@views/kmg/desktop/configs';


interface record {
  type: EStaticsType;
  num: number;
}

interface IProps{
  data: record[];
}

function DpRecordBar(recordData: IProps) {
  const {theme} = useTheme();
  return (
    <div className={classNames(styles.dpRecordBar)}>
      {recordData.data.map((record, idx)=>{
        return (
          <div key={idx} className='record-body'>
            <div className='record-img'>
              <img
                src={require(`../../i/${record.type}${theme === ETHEME.DARK ? '_dark' : ''}.png`)}
                alt={record.type}
              />
            </div>
            <div className='record-num'>
              {record.num}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DpRecordBar;
