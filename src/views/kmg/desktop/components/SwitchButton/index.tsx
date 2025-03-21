import {useMemo} from 'react';
import classNames from 'classnames';
import styles from './style.scss';
import {ValuedItemsProp} from '@core/constants/enum/sport/view-options';

interface IProps {
  items: ValuedItemsProp[];
  value: number | string;
  onChange: (value: number | string) => void;
  className?: string;
  type?: 'button';
  disabled?: boolean;
}

function DpSwitchButton({
  items, value, onChange, className, type, disabled,
}: IProps) {
  const idx = useMemo(() => items.findIndex((item) => item.value === value), [items, value]);

  return (
    <div className={classNames(styles.dp_switch_button, className, {open: idx > 0, disabled, [`type-${type}`]: !!type})}>
      {
        items.map((item) => (
          <button
            className={classNames({active: item.value === value})}
            onClick={() => onChange(item.value)}
            key={item.value}
          >
            {item.label}
          </button>
        ))
      }
    </div>
  );
}

export default React.memo(DpSwitchButton);
