(function(gulp, gulpLoadPlugins) {
  'use strict';
  var $, _, notifyStyle;

  // gulp autoload plugins
  $ = gulpLoadPlugins({
        pattern: ['*'],
         rename: { 'jshint': 'Jshint'}
      });

  // path setting
  _ = {
    app:  'app',      dist: 'dist',
    js:   'app/js',   css:  'app/css',    img:  'app/img',
    scss: 'src/scss', tmpl: 'src/pages',  es6:  'src/es6'
  };

  // BrowserSync notify style
  notifyStyle = [
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
  ];

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ Wait for scss build & html templates render, then launch the Server
  //|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('bs', ['scss', 'es6', 'static'], function() {
    $.browserSync.init({
      ui: false,
      server: { baseDir: './' },
      startPath: './app',
      port: 9000,
      notify: { styles: notifyStyle}
    });
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ jshint - js files test
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('jshint', function() {
    return gulp.src([ 'gulpfile.js',  _.js + '/**/*.js'])
      .pipe($.jshint())
      .pipe($.jshint.reporter($.jshintStylish));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ scsslint - scss files test
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('scsslint', function() {
    return gulp.src([
      _.scss + '/**/*.scss', '!' + _.scss + '/utils/*.scss'
      ])
      .pipe($.scssLint({
        'config': '.scsslintrc',
        'customReport': $.scssLintStylish
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ render template from html file
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('static', function() {
    return gulp.src([_.tmpl + '/partial/**/*.html'])
      .pipe($.plumber())
      .pipe($.fileWrapper(_.tmpl + '/layout.html'))
      .pipe(gulp.dest(_.app + '/'))
      .pipe($.size({
        title: 'HTML files:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ scss2css (use node-sass)
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('scss', function() {
    return gulp.src(_.scss + '/**/*.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        outputStyle: 'expanded'
      }).on('error', $.sass.logError))
      .pipe($.autoprefixer({
         browsers: ['last 15 versions', '> 1%']
       }))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(_.css))
      .pipe($.browserSync.stream())
      .pipe($.size({
        title: 'CSS files:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ es6 => es5 (use present-es2015)
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('es6', function() {
    return gulp.src(_.es6 + '/**/*.js')
      .pipe($.sourcemaps.init())
      .pipe($.babel({
          presets: ['es2015']
      }))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(_.js))
      .pipe($.size({
        title: 'JS files:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ optimize images
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('image', ['clean'], function () {
    return gulp.src(_.img + '/**/*')
      .pipe($.imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(_.dist + '/img/'))
      .pipe($.size({
        title: 'IMAGE files:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ join & minify css & js
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('assets', ['clean'], function() {
    return gulp.src(_.app + '/*.html')
      .pipe($.plumber())
      .pipe($.useref())
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss({
        keepSpecialComments: 0
      })))
      .pipe(gulp.dest(_.dist));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ minify html files
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('minify', ['assets'], function() {
    return gulp.src(_.dist + '/*.html')
      .pipe($.plumber())
      .pipe($.htmlmin({
        removeComments: true,
        collapseWhitespace: true
      }))
      .pipe(gulp.dest(_.dist));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ zip dist files with time stamp
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('zip', function() {
    return gulp.src(_.dist + '/**/*')
      .pipe($.plumber())
      .pipe($.zip('archive_' + (+new Date()) + '.zip'))
      .pipe(gulp.dest('./'))
      .pipe($.size({
        title: 'ZIP file:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ watch
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('watch', function () {
      // Watch scss files
      gulp.watch(_.scss + '/**/*.scss', ['scss']);
      // Watch es6 files
      gulp.watch(_.es6 + '/**/*.js', ['es6']);
      // Watch template files
      gulp.watch([_.tmpl + '/**/*.html'], ['static']);
      gulp.watch([
        _.js  + '/**/*.js',
        _.app + '/*.html',
        _.img + '/**/*.{png,jpg,jpeg,gif,ico}'
      ]).on('change', $.browserSync.reload);
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ clean dist folder
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('clean', function() {
    return $.del([_.dist]);
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ alias
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  // gulp.task('test',  ['jshint', 'scsslint']);
  gulp.task('build', ['image', 'minify']);

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ default
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('default', ['bs', 'watch']);

}(require('gulp'), require('gulp-load-plugins')));
