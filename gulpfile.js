// Required Plugins
var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync');
var cache         = require('gulp-cache');
var concat        = require('gulp-concat');
var htmlmin       = require('gulp-htmlmin');
var imagemin      = require('gulp-imagemin');
var minifycss     = require('gulp-minify-css');
var plumber       = require('gulp-plumber');
var reload        = browserSync.reload;
var rename        = require('gulp-rename');
var sass          = require('gulp-sass');
var uglify        = require('gulp-uglify');

// JS Task
gulp.task('js', function(){
  gulp.src(['src/js/**/*.js'])
  .pipe(plumber())
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest('build/js'))
  .pipe(reload({stream:true}));
});

// Sass Task
gulp.task('sass', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sass())
    .pipe(gulp.dest('build/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('build/css'))
    .pipe(reload({stream:true}));
});

// HTML Task
gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
    .pipe(reload({stream:true}));
});

// Img Task
gulp.task('img', function() {
  return gulp.src('src/img/**/*')

    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/img'))
    .pipe(reload({stream:true}));
});

// Browser-Sync Task
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});

// Watch Task
gulp.task('live',  ['browser-sync'], function() {

    // Watch .scss files
    gulp.watch('src/sass/style.scss', ['sass']);
    // Watch .js files
    gulp.watch('src/js/*.js', ['js']);
    // Watch image files
    gulp.watch('src/img/**/*', ['img']);
    // Watch html files
    gulp.watch('src/**/*.html', ['html']);
});

// Default Task
gulp.task('default', function() {
    gulp.start('sass', 'js', 'img', 'html');
});
