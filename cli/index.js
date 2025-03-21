#!/usr/bin/env node
const inquirer = require('inquirer');
const spawn = require('child_process').spawn;
const i18n = require('./i18n');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const md5 = require('md5');

console.log('\n# 前端自动化构建 CLI #\n');

var saveAnswers = {};

inquirer.prompt([
  {
    type: 'list',
    name: 'todo',
    message: '请选择执行任务',
    choices: ['编译/打包/开发模式', '生成语言文件', '影子组件工具'],
  }
]).then(answers => {
  if(answers.todo === '编译/打包/开发模式'){
    build();
    return;
  }
  if(answers.todo === '影子组件工具'){
    shadowComponent();
    return;
  }
  if(answers.todo === '生成语言文件'){
    makeI18n();
    return;
  }
})


const shadowComponent = () => inquirer.prompt([
  {
    type: 'list',
    name: 'shadow',
    message: '请选择所想要使用的功能',
    choices: [
      '生成新的影子组件',
      '获取影子组件依赖关系'
    ]
  }
]).then(answers => {
  if(answers.shadow === '生成新的影子组件'){
    createNewShadow();
  }
  if(answers.shadow === '获取影子组件依赖关系'){
    checkShadowState();
  }
})

const checkShadowState = () => inquirer.prompt([
  {
    type: 'input',
    name: 'path',
    message: '请输入目标组件完整路径，可在VS资源管理器中右键点击组件文件，选择复制路径\n例：C:\\git-data\\web-main\\src\\core\\templates\\desktop\\components\\Captcha\\index.tsx\n'
  }
]).then(answers => {
  if(answers.path.search(/src\\core\\templates\\(desktop|mobile)\\components\\/) === -1){
    console.error('× 输入的路径有误')
    return;
  }
  fs.exists(answers.path, (result) => {
    if(!result){
      console.error('× 文件不存在');
      return;
    }
    // 所有项目
    const platforms = _.chain(PLATFORM).values().map('alias').value();
    // 客户端类型
    const client = answers.path.split('templates')[1].split('\\')[1];
    // 相对路径
    const basePath = answers.path.split('components\\')[1];
    _.each(platforms, (item) => {
      if(!fs.existsSync(`..\\src\\views\\${item}\\${client}\\shadow\\${basePath}`)){
        console.log(fontRed, `× ${item}平台文件不存在，请使用CLI工具重新生成影子组件`);
        return;
      }
      const content = fs.readFileSync(`..\\src\\views\\${item}\\${client}\\shadow\\${basePath}`, 'utf-8');
      if(content.search(/export.*\(.*\).*\=>/) !== -1 || content.length > 500){
        console.log(fontYellow, `× 平台：【${item}】为独立引用，路径：${path.resolve(__dirname, '../src/views/' + item + '/' + client + '/shadow/' + basePath)}`);
      }else{
        console.log(fontGreen, `√ 平台：【${item}】为引用CORE目录中公共组件`);
      }
    })
  })
})


const createNewShadow = () => inquirer.prompt([
  {
    type: 'input',
    name: 'path',
    message: '请输入目标组件完整路径，可在VS资源管理器中右键点击组件文件，选择复制路径\n例：C:\\git-data\\web-main\\src\\core\\templates\\desktop\\components\\Captcha\\index.tsx\n'
  }
]).then(answers => {
  console.log(answers.path.search(/\\src\\core\\templates\\(desktop|mobile)\\components\\/) === -1)
  console.log(answers.path.search(/\/src\/core\/templates\/(desktop|mobile)\/components\//) === -1)
  if(answers.path.search(/\\src\\core\\templates\\(desktop|mobile)\\components\\/) === -1 &&
     answers.path.search(/\/src\/core\/templates\/(desktop|mobile)\/components\//) === -1){
    console.error(fontRed, '× 输入的路径有误')
    return;
  }
  fs.exists(answers.path, (result) => {
    if(!result){
      console.error(fontRed, '× 文件不存在');
      return;
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'confirm',
        message: '确定为所有平台对应客户端创建影子组件？',
        choices: [
          '确认生成',
          '取消'
        ]
      }
    ]).then(ans => {
      if(ans.confirm === '确认生成'){
        // 所有项目
        const platforms = _.chain(PLATFORM).values().map('alias').value();
        // 路径类型
        const windowsStyle = answers.path.search(/\\src\\core\\templates\\(desktop|mobile)\\components\\/) > -1;
        // 客户端类型
        const client = windowsStyle ? answers.path.split('templates')[1].split('\\')[1] : answers.path.split('templates')[1].split('\/')[1];
        // 相对路径
        const basePath = windowsStyle ? answers.path.split('components\\')[1] : answers.path.split('components\/')[1];
        _.each(platforms, (item) => {
          if(windowsStyle){
            // TSX
            writeFileSyncRecursive(
              `..\\src\\views\\${item}\\${client}\\shadow\\${basePath}`,
              `${shadowTips}import Ref from '@template/components/${basePath.replace(/\\/g, '/').replace(/\.tsx/g, '')}'; \n\nexport default Ref;`
            )
            // SCSS
            writeFileSyncRecursive(
              `..\\src\\views\\${item}\\${client}\\shadow\\${basePath.split('\\').filter((item, index) => index != basePath.split('\\').length - 1).join('/')}\\style.scss`,
              `${shadowTips}`
            )
          }else{
            // TSX
            writeFileSyncRecursive(
              `..\/src\/views\/${item}\/${client}\/shadow\/${basePath}`,
              `${shadowTips}import Ref from '@template/components/${basePath.replace(/\\/g, '/').replace(/\.tsx/g, '')}'; \n\nexport default Ref;`
            )
            // SCSS
            writeFileSyncRecursive(
              `..\/src\/views\/${item}\/${client}\/shadow\/${basePath.split('\/').filter((item, index) => index != basePath.split('\/').length - 1).join('/')}\/style.scss`,
              `${shadowTips}`
            )
          }
        })
      }
    })
  })
})


const build = () => inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: '请选择构建模式',
    choices: ['开发模式', '生产模式'],
  },
  {
    type: 'list',
    name: 'platform',
    message: '请选择构建平台',
    choices: ['KMG'],
  },
  {
    type: 'list',
    name: 'client',
    message: '请选择客户端类型',
    choices: ['PC-桌面端', 'H5-移动端'],
  }
]).then(answers => {
  const cacheVersion = md5(`cache-${_.now()}`).substring(0, 8);
  answers = {...answers, ...saveAnswers};
  if(answers.type === '开发模式'){
    run({answers, cacheVersion, cacheControl: 'clear'});
    return;
  }
  inquirer.prompt([
    {
      type: 'list',
      name: 'confirm',
      message: `确认打包【${answers.platform}】【${answers.client}】`,
      choices: ['确认', '取消'],
    },
  ]).then(an => {
    if(an.confirm === '取消'){
      console.log('\n # 编译取消 #');
      return;
    }
    run({answers, cacheVersion, cacheControl: 'clear'});
  })
});


