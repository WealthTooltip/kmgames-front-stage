import React from 'react';
import dayjs, {Dayjs} from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import styles from './style.scss';
import {DatePicker} from 'antd';
import {IconCalendar} from '../Icon';

dayjs.extend(customParseFormat);

const {RangePicker} = DatePicker;
export const dateFormat = 'YYYY/MM/DD';

interface propTypes {
  value: Dayjs[];
  handleChange: (dates: Dayjs[]) => void;
}
function DpDateRangePicker({value, handleChange}: propTypes) {
  const [beginTime, endTime] = value;

  return (
    <div className={styles.dp_date_range_picker}>
      <RangePicker
        value={[beginTime, endTime]}
        format={dateFormat}
        allowClear={false}
        suffixIcon={<IconCalendar />}
        onCalendarChange={handleChange}
        style={{fontSize: 12}}
        popupStyle={{fontSize: 12}}
      />
    </div>
  );
};

export default React.memo(DpDateRangePicker);
