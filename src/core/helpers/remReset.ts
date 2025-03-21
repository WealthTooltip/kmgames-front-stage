/*
 * @Description: 动态计算H5 REM
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-14 13:11:43
 * @LastEditors: Passion.KMG
 */

export default () => {
  const docEl = document.documentElement;
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  const recalc = function() {
    const {clientWidth} = docEl;
    if (!clientWidth) return;
    docEl.style.fontSize = `${16 * (clientWidth / 320)}px`;
    document.body.style.height = `${docEl.clientHeight - 1000}px`;
    document.body.style.width = `${docEl.clientWidth}px`;
  };
  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  recalc();
};
