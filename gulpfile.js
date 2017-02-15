(function(gulp, gulpLoadPlugins) {
  let $, _, styles, taskInit

  /* gulp 插件自动载入 */
  $ = gulpLoadPlugins({
    pattern: ['*'],
    rename: { 'jshint': 'Jshint'}
  })

  /* 文件路径设置 */
  _ = {
    app: 'app', dist: 'dist',
    js: 'app/js', css: 'app/css', img: 'app/img',
    scss: 'src/scss', tmpl: 'src/pages',  es6: 'src/es6'
  }

  /* BrowserSync 通知样式 */
  styles = [
    'display: none',
    'padding: 15px',
    'font-family: sans-serif',
    'position: fixed',
    'font-size: 0.9em',
    'z-index: 9999',
    'bottom: 0px',
    'right: 0px',
    'border-top-left-radius: 5px',
    'background-color: rgba(0,0,0,0.4)',
    'margin: 0',
    'color: white',
    'text-align: center'
  ]

  /* 项目启动初始任务 */
  taskInit = ['scss', 'es6', 'html']

  /* 启动多浏览器同步 webserver */
  gulp.task('bs', taskInit, () => {
    $.browserSync.init({
      ui: false,
      server: { baseDir: './' },
      startPath: './app',
      port: 9000,
      notify: { styles }
    })
  })

  /* JS 文件格式校验（非 es6） */
  gulp.task('jshint', () => gulp
    .src(['gulpfile.js', `${_.js}/**/*.js`])
    .pipe($.jshint())
    .pipe($.jshint.reporter($.jshintStylish))
  )

  /* scss 文件格式校验 */
  gulp.task('scsslint', () => gulp
    .src([`${_.scss}/**/*.scss`, `!${_.scss}/utils/*.scss`])
    .pipe($.scssLint({
      'config': '.scsslintrc',
      'customReport': $.scssLintStylish
    }))
  )

  /**
   编译预处理代码，供预览用
  */
  /* html 代码片段渲染成静态 HTML 文件 */
  gulp.task('html', () => gulp
    .src(`${_.tmpl}/*.html`)
    .pipe($.plumber())
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(`${_.app}/`))
  )

  /* scss 文件编译成普通 CSS，添加 autoprefixer 后处理 */
  gulp.task('scss', () => gulp
    .src(`${_.scss}/**/*.scss`)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      sourceComments: false,
      includePaths: ['./bower_components/bootstrap/scss/']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 15 versions', '> 1%']
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(_.css))
    .pipe($.browserSync.stream())
  )

  /* es6 文件编译成普通 es5文件 */
  gulp.task('es6', () => gulp
    .src(`${_.es6}/**/*.es6`)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015', 'stage-2'],
      plugins: ['transform-runtime']
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(_.js))
  )

  /**
   打包任务
  */
  /* images 优化 */
  gulp.task('image', () => gulp
    .src(`${_.img}/**/*`)
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      $.imagemin.jpegtran(),
      // $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
    .pipe(gulp.dest(`${_.dist}/img/`))
  )

  /* 分离 HTML 中需要要再处理的 JS 和 CSS 文件，并按设置合并 */
  gulp.task('assets', () => gulp
    .src(`${_.app}/*.html`)
    .pipe($.plumber())
    .pipe($.useref())
    .pipe(gulp.dest(_.dist))
  )

  /* HTML 文件压缩 */
  gulp.task('html-minify', () => gulp
    .src(`${_.dist}/*.html`)
    .pipe($.plumber())
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(_.dist))
  )

  /*  js 文件混淆及压缩 */
  gulp.task('js-minify', () => gulp
    .src(`${_.dist}/js/*.js`)
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe(gulp.dest(`${_.dist}/js`))
  )

  /*  CSS 文件压缩 */
  gulp.task('css-minify', () => gulp
    .src(`${_.dist}/css/*.css`)
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe(gulp.dest(`${_.dist}/css`))
  )

  /* 将 build 好的文件压缩成 zip 文件，并打上时间戳 */
  gulp.task('zip', () => gulp
    .src(`${_.dist}/**/*`)
    .pipe($.plumber())
    .pipe($.zip(`archive_${Date.now()}.zip`))
    .pipe(gulp.dest('./'))
  )

  /* watch task */
  gulp.task('watch', () => {
    // Watch scss files
    $.watch(`${_.scss}/**/*.scss`, { ignoreInitial: false }, () => gulp.start('scss'))
    // Watch es6 files
    $.watch(`${_.es6}/**/*.es6`,   { ignoreInitial: false }, () => gulp.start('es6'))
    // Watch template files
    $.watch(`${_.tmpl}/**/*.html`, { ignoreInitial: false }, () => gulp.start('html'))

    // Watch for reload
    $.watch([
      `${_.js}/**/*.js`,
      `${_.app}/*.html`,
      `${_.img}/**/*.{png,jpg,jpeg,gif,ico}`
    ], $.browserSync.reload)
  })

  /*  dist 目录清除 */
  gulp.task('clean', () => $.del([_.dist]))

  /* 发布任务定制 */
  gulp.task('build', $.sequence(
    taskInit, 'clean', 'assets',
    ['image', 'html-minify', 'js-minify', 'css-minify'])
  )

  /* 默认任务，运行项目 */
  gulp.task('default', ['bs', 'watch'])
}(require('gulp'), require('gulp-load-plugins')))
