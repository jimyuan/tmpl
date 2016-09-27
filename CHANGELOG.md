# CHANGE LOG

## 2016-09-27
众多更新，版本号升级为 _2.0.0_

- scss 采用 BS4 alpha 4 的 reboot
- 使用 es2015 来编写 js，添加新 task 实时编译成 ES5
- gulpfile.js 也采用 es2015 编写，保留 ES5 版本以防万一（gulpfile_es5.js）
- 调整目录结构，src 目录用于存放css，js 和 html 的预编译源码

## 2016-09-22
升级项目内的 npm 包，升级后，某些依赖包的 API 发生变化，重写 gulpfile.js。

## 2015-09-28
scss 框架更改，reset 样式的代码从 Bootstrap 4 中挖过来占为己有，同时提升版本号：_0.9.0_

## 2015-08-06
多项重大更新：

* 调整了项目的目录结构，规定 app 目录下为无需编译或者已编译文件
* 采用 gulp-file-wrapper 插件编译静态文件
* 采用 browser sync 替换 connect 组件
* 删除 sandal 样式框架，建立新的 scss 架构
* 更新 README 文档
* 更新版本号为： _0.8.6_
* 添加 CHANGELOG 文档

## 2015-06-04
* 添加 scsslint，为规范 scss 文件做 test 校验

## 2015-05-29
* 更新 npm 包，升级为更新版本，提高稳定性

## 2015-05-28
* 为 template 文件添加 watch
* 更新 README, 增加 sandal 框架及自身的 scss 使用说明
* 更新项目版本号

## 2015-05-27
* image task
* 抛弃 ruby-sass，采用 node-sass 引擎，提升 scss 文件编译效率
* 采用 gulp-file-include 渲染静态文件

## 2015-05-04
* 创建项目
