/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/apis/index.ts
 * @Description: API地址获取封装
*/
import base from './api-base';
import user from './api-user';
import sport from './api-sport';
import dashboard from './api-dashboard';

export const getURL = (key: string, params: Array<string | number>): string => {
  const apis: any = _.merge({...base}, {...user}, {...sport}, {...dashboard});
  let result = apis[key] || null;

  if (!result) {
    throw new Error(`没有找到API-KEY对应的接口地址：${key}`);
  }

  // URL 上参数的组装
  if (params.length > 0) {
    _.each(params, (value: string) => {
      result = result.replace('$', _.isNull(value) || _.isUndefined(value) ? '' : value);
    });
  }

  return process.env.API_PREFIX + result;
};
