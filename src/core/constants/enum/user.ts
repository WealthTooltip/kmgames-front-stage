/*
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG
 * @FilePath: /KMG/src/core/constants/enum/user.ts
 * @Description: 用户相关
 */

// 权限列表
export enum EPermission {
  // 无权限
  NONE = 'NONE',
  // 登录权限
  LOGIN = 'LOGIN',
  // 会员权限
  MEMBER = 'MEMBER',
  // 代理权限
  AGENT = 'AGENT',
  // 管理员权限
  ADMIN = 'ADMIN',
  // 超级管理员权限
  SUPER_ADMIN = 'SUPER_ADMIN'
}
