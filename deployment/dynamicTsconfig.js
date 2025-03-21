/*
 * @Description: 动态生成tsconfig.json 让其可以动态识别当前平台
 * @Author: Passion.KMG
 * @Date: 2023-12-13
 * @LastEditTime: 2023-12-15 16:52:12
 * @LastEditors: Passion.KMG
 */

const fs = require('fs');

module.exports = function({myPath, client}){

  const config = {
    "compilerOptions": {
      "baseUrl": "src",
      "outDir": "deployment/dist",
      "module": "esnext",
      "target": "es6",
      "lib": ["es6", "dom"],
      "sourceMap": true,
      "allowJs": true,
      "jsx": "react-jsx",
      "allowUmdGlobalAccess": true,
      "moduleResolution": "node",
      "forceConsistentCasingInFileNames": true,
      "noImplicitReturns": true,
      "noImplicitThis": true,
      "noImplicitAny": true,
      "importHelpers": true,
      "strictNullChecks": false,
      "noUnusedLocals": true, // 未使用变量提示
      "allowSyntheticDefaultImports": true,
      "paths": {
        "@core/*": ["core/*"],
        "@views/*": ["views/*"],
        "@template/*": [`core/templates/${client}/*`],
        "@configs/*": ["core/constants/configs/*"],
        "@helpers/*": ["core/helpers/*"],
        "@constants/*": ["core/constants/*"],
        "@actions/*": ["core/actions/*"],
        "@schemas/*": ["core/schemas/*"],
        "@hooks/*": ["core/hooks/*"],
        "@libs/*": ["core/libs/*"],
        "@models/*": ["core/apis/models/*"],
        "@mocks/*": [`views/${myPath}/assets/mock/*`],
        "@my/*": [`views/${myPath}/*`],
        "@this/*": [`views/${myPath}/${client}/*`]
      }
    },
    "exclude": [
      "**/node_modules",
      "deployment",
      "scripts",
      "acceptance-tests",
      "webpack",
      "jest",
      "./src/core/libs",
      './src/core/templates/**/*'
    ],
    "include": [
      "./src/core/**/*",
      `./src/core/templates/${client}/**/*`,
      `./src/core/templates/public/**/*`,
      `./src/core/templates/static/**/*`,
      `./src/views/${myPath}/public/**/*`,
      `./src/views/${myPath}/${client}/**/*`,
    ]
  }

  fs.writeFile('./tsconfig.json', JSON.stringify(config, null, 2), {}, function(error){
    if(error){
      console.log('# TS-CONFIG 生成失败 #');
    }else{
      console.log('# TS-CONFIG 生成成功 #');
    }
  })
}
