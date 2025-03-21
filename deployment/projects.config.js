/*
 * @Description: 启动配置文件，各个平台都使用该文件进行打包自定义
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-18 17:44:59
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 */
const path = require( 'path' );
const outputPath = path.resolve('dist' )

module.exports = function ( alias, client ) {
  const CONFIG = {
    kmg: {
      api: {
        // local: 'https://kmgfront.kmgdev1.com/',       // 开发环境
        local: 'http://www.dpfat.com/',      // 测试环境
        // local: 'https://www.dpuat.com/',      // UAT环境
        fat: 'http://kmgfront.kmgfat.com/',      // 测试环境
        desktop: {
          dev: '/',      // 测试 dev
          uat: '/',               // 测试 uat(预发布/灰度)
          prod: '/'               // 生产 prod
        },
        mobile: {
          dev: '/',
          uat: '/',
          prod: '/'
        }
      },
      apiVersion: '',
      entry: client === 'pc' ? 'kmg/desktop' : 'kmg/mobile',
      client: client === 'pc' ? 'desktop' : 'mobile',
      name: 'KMG',
      base: 'kmg',
      htmlName: 'index.html',
      buildPath: client === 'pc' ? path.resolve('dist/dpgames-web') : path.resolve('dist/dpgames-h5'),
      buildDir: client === 'pc' ? 'dpgames-web' : 'dpgames-h5',
    },
  }
  return CONFIG[alias];
}
