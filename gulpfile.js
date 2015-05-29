(function(gulp, gulpLoadPlugins) {
  'use strict';
  var $ = gulpLoadPlugins({pattern: '*', lazy: true}),
      _ = {
        app:  'app', 
        dist: 'dist', 
        sass: 'app/sass',
        tmpl: 'app/src',        
        js:   'app/js',
        css:  'app/css',
        img:  'app/img'
      };

  function handleError(error){
    console.log(error.message);
    this.emit('end');
  } 

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ jshint
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('jshint', function() {
    return gulp.src([ 'gulpfile.js' , _.js + '/**/*.js'])
      .pipe($.jshint('.jshintrc'))
      .pipe($.jshint.reporter('jshint-stylish'));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ render template from html file
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('static', function() {
    return gulp.src([_.tmpl + '/*.html'])
      .pipe($.plumber())
      .pipe($.fileInclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest(_.app + '/'))
      .pipe($.size({
        title: 'HTML files:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ copy static files to dist files
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  // gulp.task('copy', function() {
  //   return gulp.src(_.app + '/img/**/*')
  //     .pipe(gulp.dest(_.dist + '/img/'))
  //     .pipe($.size());
  // });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ sass2css (node-sass)
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('sass', function() {
    return gulp.src(_.sass + '/**/*.{scss, sass}')
      .pipe($.plumber({ errorHandler: handleError}))
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        outputStyle: 'expanded',
        includePaths: [ './bower_components/' ]
      }))
      .pipe($.autoprefixer())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(_.css))
      .pipe($.size({
        title: 'CSS files:'
      }));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ optimize images
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('image', function () {
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
  //| ✓ join & minify css & js
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('html', function() {
    return gulp.src(['app/*.html'])
      .pipe($.plumber())
      .pipe($.useref.assets())
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss({
        keepSpecialComments: 0
      })))
      .pipe($.useref.restore())
      .pipe($.useref())
      .pipe(gulp.dest(_.dist));
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ connect
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('connect', function() {
    $.connect.server({
      root: ['./'],
      livereload: true,
      port: 9000
    });
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ server
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('server', ['connect', 'sass', 'static'], function() {
    $.shelljs.exec('open http://localhost:9000/app/');
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ watch
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('watch', ['server'], function() {
    var wfs = [
      _.app + '/*.html',
      _.css + '/**/*.css',
      _.img + '/**/*.{png,jpg,jpeg,gif,ico}',
      _.js  + '/**/*.js'
    ];
    
    $.watch(wfs, function(){
      return gulp.src(wfs).pipe($.connect.reload());
    });

    // Watch style files
    $.watch([_.sass + '/**/*.{sass,scss}'] , function() {
      gulp.start('sass');
    });

    // Watch template files
    $.watch([_.tmpl + '/**/*.html'], function() {
      gulp.start('static');
    });
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ clean dist folder
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('clean', function() {
    return $.del([_.dist]);
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ alias
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('start', ['watch']);
  gulp.task('test',  ['jshint']);
  gulp.task('build', ['static', 'sass', 'clean'], function(){
    gulp.start(['html', 'image']);
  });

  //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //| ✓ default
  //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  gulp.task('default', ['build']);
}(require('gulp'), require('gulp-load-plugins')));
