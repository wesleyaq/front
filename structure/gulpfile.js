'use strict';

var gulp            = require('gulp');
var $               = require('gulp-load-plugins')();
var browserSync     = require('browser-sync');
var mainBower       = require('main-bower-files');
var projectMap      = require('gulp-project-map');
var jade            = require('jade');
var gulpJade        = require('gulp-jade');
var sourcemaps      = require('gulp-sourcemaps');
var htmlhint 				= require("gulp-htmlhint");

var bases = {
  src: 'src/',
  dist: 'dist/contentassets/'
};

var paths = {
  scriptsLibs: 		['js/libs/*.js'],
  scriptsMain: 		['js/main.js'],
  styles:   			['scss/*.scss'],
  jades: 					['jade/**/*.jade', '!jade/inc/*', '!jade/partials/*', '!jade/_*.jade'],
  img: 						['img/**/*.+(png|jpg|gif)', '!img/sprites/*'],
  sprites: 				['img/sprites/*.*'],
  fonts: 					['fonts/**/*'],
  extras: 				['favicon.ico']
};

// Delete the dist directory
gulp.task('clear', function() {
 return gulp.src('dist/', {read: false})
 .pipe($.clean());
});

gulp.task('html', function() {
  gulp.src(paths.jades, {cwd: bases.src})
    .pipe($.newer(bases.dist, {ext: '.html'}))
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('css', function () {
  gulp.src(paths.styles, {cwd: bases.src})
    // .pipe(sourcemaps.init())
    .pipe($.newer(bases.dist + 'css/'))
    .pipe($.sass())
    .pipe($.autoprefixer({browsers: ['last 3 versions', 'ie 8', 'ie 9']}))
    .pipe(sourcemaps.write('.'))
    // .pipe($.concat('main.css'))
    .pipe($.plumber())
    .pipe(gulp.dest(bases.dist + 'css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('jsLibs', function() {
  gulp.src(paths.scriptsLibs, {cwd: bases.src})
    // .pipe(sourcemaps.init())
    .pipe($.newer(bases.dist + 'js/'))
    .pipe($.concat('libs.min.js'))
    .pipe($.uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(bases.dist + 'js/'))
});

gulp.task('jsMain', function() {
  gulp.src(paths.scriptsMain, {cwd: bases.src})
    .pipe($.newer(bases.dist + 'js/'))
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(bases.dist + 'js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('image', function() {
  gulp.src(paths.img, {cwd: bases.src})
    .pipe($.newer(bases.dist + 'img/'))
    .pipe($.imagemin({progressive: true, interlaced: true, svgoPlugins: [{cleanupIDs: false}]}))
    .pipe(gulp.dest(bases.dist + 'img/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('sprite', function() {
  var spriteData = gulp.src(paths.sprites, {cwd: bases.src}).pipe($.spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../img/sprite.png'
  }));

  spriteData.img
    .pipe(gulp.dest(bases.dist + 'img/'))
    .pipe(browserSync.reload({stream:true}))

  spriteData.css
    .pipe(gulp.dest(bases.src + 'scss/inc'))
    .pipe(browserSync.reload({stream:true}))

});

// Copy all other files to dist directly
gulp.task('copy', function() {
  gulp.src(paths.extras, {cwd: bases.src})
    .pipe($.newer(bases.dist))
    .pipe(gulp.dest(bases.dist))
  gulp.src(paths.fonts, {cwd: bases.src})
    .pipe(gulp.dest(bases.dist + 'fonts/'))
    .pipe(browserSync.reload({stream:true}))
  gulp.src('js/libs/ie/*', {cwd: bases.src})
    .pipe(gulp.dest(bases.dist + 'js/ie/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "dist"
    }
  });
});

gulp.task('htmlhint', function() {
  gulp.src("./dist/*.html")
    .pipe(htmlhint('.htmlhint'))
    .pipe(htmlhint.reporter())
});

gulp.task('watch', function () {
  gulp.watch('src/jade/**/*.jade', ['html']);
  gulp.watch('src/scss/**/*.scss', ['css']);
  gulp.watch('src/js/*.js', ['jsLibs', 'jsMain']);
  gulp.watch('src/img/**/*.*', ['image']);
  gulp.watch('src/img/sprites/*.*', ['sprite']);
});

gulp.task('list', function () {
  projectMap({
    path: './dist',
    extension: '.html',
    name: 'list-html',
    title: 'HTML SiteMap Template'
  });
});

gulp.task('default', 	['html', 'sprite', 'css', 'jsLibs', 'jsMain', 'image', 'copy']);
gulp.task('start', 		['browser-sync', 'watch']);