// 脚本执行
const run = ({answers, cacheVersion}) => {
  const { type, platform, client } = answers;
  const shell = `${TYPES[type].command} --config deployment/webpack-${TYPES[type].conf}.js --mode ${TYPES[type].conf} --env alias=${PLATFORM[platform].alias}-${CLIENT[client]} --env cachev=${cacheVersion || ''} --env --env env=${TYPES[type].env}`
  // 启动脚本
  console.log(shell);
  var child = spawn(shell, {cwd: '../', shell: true});
  // 脚本输出
  child.stdout.on('data', function (data) { process.stdout.write(data.toString());  });
  // 结束
  child.on('close', function () {
    console.log("# 编译结束 #");
  });

}

const makeI18n = () => inquirer.prompt([
  {
    type: 'list',
    name: 'platform',
    message: '请选择构建平台',
    choices: [..._.chain(PLATFORM).map((item, key) => ({...item, name: key})).filter((item) => item.langs).map('name').value()],
  }
]).then(answers => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'confirm',
      message: `确认生成语言包吗？`,
      choices: ['确认生成', '取消'],
    }
  ]).then(ans => {
    if(ans.confirm === '取消'){
      return;
    }
    console.log('# 开始生成语言文件 #')
    const makeL = _.chain(LANG).pick(PLATFORM[answers.platform].langs).values().value();
    i18n(PLATFORM[answers.platform].alias, makeL)
  })
})

// 语言表
const LANG = {
  ['中文（简体）']: 'zh-CN',
  ['中文（繁体）']: 'zh-HK',
  ['英文']: 'en-US',
  ['泰文']: 'th',
  ['印地语（印度）']: 'hi',
  ['越南语']: 'vi-VN'
}

// 平台
const PLATFORM = {
  ['KMG']: {
    alias: 'kmg',
    langs: ['中文（简体）', '英文']
  }
}

// 客户端
const CLIENT = {
  ['H5-移动端']: 'h5',
  ['PC-桌面端']: 'pc'
}

// 打包类型
const TYPES = {
  ['开发模式']: {
    command: 'webpack-dev-server',
    conf: 'development',
    env: 'dev'
  },
  ['生产模式']: {
    command: 'webpack',
    conf: 'production',
    env: 'prod'
  }
}

// 影子组件TIPS
const shadowTips = `
/**
 * 该文件由CLI自动生成，创建于：${new Date()}
*/
`

const fontRed = "\x1b[31m%s\x1b[0m";
const fontGreen = "\x1b[32m%s\x1b[0m";
const fontYellow = "\x1b[33m%s\x1b[0m";

const writeFileSyncRecursive = (filename, content) => {
  if(fs.existsSync(filename)){
    console.log(fontRed, `× 该文件已存在：${path.resolve(__dirname, filename)}`);
    return;
  }
  const folders = filename.split(path.sep).slice(0, -1);
  if (folders.length) {
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }
      return folderPath
    })
  }
  fs.writeFileSync(filename, content);
  console.log(fontGreen, `√ 已生成影子文件： ${path.resolve(__dirname, filename)}`);
}



module.exports = { LANG, PLATFORM }
