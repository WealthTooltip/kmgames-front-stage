/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 14:10:32
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/templates/mobile/components/SwitchButton/index.tsx
 * @Description:
 */
import {useState} from 'react';
import css from './style.scss';

interface IProps {
  options: Array<{label: string; value: string}>;
  checked: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  checkedIcon?: React.ReactNode;
  width?: number;
}
export default ({...props}: IProps) => {
  const {options, checked, style={}, width, onChange, className=''} = props;
  const [slidePosition, setSlidePosition] = useState<number>(0);

  const handleClick = (value: string, index: number) => {
    onChange(value);
    const newPosition = index * (100 / options.length);
    setSlidePosition(newPosition);
  };

  return (
    <div className={`${css.wrapper} ${className}`} style={style}>
      <div className='switch-body'>
        {options.map((item, idx) => (
          <div
            className={`item ${checked === item.value && 'active'}`}
            style={{...style, width: `${width}px`}}
            key={item.value}
            onClick={() => handleClick(item.value, idx)}>
            {item.label}
          </div>
        ))}
        <div className={`up-btn ${checked}`} style={{left: `${slidePosition}%`, width: `${width}px`}}>
          <span>
            {options.find((item) => item.value === checked)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};
