/*
 * @Description: ACTION入口，可以通过 import * as Actions from 来一次性导入所有的ACTION
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-15 16:15:02
 * @LastEditors: Passion.KMG
 */

import * as BASE from './baseAction';
import * as USER from './userAction';
import * as SPORT from './sportAction';
import * as DASHBOARD from './dashboardAction';

export default {
  BASE,
  USER,
  SPORT,
  DASHBOARD,
};
