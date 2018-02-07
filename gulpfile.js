const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const imageminOptipng = require('imagemin-optipng');
const sassLint = require('gulp-sass-lint');
const eslint = require('gulp-eslint');

var sources = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**.js',
    images: 'src/images/*',
    html: 'src/**/*.html',
    php: 'src/**/*.php',
    build: 'build/'
};

/* TASK FOR THE SCSS */
function sassCompileWebsite (target) {
    return gulp.src([sources.scss], {base: 'src'})
    .pipe(sourcemaps.init({largeFile: true}))
    
    // lint the scss files and trow warnings and errors
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    
    //transfer scss to css
    .pipe(sass().on('error', sass.logError))
    
    // Autoprefix the selectors
    .pipe(autoprefixer({
        browsers: ['last 4 versions',
            'not ie <= 10',
        ],
        cascade: false
    }))
    
    // write files to the target folder
    .pipe(gulp.dest( './' + target ))
    
    .pipe(sourcemaps.write())
}

function jsCompileWeb(target) {
    return gulp.src([sources.js], {base: 'src'})
    .pipe(sourcemaps.init({largeFile: true}))
    
    //
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({
        presets: ['env','es2015']
    }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./' + target + '/scripts/'))
    .pipe(minify({
        ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('./' + target + '/scripts/'))
    .pipe(sourcemaps.write())
}


/* TASK FOR IMAGE MIN */
function imageCompile(target) {
    return gulp.src([sources.images], {base: 'src'})
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        svgoPlugins: [
            {removeViewBox: false},
            {cleanupIDs: false}
        ],
        use: [imageminOptipng()]
    }))
    .pipe(gulp.dest('./'+ target+'/'));
}


// TASKS
gulp.task('image', function(){
    return imageCompile('build');
});

gulp.task('js', function () {
    return jsCompileWeb('build');
});

gulp.task('sass', function () {
    return sassCompileWebsite('build');
});

gulp.task('watch', function(){
    gulp.watch([sources.scss], ['sass']);
    gulp.watch([sources.js], ['js']);
    gulp.watch([sources.images], ['image']);
    gulp.watch([sources.html, sources.php], ['copy']);
});

gulp.task('build', ['image', 'js', 'sass']);
