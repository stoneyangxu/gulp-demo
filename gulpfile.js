const eslint = require('gulp-eslint')
const scsslint = require('gulp-scss-lint')
const gulp = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const htmlreplace = require('gulp-html-replace')
const browserSync = require('browser-sync')

gulp.task('eslint', () => {
  gulp.src('src/**/*.js')
    .pipe(eslint({
      useEslintrc: true // 使用.eslintrc配置文件
    }))
    .pipe(eslint.format()) // 输出检查结果
    .pipe(eslint.failAfterError()) // 检查失败时，终止任务
})


gulp.task('scsslint', () => {
  gulp.src('src/**/*.scss')
    .pipe(scsslint())
    .pipe(scsslint.failReporter())
})

gulp.task('compile-js', () => {
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015'] // 使用es6插件集编译
    }))
    .pipe(gulp.dest('dist/js')) // 编译后的文件输出到dist
})

gulp.task('compile-scss', () => {
  gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css')) // 编译后的文件输出到dist
})

gulp.task('concat', ['compile-js', 'compile-scss'], () => {
  gulp.src('dist/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/latest'))
  gulp.src('dist/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/latest'))
})

gulp.task('minify', ['concat'], () => {
  gulp.src('dist/latest/app.js')
    .pipe(uglify())
    .pipe(rename((path) => {
        return path.basename += '.min'
    }))
    .pipe(gulp.dest('dist/latest'))
  gulp.src('dist/latest/style.css')
    .pipe(cleanCSS())
    .pipe(rename((path) => {
      return path.basename += '.min'
    }))
    .pipe(gulp.dest('dist/latest'))
})

gulp.task('html-replace',function() {
  return gulp.src('./src/*.html')
    .pipe(htmlreplace({
      'css': 'style.min.css',
      'js': 'app.min.js'
    }))
    .pipe(gulp.dest('./dist/latest'))
});


gulp.task('watch', ['concat', 'minify', 'html-replace'], () => {
    gulp.watch(['src/**/*.js', 'src/**/*.scss'], ['concat', 'minify', 'html-replace'])
})

gulp.task('browser-sync', ['watch'], () => {
    browserSync({
      server: 'dist/latest'
    })
})


