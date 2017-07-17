// Required Plugins
var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync');
var cache         = require('gulp-cache');
var concat        = require('gulp-concat');
var htmlmin       = require('gulp-htmlmin');
var imagemin      = require('gulp-imagemin');
var cleanCSS      = require('gulp-clean-css');
var plumber       = require('gulp-plumber');
var reload        = browserSync.reload;
var rename        = require('gulp-rename');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var babel         = require('gulp-babel');

// JS Task
gulp.task('js-compile', function () {
  return gulp.src('src/assets/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('js-minify', ['js-compile'], function () {
  return gulp.src('dist/assets/js/bundle.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(reload({stream:true}));
});

gulp.task('js', ['js-compile', 'js-minify']);


// Sass Task
// var sassPaths = [
//   'node_modules/normalize.scss/sass',
//   'node_modules/foundation-sites/scss',
//   'node_modules/motion-ui/src'
// ];
// Add to sass({includePaths: sassPaths})

gulp.task('sass', function () {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(reload({stream:true}));
});

// HTML Task
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}));
});

// Img Task
gulp.task('img', function() {
  return gulp.src('src/assets/img/**/*')
    .pipe(cache(imagemin({progressive: true})))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(reload({stream:true}));
});

// Browser-Sync Task
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
});

// Watch Task
gulp.task('live',  ['browser-sync'], function() {
    // Watch scss, js, img, html files
    gulp.watch('src/assets/scss/**/*', ['sass']);
    gulp.watch('src/assets/js/**/*.js', ['js']);
    gulp.watch('src/assets/img/**/*', ['img']);
    gulp.watch('src/*.html', ['html']);
});

// Default Task
gulp.task('default', function() {
    gulp.start('sass', 'js', 'img', 'html');
});
