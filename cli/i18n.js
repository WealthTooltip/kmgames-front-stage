/*
 * @Description: 生成语言文件
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditors: Passion.KMG jspassion@itcom888.com
 * @LastEditTime: 2023-12-18 17:48:02
 */
const path = require('path');
var walk = require('walk');
var _ = require('lodash');
var fs = require('fs');
var md5 = require('md5');

module.exports = function(platform, langs){
   makeFiles(langs, platform)
}

function makeFiles(types, platform) {

  var files = []
  var walker = walk.walk(path.resolve(__dirname, `../src/`), { followLinks: false });

  walker.on('file', function (roots, stat, next) {
    var file = `${roots}/${stat.name}`.replace(/\\/g, "/");
    files.push(file);
    next();
  });

  walker.on('end', function () {
    const workFiles = _.filter(files, (item) => {
      if(_.includes(item, 'lang-entries.ts')){
        if(_.includes(item, '/core/') || _.includes(item, `views/${platform}`)){
          return true
        }
      }
    });
    let fields = [];
    // 循环合并目录下所有语言文件
    _.each(workFiles, (item) => {
      const data = fs.readFileSync(item, 'utf-8');
      fields = _.concat(fields, eval(data));
    })
    // 已有语言文件变更
    let result = {};
    // 未翻译的部分（词条从未被收录部分）
    let noTrans = {};
    let ref = {};
    try{
      const old = fs.readFileSync(`../src/views/${platform}/assets/language/index.ts`, 'utf-8').split('export default')[1];
      ref = eval('(' + old + ')');
    }catch(e){
      console.log('# 旧版语言文件不存在 #');
    }
    _.each(_.uniq(fields), (key) => {
      _.each(types, (item) => {
        var md5Key = md5(key).substr(0, 16);
        if(item === 'zh-CN'){
          result[md5Key] = result[md5Key] || {};
          result[md5Key][item] = key;
          return true;
        }
        if(ref[md5Key] && ref[md5Key][item]){
          result[md5Key] = result[md5Key] || {};
          result[md5Key][item] = ref[md5Key][item] || '';
        }else{
          noTrans[md5Key] = noTrans[md5Key] || result[md5Key] || {};
          noTrans[md5Key][item] = ''
        }
      })
    })
    // 踢出空词条
    _.each(_.cloneDeep(result), (item, key) => {
      if(noTrans[key]){
        delete result[key]
      }
    })
    // 中文简体单独生成空文件
    fs.writeFileSync(
      `../src/views/${platform}/assets/language/index.ts`,
      `${tips}export default \n` + JSON.stringify({...result, ...noTrans}, null, 2),
      {flag: 'w', encoding: 'utf-8', mode: '0666'}
    )
    console.log(`# 已生成语言文件 #`)
  });
}

const tips = `
/**
 * 翻译注意事项
 * 1. 请将词条按照语言进行翻译
 * 2. 保留井号(#)内容到合适的位置，示例："您还有#money#余额可用" ---替换--> "your balance is #money#
 * 3. 请勿变更每行每个词条的HASH KEY
 * 4. 对应语言与编号：zh-HK -> 中文繁体 / en-US -> 英文 / th -> 泰语 / hi -> 印地语 / vi -> 越南语 / ko -> 韩语 / ja -> 日语 / zh-CN -> 中文简体
*/\n
`
