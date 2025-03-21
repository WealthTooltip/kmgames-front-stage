/*
 * @Description: 遮罩
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-13
 * @LastEditors: jspassion@itcom888.com
 */

import {createPortal} from 'react-dom';
import css from './overlay.scss';

interface IProps {
  children: any,
  display: boolean,
  zIndex?: number,
  close?: Function,
  closeOnClickBlank?: boolean
}

const Overlay = ({
  children, display, zIndex, close, closeOnClickBlank = true,
}: IProps) => {
  const thisNode = React.useRef<any>(document.createElement('div'));
  thisNode.current.className = `${css.wrapper} ${display ? 'block' : 'hidden'} global-overlay`;
  if (zIndex === 0) {
    thisNode.current.style.zIndex = 0;
  } else {
    thisNode.current.style.zIndex = zIndex || 10;
  }

  // 使用Portal脱离文档流
  React.useEffect(() => {
    document.body.appendChild(thisNode.current);
    return () => {
      window.document.body.removeChild(thisNode.current);
    };
  }, []);

  return (
    createPortal(
        <>
          { close && display && closeOnClickBlank && <div className="close" onClick={() => close()} /> }
          { display && children }
        </>,
        thisNode.current,
    )
  );
};

export default Overlay;
