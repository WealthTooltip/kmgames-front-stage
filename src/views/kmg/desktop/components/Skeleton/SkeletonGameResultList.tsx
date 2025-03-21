import {Skeleton} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';

const GameResultSkeleton: React.FC = () => (
  <div className={classnames(styles.gameResult)}>
    <Skeleton.Input active block />
  </div>
);

export default GameResultSkeleton;
