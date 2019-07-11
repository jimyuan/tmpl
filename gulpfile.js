/**
 * gulp command
 */
const { src, dest, task, watch, parallel, series } = require('gulp')
/**
 * gulp plugin
 */
const [ scssLint, scssLintStylish, fileInclude, sourcemaps, sass, autoprefixer, babel, useref, htmlmin, uglify, cleanCss, zip, del, browserSync ] = [
  require('gulp-scss-lint'),
  require('gulp-scss-lint-stylish'),
  require('gulp-file-include'),
  require('gulp-sourcemaps'),
  require('gulp-sass'),
  require('gulp-autoprefixer'),
  require('gulp-babel'),
  require('gulp-useref'),
  require('gulp-htmlmin'),
  require('gulp-uglify'),
  require('gulp-clean-css'),
  require('gulp-zip'),
  require('del'),
  require('browser-sync').create()
]
/**
 * 文件路径设置
 */
const _ = {
  app: 'app', dist: 'dist',
  js: 'app/js', css: 'app/css', img: 'app/img',
  scss: 'src/scss', tmpl: 'src/pages',  es6: 'src/es6'
}
/**
 * BrowserSync notify style
 */
const styles = [
  'display: block',
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
/**
 * Scss lint
 */
task('scsslint', () => src(`${_.scss}/**/*.scss`)
  .pipe(scssLint({
    'config': '.scsslintrc',
    'customReport': scssLintStylish
  }))
)
/**
 * Render html file to static
 */
task('html', () => src(`${_.tmpl}/*.html`)
  .pipe(fileInclude({
    prefix: '@@',
    basepath: '@file'
  }))
  .pipe(dest(`${_.app}/`))
)
/**
 * SCSS files compiler, autoprefixer as post-css
 */
task('scss', () => src(`${_.scss}/**/*.scss`)
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded',
    sourceComments: false,
    onError: browserSync.notify
  }))
  .pipe(autoprefixer({
    Browserslist: ['> 1%']
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(dest(_.css))
  .pipe(browserSync.stream())
)
/**
 * ES6 files compiler
 */
task('es6', () => src(`${_.es6}/**/*.es6`)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(dest(_.js))
)

// Build Task
/**
 * Move images to dist folder
 */
task('image', () => src(`${_.img}/**/*`)
  .pipe(dest(`${_.dist}/img/`))
)
/**
 * Comb CSS files and JS files to dist folder
 */
task('assets', () => src(`${_.app}/*.html`)
  .pipe(useref())
  .pipe(dest(_.dist))
)
/**
 * HTML files minify
 */
task('html-minify', () => src(`${_.dist}/*.html`)
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true
  }))
  .pipe(dest(_.dist))
)
/**
 * JS files minify
 */
task('js-minify', () => src(`${_.dist}/js/*.js`)
  .pipe(uglify())
  .pipe(dest(`${_.dist}/js`))
)
/**
 * CSS files minify
 */
task('css-minify', () => src(`${_.dist}/css/*.css`)
  .pipe(cleanCss())
  .pipe(dest(`${_.dist}/css`))
)
/**
 * Zip dist files
 */
task('zip', () => src(`${_.dist}/**/*`)
  .pipe(zip(`archive_${Date.now()}.zip`))
  .pipe(dest('./'))
)
/**
 * Watch files
 */
task('watch', () => {
  // Watch scss files
  watch(`${_.scss}/**/*.scss`, parallel('scss'))
  // Watch es6 files
  watch(`${_.es6}/**/*.es6`, parallel('es6'))
  // Watch template files
  watch(`${_.tmpl}/**/*.html`, parallel('html'))

  // Watch for reload
  watch([
    `${_.js}/**/*.js`,
    `${_.app}/*.html`,
    `${_.img}/**/*.{png,jpg,jpeg,gif,ico}`
  ], done => {
    browserSync.reload()
    done()
  })
})

// Utility Task
/**
 * Clean folder
 */
task('clean', () => del([_.dist]))
/**
 * Run a server and open project
 */
task('run-proj', () => {
  browserSync.init({
    ui: false,
    server: { baseDir: './' },
    startPath: './app',
    port: 9000,
    notify: { styles }
  })
})
/**
 * Start the proje (main task)
 */
task('start', series('scss', 'es6', 'html', 'run-proj'))

exports.default = parallel('start', 'watch')
/**
* Build files to dist
*/
exports.build = series('scss', 'es6', 'html', 'clean', 'assets', 'image', 'html-minify', 'js-minify', 'css-minify')
