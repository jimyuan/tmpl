(function(gulp, gulpLoadPlugins) {
  let $, _, styles, taskInit

  // gulp autoload plugins
  $ = gulpLoadPlugins({
    pattern: ['*'],
    rename: { 'jshint': 'Jshint'}
  })

  // path setting
  _ = {
    app: 'app', dist: 'dist',
    js: 'app/js', css: 'app/css', img: 'app/img',
    scss: 'src/scss', tmpl: 'src/pages',  es6: 'src/es6'
  }

  // BrowserSync notify style
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

  // 项目启动初始任务
  taskInit = ['scss', 'es6', 'html']

  /* launch the Server */
  gulp.task('bs', taskInit, () => {
    $.browserSync.init({
      ui: false,
      server: { baseDir: './' },
      startPath: './app',
      port: 9000,
      notify: { styles }
    })
  })

  /* jshint - js files test */
  gulp.task('jshint', () => gulp
    .src(['gulpfile.js', `${_.js}/**/*.js`])
    .pipe($.jshint())
    .pipe($.jshint.reporter($.jshintStylish))
  )

  /* scsslint - scss files test */
  gulp.task('scsslint', () => gulp
    .src([`${_.scss}/**/*.scss`, `!${_.scss}/utils/*.scss`])
    .pipe($.scssLint({
      'config': '.scsslintrc',
      'customReport': $.scssLintStylish
    }))
  )

  /* render template from html file */
  gulp.task('html', () => gulp
    .src(`${_.tmpl}/*.html`)
    .pipe($.plumber())
    .pipe($.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(`${_.app}/`))
  )

  /* scss2css (use node-sass) */
  gulp.task('scss', () => gulp
    .src(`${_.scss}/**/*.scss`)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      sourceComments: false,
      includePaths: ['./bower_components/bootstrap-sass/assets/stylesheets/bootstrap/']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 15 versions', '> 1%']
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(_.css))
    .pipe($.browserSync.stream())
  )

  /* es6 => es5 (use present-es2015) */
  gulp.task('es6', () => gulp
    .src(`${_.es6}/**/*.es6`)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015', 'stage-2']
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(_.js))
  )

  /* optimize images */
  gulp.task('image', ['clean'], () => gulp
    .src(`${_.img}/**/*`)
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(`${_.dist}/img/`))
  )

  /* Parse build blocks HTML files */
  gulp.task('assets', ['clean'], () => gulp
    .src(`${_.app}/*.html`)
    .pipe($.plumber())
    .pipe($.useref())
    .pipe(gulp.dest(_.dist))
  )

  /* minify html files */
  gulp.task('html-minify', ['assets'], () => gulp
    .src(`${_.dist}/*.html`)
    .pipe($.plumber())
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(_.dist))
  )

  /* minify js files */
  gulp.task('js-minify', ['html-minify'], () => gulp
    .src(`${_.dist}/js/*.js`)
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe(gulp.dest(`${_.dist}/js`))
  )

  /* minify css files */
  gulp.task('css-minify', ['js-minify'], () => gulp
    .src(`${_.dist}/css/*.css`)
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe(gulp.dest(`${_.dist}/css`))
  )

  /* the assets end task, minify css & js & html */
  gulp.task('assets-minify', ['css-minify'])

  /* zip dist files with time stamp */
  gulp.task('zip', () => gulp
    .src(`${_.dist}/**/*`)
    .pipe($.plumber())
    .pipe($.zip(`archive_${Date.now()}.zip`))
    .pipe(gulp.dest('./'))
  )

  /* watch task */
  gulp.task('watch', () => {
    // Watch scss files
    gulp.watch(`${_.scss}/**/*.scss`, ['scss'])
    // Watch es6 files
    gulp.watch(`${_.es6}/**/*.es6`, ['es6'])
    // Watch template files
    gulp.watch(`${_.tmpl}/**/*.html`, ['html'])
    // Watch for reload
    gulp.watch([
      `${_.js}/**/*.js`,
      `${_.app}/*.html`,
      `${_.img}/**/*.{png,jpg,jpeg,gif,ico}`
    ]).on('change', $.browserSync.reload)
  })

  /* clean dist folder */
  gulp.task('clean', () => $.del([_.dist]))

  /* alias */
  // gulp.task('test',  ['jshint', 'scsslint'])
  gulp.task('init', taskInit)
  gulp.task('build', ['image', 'assets-minify'])

  /* default */
  gulp.task('default', ['bs', 'watch'])
}(require('gulp'), require('gulp-load-plugins')))
