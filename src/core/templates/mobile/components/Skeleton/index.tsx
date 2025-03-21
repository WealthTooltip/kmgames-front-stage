/*
 * @Author: Galen.GE
 * @Date: 2024-01-16 18:22:59
 * @LastEditors: Galen.GE
 * @FilePath: /KMG/src/core/templates/mobile/components/Skeleton/index.tsx
 * @Description:
 */
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import style from './style.scss';
import classnames from 'classnames';

interface IProps {
  size?: number;
}
export const MatchListSkeleton = ({size = 3}: IProps) => {
  return (
    <>
      {
        _.times(size).map((item) => {
          return <MatchListSkeletonItem key={item} />;
        })
      }
    </>
  );
};

export const MatchListSkeletonItem = () => {
  return (
    <div className={classnames({margin: '20px'}, style.wrapper)}>
      <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Skeleton width={200} height={20} />
      </div>
      <div style={{marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
      </div>
    </div>
  );
};
