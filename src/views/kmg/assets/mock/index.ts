/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13 17:58:20
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/views/kmg/assets/mock/index.ts
 * @Description:
 */

export const baseRes = (fn: Function) => (...params: any) => ({
  code: 0,
  msg: 'success',
  data: fn(...params),
});

export default {

};
