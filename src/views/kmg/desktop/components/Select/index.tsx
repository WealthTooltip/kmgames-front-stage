/*
 * @Author: Passion.KMG
 * @Date: 2024-01-10 20:08:36
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/desktop/components/Select/index.tsx
 * @Description:
 */
import classnames from 'classnames';
import {Select} from 'antd';
import styles from './style.scss';
import DpIcon from '../Icon';

interface IProps {
  options: {
    value: string | number;
    label: string;
  }[];
  onChange?: (value: string | number) => void;
  defaultValue?: string | number;
  value?: string | number;
  style?: React.CSSProperties;
  className?: string;
  label?: string;
  maxLength?: number
}

function DpSelect({
  options, onChange, value, defaultValue, style, className, label, maxLength,
}: IProps) {
  const passedContent = (value: string) => {
    if (!value) {
      return '';
    }
    if ( value.length > maxLength) {
      return value.slice(0, maxLength - 3) + '...';
    }
    return value;
  };
  return (
    <div className={classnames(styles.dp_select, className)}>
      { label && <span className="label">{ label }</span>}
      <div className="flex items-center">
        <span className="value">{passedContent(_.find(options, {value})?.label)}</span>
        <DpIcon type="arrow" />
      </div>
      <Select
        options={options}
        value={value}
        onChange={(val) => onChange(val)}
        defaultValue={defaultValue}
        style={style}
      />
    </div>
  );
}

export default React.memo(DpSelect);
