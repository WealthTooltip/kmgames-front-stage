// @ts-nocheck
/**
 * target: 国际化处理目标 - 可以是 React Element / String
 * params: 参数
 * opts: 可选预留
*/

import md5 from 'md5';
import G from '@constants/global';
import {uniq} from 'lodash';
import language from '@my/assets/language';

interface IOptions{
  symbol?: string,
  kw?: string
}
export const $t = (target: string | React.ReactNode, params: Object = {}, {symbol = '#', kw = ''}: IOptions = {}) => {
  window.__TRANS_OUTPUT__ = window.__TRANS_OUTPUT__ || [];

  // 开发类型错误校验
  if (typeof target !== 'object' && typeof target !== 'string') {
    console.warn('国际化TARGET参数类型错误！', target);
    return target;
  }
  if (typeof target === 'object' && typeof target.$$typeof !== 'symbol') {
    console.warn('国际化对象非Symbol(react.element)', target);
    return target;
  }

  // HOC 带符号的替换函数
  const replaceFn = replace(symbol, params);

  let res: any = target;

  // Symbol(react.element) 处理
  if (typeof target === 'object') {
    res = React.cloneElement(target, {}, rebuildReactElement(target.props.children, replaceFn));
  }

  // string 处理
  if (typeof target === 'string') {
    window.__TRANS_OUTPUT__.push(target);
    res = replaceFn(target);
  }

  // 开发时使用，用于快速构建语言文件
  if (__DEV__ && window.__TRANS_OUTPUT__.length > 0) {
    // 从language中获取中文词条
    const keys = _.map(language, 'zh-CN');
    const output = JSON.stringify(_.uniq(_.filter(window.__TRANS_OUTPUT__, (item: string) => !_.includes(keys, item))));
    if (output !== '[]') {
      console.group(`翻译词条${kw && ` - ${kw}`}:`);
      console.log(output.substr(1, output.length - 2));
      console.groupEnd();
    }
  }

  return res;
};

// 递归深度遍历每一个DOM节点
const rebuildReactElement = (children: Array<any> | string | null | undefined, replaceFn: Function): any => {
  if (_.isUndefined(children) || children === null) {
    return null;
  }
  if (typeof children === 'number') {
    return children;
  }
  if (typeof children === 'string') {
    window.__TRANS_OUTPUT__.push(children);
    window.__TRANS_OUTPUT__ = uniq(window.__TRANS_OUTPUT__);
    return replaceFn(children);
  }
  if (typeof children === 'object' && typeof children.$$typeof === 'symbol') {
    return React.cloneElement(children, {key: `i18n-${children.key || 0}`}, rebuildReactElement(children.props.children, replaceFn));
  }
  const cloneChildren: any = [];
  _.each(children, (item: any, index: number): any => {
    if ((_.isUndefined(item) || item === null) || (typeof item !== 'string' && typeof item !== 'object' && typeof item !== 'number')) {
      return true;
    }
    if (typeof item === 'number') {
      cloneChildren.push(item);
    } else if (typeof item === 'string') {
      window.__TRANS_OUTPUT__.push(item);
      window.__TRANS_OUTPUT__ = uniq(window.__TRANS_OUTPUT__);
      cloneChildren.push(replaceFn(item));
    } else if (typeof item === 'object' && typeof item.$$typeof === 'symbol') {
      cloneChildren.push(React.cloneElement(item, {key: `i18n-${item.key || index}`}, rebuildReactElement(item.props.children, replaceFn)));
    } else if (item instanceof Array) {
      cloneChildren.push(rebuildReactElement(item, replaceFn));
    }
  });
  return cloneChildren;
};

// 文字替换 key - value
const replace = (symbol: string, params: any) => (text: string): String => {
  let result = _.get(window.$I18N_FILE, `["${md5(text).substr(0, 16)}"]["${G.GET('LANGUAGE')}"]`) ||
               _.get(window.$I18N_FILE, `["${md5(text).substr(0, 16)}"]["zh-CN"]`) || text;
  // 变量替换
  const regex = eval(`/\\${symbol}(.+?)\\${symbol}/g`);
  const res = result.match(regex);
  if (res && res.length > 0) {
    _.each(res, (item: string) => {
      result = _.replace(result, item, params[item.slice(1, item.length - 1)]);
    });
  }
  return result;
};

export default $t;
