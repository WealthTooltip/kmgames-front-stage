import {Skeleton} from 'antd';
import classnames from 'classnames';
import styles from './style.scss';

const MatchSkeleton: React.FC = () => (
  <div className={classnames(styles.match, 'mb-30')}>
    <div className="flex items-center mb-16">
      <Skeleton.Avatar size="small" className="mr-10" active />
      <Skeleton.Input size="small" className="mr-20" active />
      <Skeleton.Input size="small" active block />
    </div>
    <div className="flex items-center mb-16">
      <Skeleton.Avatar size="small" className="mr-10" active />
      <Skeleton.Input size="small" className="mr-20" active />
      <Skeleton.Input size="small" active block />
    </div>
    <Skeleton.Input active block />
  </div>
);

export default MatchSkeleton;
