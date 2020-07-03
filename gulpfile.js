const gulp = require("gulp");
const babel = require("gulp-babel");

//es6转es5
gulp.task("ese", function () {
    return gulp.src("js/*.js")// ES6存放路径
        .pipe(babel())
        .pipe(gulp.dest("dist")); //转换成 ES5 后存放的路径
});

// 监视src文件变化，自动执行任务
gulp.task('watch', function () {
    gulp.watch('js/*.js', gulp.series("ese"));
})

gulp.task('start',gulp.series('ese','watch',function(){}));