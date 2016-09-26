(function(gulp, gulpLoadPlugins) {
  'use strict';
  var $ = gulpLoadPlugins({
        pattern: ['*'],
         rename: { 'jshint': 'Jshint'}
      }),
      _ = {
        app:  'app',
        dist: 'dist',
        scss: 'scss',
        tmpl: 'build',
        js:   'app/js',
        css:  'app/css',
        img:  'app/img'
      };

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ~ Wait for scss build & html templates render, then launch the Server
  //|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('bs', ['scss', 'static'], function() {
    $.browserSync.init({
      ui: false,
      server: { baseDir: './' },
      startPath: './app',
      port: 9000
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
      _.scss + '/**/*.scss',
      '!' + _.scss + '/utils/*.scss'])
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
  gulp.task('html', ['clean'], function() {
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
  gulp.task('build', ['image', 'html']);

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ default
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('default', ['bs', 'watch']);

}(require('gulp'), require('gulp-load-plugins')));
