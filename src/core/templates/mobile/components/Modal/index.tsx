/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: jspassion@itcom888.com
 * @FilePath: /kmg/src/core/templates/mobile/components/Modal/index.tsx
 * @Description:
*/
import {useDispatch, useSelector} from 'react-redux';
import ACTIONS from '@actions/index';
import Overlay from '../Overlay';

import css from './modal.scss';

function Modal() {
  const dispatch = useDispatch();
  const {
    display, title, content, className, actions,
  } = useSelector((state: any) => state.base.modal);

  const close = () => dispatch(ACTIONS.BASE.closeModal());

  const BtnColor = (item: any) => (item.className === 'cancel' ? 'default' : 'secondary');

  const actionsClone = _.chain(actions).cloneDeep().value();

  return (
    <>
      {
        display &&
        (
          <Overlay zIndex={200} display>
            <div className={`${css.wrapper} ${className}`}>
              <div className="header">
                <div>
                  { title }
                </div>
              </div>
              <div className="line" />
              {
              // 字符串则直接使用innerHTML, 否则使用 react.child
              typeof content === 'string' ?
                <div className="contents" dangerouslySetInnerHTML={{__html: content}} /> :
                <div className="contents">{content}</div>
              }
              <div className="actions">
                {
                  actionsClone.map((item: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        !item.keepOpen && close(); item.cb && item.cb();
                      }}
                      className={`${item.type || 'yes'}`}
                      color={BtnColor(item)}
                    >
                      {item.text}
                    </button>
                  ))
                }
              </div>
            </div>
          </Overlay>
        )
      }
    </>

  );
}

export default Modal;
