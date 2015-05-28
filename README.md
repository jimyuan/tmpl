# 网站快速开发模板

## 开发环境
采用 Nodejs 为基础的 gulp 搭建前端自动化模块，并利用 bower 工具对前端库进行管理，如果从未安装过这两个工具，通过以下命令安装：

* `npm install -g gulp`
* `npm install -g bower`

### gulpfile 主要模块
* test    —— js 语法测试
* sass    —— scss 编译
* html    —— css 和 js 文件合并压缩以及混淆
* image   —— 图像优化压缩
* static  —— 静态模板渲染
* connect —— 建立一个 http 环境，并设置 liveload 端口
* server  —— 打开浏览器窗口
* watch   —— 文件变化观察

### 常用 gulp 指令
* `gulp test`  —— 测试网站各 js 文件
* `gulp start` —— 项目启动
* `gulp build` —— 项目编译，完成后在项目根目录下生成 dist 目录，内为最终文件


## 项目运行
* `npm install`
* `bower install`
* `gulp start`
* `open http://localhost:9000/app/`

如果是手机网站，在浏览器模拟器中，可以从地址 `http://localhost:9000/`进入，项目跟目录下的页面模拟了iOS safari浏览器的状态栏、地址栏和工具栏，是你能够更加清楚的知道网页在浏览器中的页面尺寸。

## SCSS 文件说明

以 [https://github.com/marvin1023/sandal.git]() 为基础，逐步完善自建scss功能。

### sandal 内置 mixins 说明
以下 mixins 可以通过 `@include mixin-name` 的方式，或者 `@extend %extend-name` 进行引用：

* `center-block`    —— 块对象水平居中
* `clearfix`        —— 清除 float 浮动
* `hidden`          —— 隐藏 DOM 对象
* `hidden-visually` —— 只视觉隐藏 DOM 对象
* `fixed`           —— 固顶，如果传入 'bottom' 参数，则对象在底部固顶
* `justify`         —— flex 对象以 space-between 方式分散对齐
* `disabled(bgc, text, bdc)` —— 禁用样式，可传入背景色、文字色和边框色重定义禁用样式

以下只定义了 mixin，所以只能通过 @include 来调用：

* `equal-table(children)`  —— 以 table 布局等分子对象, 默认子元素为 li
* `equal-flex(children)`   —— 以 flex 布局等分子对象, 默认子元素为 li
* `center-flex(direction)` —— 以 flex 布局使子对象居中，默认水平和垂直都居中，可传入 x 或 y 参数使得其子对象只对于其中一个维度居中
* `center-translate(direction)`  —— 以 translate 方式使对象居中，同样可以传入  x 或 y 定义某一维度居中
* `triangle(direction, width, color)` —— 三角箭头，默认参数为 `(top, 6px, #ccc)`, 以 top、 right、 bottom、 left 等关键词设定方向
* `arrow(size, direction, width, color)` —— 方向箭头，默认参数 `(10px, right, 2px, #ccc)`, 方向同上
* `font-face(font-family, path, font-weight, font-style)` —— 字体样式定义

以下只定义了%，所以只能通过 @extend 来调用：

* `%bar-line`     —— bar line
* `%ellipsis`     —— 文字溢出宽度应用省略号
* `%equal-col`    —— 等分列，可以使用equal-flex或equal-table，默认子元素为li
* `%item-arrow`   —— 右侧箭头跳转指向
* `%page-out`     —— page switch
* `%page-in`      —— page switch
* `%btn`          —— 按钮样

### 媒体查询 mixins

* `screen(min-width, max-width, orientation)`
* `min-screen(width)`
* `max-screen(width)`
* `screen-height(min-height, max-height, orientation)`
* `min-screen-height(height)`
* `max-screen-height(height)`
* `hdpi(ratio)`
* `landscape`
* `portrait`
* `iphone3(orientation)`
* `iphone4(orientation)`
* `iphone5(orientation)`
* `iphone6(orientation)`
* `iphone6-plus(orientation)`
* `ipad(orientation)`
* `ipad-retina(orientation)`
* `hdtv(standard)`

请查看 [https://github.com/paranoida/sass-mediaqueries]() 获取详情！

### 自建 minxins

* `size(width, height)`     —— 方便的宽高设定，如只传一个参数，则长宽一样
* `position(pos, argu)`     —— 位置设定，默认 absolute 定位，eg: `@include position(absolute, top 0 right 0)`
* `absolute(argu)`          —— 绝对定位，position的简化版，按需传入定位参数即可，格式见上
* `fixed(argu)`             —— 固定定位，同上
* `relative(argu)`          —— 相对定位，同上

### 自建 functions

* `pow(number, exp)`—— 乘方
* `fact(number)`    —— 阶乘
* `rad(angle)`      —— 角度转弧度
* `sin(angle)`      —— 正弦
* `cos(angle)`      —— 余弦
* `tan(angle)`      —— 正切
