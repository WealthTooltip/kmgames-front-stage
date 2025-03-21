import {useMemo} from 'react';
import classNames from 'classnames';
import styles from './style.scss';

interface IProps {
  items: {
    label: string | React.ReactElement,
    value: number | string;
  }[];
  value: number | string;
  onChange: (value: number | string) => void;
  subItems: {
    label: string | React.ReactElement,
    value: number | string;
  }[];
  subValue: number | string;
  subOnChange: (value: number | string) => void;
  hideSub?: boolean;
  className?: string;
  type?: 'button';
  disabled?: boolean;
}

function DpSwitchButton({
  items, value, onChange, subItems, subValue, hideSub, subOnChange, className, type, disabled,
}: IProps) {
  const idx = useMemo(() => items.findIndex((item) => item.value === value), [items, value]);

  return (
    <div className={classNames(styles.dp_switch_button, className, {open: idx > 0, disabled, [`type-${type}`]: !!type})}>
      <div className="main-switch">
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
      {!hideSub && (typeof value === 'string' && value.includes('sub-')) && (
        <div className="sub-switch">
          {
            subItems.map((item) => (
              <a
                className={classNames({active: item.value === subValue})}
                onClick={() => subOnChange(item.value)}
                key={item.value}
              >
                {item.label}
              </a>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default React.memo(DpSwitchButton);
