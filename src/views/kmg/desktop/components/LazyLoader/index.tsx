/*
 * @Description: 懒加载 Suspense Feedback!
 * @Author: Passion.KMG
 * @Date: 2020-01-09 17:57:06
 * @LastEditTime: 2020-01-09 18:31:43
 * @LastEditors: Passion.KMG
 */
import {Suspense} from 'react';

import css from './style.scss';

interface IProps {
  width?: number | string,
  height?: number | string
}

export function LazyLoader({width = 'auto', height = 'auto'}: IProps) {
  return (
    <div className={css.wrapper} style={{width, height}}>
      <span />
    </div>
  );
}

export const SuspenseWrapper = (Component: any) => function() {
  return (
    <Suspense fallback={<LazyLoader />}>
      {
        Component
      }
    </Suspense>
  );
};

export default LazyLoader;
