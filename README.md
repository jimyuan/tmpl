# 网站快速开发模板
申明：本开发模板适用于小型快速简单网站开发，非用于大型或者模块化开发之使用。

## 开发环境
采用 Nodejs 为基础的 gulp 搭建前端自动化模块，并利用 bower 工具对前端库进行管理，如果从未安装过这两个工具，通过以下命令全局安装：
```
npm install -g gulp bower
```

## 安装依赖包
将代码 clone 下来后，首次运行之前，需要需安装项目依赖包。通过以下命令，我们将开发环境的自动化工具以及网站所需要的一些第三方框架都初始化好。这些初始的包和框架列表写在 `package.json` 同 `bower.json` 的内容里。
```
npm install && bower install
```

在开发过程中，如果需要其他的第三方前端框架，需要通过以下命令来安装并引用：
```
npm install --save-dev package_name
bower install --save framework_name
```

## 项目启动
在 gulpfile.js 中已经配置好项目启动后的一些初始化工作，所以只要简单的执行以下命令即可：
```
gulp
```

如果是手机网站，在浏览器模拟器中，可以从地址 `http://localhost:9000/`进入，项目跟目录下的页面模拟了iOS safari浏览器的状态栏、地址栏和工具栏，是你能够更加清楚的知道网页在浏览器中的页面尺寸。

## HTML 文件生成
本项目采用 gulp-file-wrapper 插件，所有静态 HTML 都从 `src/pages/layout.html` 这个模板中生成，通过 watch 进程查看 `src/pages/partial/` 目录中的代码并实时编译成完整文件存放到 `app` 目录中。

## SCSS 文件说明
以 boostrap v4 alpha 4 版本为基础做了 reboot。 今后会针对 BS 主项目的升级而进行微调。通过 gulp task 实时编译 css 文件到 `app/css/` 目录下。

## JS 文件说明
已全面支持 ES6 语法，通过 gulp task 实时编译成 ES5 代码，然后存放到 `app/js/` 下。。

### 自建 minxins

| Mixins | 说明 |
| --- | --- |
| `size(width, height)` | 方便的宽高设定，如只传一个参数，则长宽一样 |
| `clearfix` | 清除浮动|
| `absolute(argu)` | 绝对定位，按需传入定位参数即可，eg: `@include absolute(top 0 right 0)`|
| `fixed(argu)` | 固定定位，同上|
| `relative(argu)` | 相对定位，同上|
| `respond-to(argu)` | 响应式断点设置，断点设置见 `_variables.scss`|

### 自建 functions
以下是一些 SCSS 目前还不支持的数学运算：

| 函数 | 说明 |
| --- | --- |
| `pow(number, exp)`| 乘方 |
| `fact(number)`    | 阶乘 |
| `rad(angle)`      | 角度转弧度 |
| `sin(angle)`      | 正弦 |
| `cos(angle)`      | 余弦 |
| `tan(angle)`      | 正切 |

以上 function 依项目需求而定，可不引入。在 docs.scss 中取消 import 即可。

## 测试说明

### JS 测试
~~已在 gulpfile.js 中 配置了 task。在命令行中执行 `gulp jshint` 即可进行 JS 语法测试。~~

现已通过 eslint 来对 es6 代码进行同步测试，不用 gulp task 了。

### SCSS 测试
已在 gulpfile.js 中 配置了 task。在命令行中执行 `gulp scsslint` 即可进行 SCSS 语法测试。
```
gulp scsslint
```

说明：因 gulp-scss-lint 语法检查模块依赖 Ruby 环境下的 scss-lint 包，所以在 Windows 环境下不是太方便，因此，该测试亦可量力而行，有环境可以执行以下命令后再运行该 task 进行测试。
```
gem install scss-lint
```

## 项目打包
`gulp build` 任务会将所有 css 和 js 都合并、压缩以及混淆后，输出到 dist 目录。 可以在 `http://localhost:9000/dist/` 中访问发布出来的文件用以检测。
```
gulp build
```

检验完毕后，这里也提供了一个压缩打包的 task 供使用。执行 `gulp zip` 命令，会在项目根目录下生成一个 `achive_xxxx.zip` 文件，可以将该文件提交给相关发布人员发布到正式环境中。
```
gulp zip
```
