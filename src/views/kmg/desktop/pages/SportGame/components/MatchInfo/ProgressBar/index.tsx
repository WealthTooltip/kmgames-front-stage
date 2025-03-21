import React, {useMemo} from 'react';
import classnames from 'classnames';
import styles from './style.scss';

interface IProps {
  className?: string;
  homeValue?: number;
  awayValue?: number;
  title?: string;
  barWidth?:number;
}

interface IpProps {
  className?: string;
  activeValue:number;
  restValue:number;
  width?:number;
}

export default React.memo((props :IProps) => {
  return (
    <div className={classnames(styles.wrapper, props.className)}>
      <span className='value'>{props.homeValue}</span>
      <DpProgressBar activeValue={props.homeValue} restValue={props.awayValue} width={props.barWidth} />
      <span className='title'>{props.title}</span>
      <DpProgressBar activeValue={props.awayValue} restValue={props.homeValue} width={props.barWidth} className='away'/>
      <span className='value'>{props.awayValue}</span>
    </div>
  );
});

export const DpProgressBar = React.memo((props :IpProps) => {
  const {activeValue = 100, restValue = 50, width = 120} = props;
  const disabled = useMemo(() => {
    return activeValue === restValue && activeValue === 0;
  }, [activeValue, restValue]);
  return (
    <div className={classnames('progress', props.className, {disabled})} style={{width: width + 'px'}}>
      {
        !disabled &&
        <div className="active" style={{width: (100 * activeValue / (restValue + activeValue)) + '%'}}/>
      }
    </div>
  );
});
