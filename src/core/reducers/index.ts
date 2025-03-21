/*
 * @Description: reducers 入口
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-15 15:56:16
 * @LastEditors: Passion.KMG
 */
import {combineReducers} from 'redux';

import base from './baseReducer';
import user from './userReducer';
import sport from './sportReducer';

const rootReducer = combineReducers({
  base,
  user,
  sport,
});

export default rootReducer;
