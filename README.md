# 网站快速开发模板

## 开发环境
采用 Nodejs 为基础的 gulp 搭建前端自动化模块，并利用 bower 工具对前端库进行管理，如果从未安装过这两个工具，通过以下命令安装：

* `npm install -g gulp`
* `npm install -g bower`

## gulpfile 主要模块
* `gulp`       —— 项目启动
* `gulp test`  —— 测试网站各 js 文件
* `gulp build` —— 项目编译，完成后在项目根目录下生成 dist 目录，内为_最终文件_


## 项目运行
* `npm install && bower install` （第一次clone需执行）
* `gulp`

如果是手机网站，在浏览器模拟器中，可以从地址 `http://localhost:9000/`进入，项目跟目录下的页面模拟了iOS safari浏览器的状态栏、地址栏和工具栏，是你能够更加清楚的知道网页在浏览器中的页面尺寸。

---

## SCSS 文件说明
去除了之前采用的 [sandal](https://github.com/marvin1023/sandal) 框架，内建了以 normalize.css 为基础的自建基本样式。

### 自建 minxins

* `size(width, height)`     —— 方便的宽高设定，如只传一个参数，则长宽一样
* `clearfix`                —— 清除浮动
* `position(pos, argu)`     —— 位置设定，默认 absolute 定位，eg: `@include position(absolute, top 0 right 0)`
* `absolute(argu)`          —— 绝对定位，position的简化版，按需传入定位参数即可，格式见上
* `fixed(argu)`             —— 固定定位，同上
* `relative(argu)`          —— 相对定位，同上
* `respond-to(argu)`        —— 响应式断点设置，断点设置见 `_variables.scss`

### 自建 functions

* `pow(number, exp)`—— 乘方
* `fact(number)`    —— 阶乘
* `rad(angle)`      —— 角度转弧度
* `sin(angle)`      —— 正弦
* `cos(angle)`      —— 余弦
* `tan(angle)`      —— 正切
