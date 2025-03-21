import React from 'react';
import styles from './style.scss';
import classNames from 'classnames';
interface Props {
  type: 'home' | 'away',
  value : number,
}

export default React.memo((props:Props) => {
  const homevalue = props.value*168/50;
  const awayvalue = 168-props.value*168/50;

  if (props.type === 'home') {
    return (
      <div className={classNames(styles.wrapper, 'red')}>
        <div className='rest' style={{width: homevalue +'px'}}></div>
      </div>
    );
  } else {
    return (
      <div className={classNames(styles.wrapper, 'yellow')}>
        <div className='rest' style={{width: awayvalue + 'px', right: '0px', position: 'absolute'}}></div>
      </div>
    );
  }
});
