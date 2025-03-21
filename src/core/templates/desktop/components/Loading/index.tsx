/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/templates/desktop/components/Loading/index.tsx
 * @Description:
*/
import {useSelector} from 'react-redux';
import Overlay from '../Overlay';

import css from './loading.scss';

export default function() {
  const loading = useSelector((state: any) => state.base.loading);

  return (
    <>
      {
        loading.display &&
        (
          <Overlay zIndex={300} display>
            <div className={css.wrapper}>
              <div className="text">
                <div className="lds-roller">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
                {loading.text}
              </div>
            </div>
          </Overlay>
        )
      }
    </>
  );
}
