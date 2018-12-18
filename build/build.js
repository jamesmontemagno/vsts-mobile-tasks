var gulp = require('gulp');
var ts = require('gulp-typescript');
var install = require('gulp-install');


var buildProject = function(name){
    gulp.src(["./tasks/" + name + "/package.json"])
        .pipe(install());

    var tsProject = ts.createProject("./tasks/" + name + "/tsconfig.json");
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./tasks/" + name + "/built"));
};

gulp.task('iOSBUndleIdentifier', function(){
    return buildProject("iOSBundleIdentifier");
});

gulp.task('iOSBumpVersion', function(){
    return buildProject("iOSBumpVersion");
});

gulp.task('AndroidBumpVersion', function(){
    return buildProject("AndroidBumpVersion");
});

gulp.task('AndroidPackageName', function(){
    return buildProject("AndroidPackageName");
});

gulp.task('iOSEntitlementTransform', function(){
    return buildProject("iOSEntitlementTransform");
});

gulp.task('build', ['iOSBUndleIdentifier', 'iOSBumpVersion', 'AndroidBumpVersion', 'AndroidPackageName', 'iOSEntitlementTransform'], function(){
    return null;
});