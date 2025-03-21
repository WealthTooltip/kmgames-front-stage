/*
 * @Description: 弹出层
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @LastEditTime: 2023-12-14 10:58:43
 */

import Overlay from '../Overlay';
import css from './popup.scss';

interface IProps {
  display: boolean
  zIndex?: number
  height?: string
  width?: string
  title: string
  close?: Function
  header?: React.ReactElement
  children: any
  sharp?: boolean
  className?: string
  top?: string
}
export default function({
  display = false,
  sharp = false,
  zIndex = 100,
  height = '',
  width = '',
  title,
  close,
  header,
  children,
  className,
  top = '',
}: IProps) {
  if (!display) return (<></>);
  return (
    <Overlay zIndex={zIndex} display={display}>
      <div className={css.wrapper}>
        {close && <div className={css.cover} onClick={() => close()} />}
        <div
          className={`popup-wrapper ${sharp && 'sharp'}`}
          style={{
            height,
            width,
            top,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {header || (
            <div className="title">
              {close && <span onClick={() => close()}>X</span>}
              {title}
              <div className="line" />
            </div>
          )}
          <div className={`wrapper ${className}`}>{children}</div>
        </div>
      </div>
    </Overlay>
  );
}
