/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13 18:24:37
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/middleware/_httpMiddlewareTypes.ts
 * @Description:
 */

// 请求错误枚举
export enum EResponseErrors {
  NO_AUTH = '登录超时，请重新登录',
  KICKED = '账号已在其他地方登录，请重新登录',
  REJECT = '登录受限',
  SAME_REQ = '重复提交',
  TOO_MANY_REQ = '请求太频繁',
}

// 请求方法枚举
export enum ERequestMethods { GET = 'GET', PUT = 'PUT', POST = 'POST', DELETE = 'DELETE' }

// 请求对象
export interface IRequest {
  url : string;
  method : ERequestMethods;
  nonce : string;
  data? : any;
  params? : any;
  headers?:{[any:string]: string} | null
}

export interface ICache {
  expires : number; // 缓存有效时间（秒）
  forward : boolean; // 有缓存时，是否在使用缓存后仍然进行请求
  isUserBind? : boolean; // 缓存是否绑定 USER，切换USER则缓存失效
  cacheClear? : boolean; // 废弃当前缓存
}

/**
 * 请求构造函数
 * @param key 地址对应的KEY
 * @param urlParams URL上的参数
 * @param method 请求方法
 * @param loading 是否需要LOADING
 * @param cache 是否缓存 - expires：缓存有效时间（秒）forward：使用缓存后，是否仍然发起请求更新最新资源
 * @param timeout 自定义超时时间 单位 s
 * @param timeoutCallback 自定义超时回调函数
 * @param maxRetry 最大重试次数
 */
export interface IPayload {
  key : string;
  method : ERequestMethods;
  urlParams? : Array<string | number>;
  params? : any;
  data? : any;
  loading? : boolean | string;
  cache? : ICache;
  timeout? : number;
  timeoutCallback? : Function;
  maxRetry? : number;
  mock? : Function | Object;
  cb? : Function;
  headers?:{[any:string]: string} | null;
  dataFix?: Array<{key: string, old: number | string, new: number | string}>;
  fieldFix?: Array<{old: string, new: string}>;
  // 补充参数
  other?: any;
}
