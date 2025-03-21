import React from 'react';
import styles from './style.scss';
import classNames from 'classnames';
import DpIcon from '@views/kmg/mobile/components/Icon';

export default React.memo(({onClick}:{onClick : () => void}) => {
  return (
    <div className={classNames('detail-btn', styles.wrapper)} onClick={onClick}>
      查看详情
      <DpIcon type='arrowNext'/>
    </div>
  );
});
