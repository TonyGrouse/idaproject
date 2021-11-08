const {src, dest, watch, parallel, series} = require('gulp'),
      scss = require('gulp-sass'),
      concat = require('gulp-concat'),
      browserSync = require('browser-sync').create(),
      uglify = require('gulp-uglify-es').default,
      autoprefixer = require('gulp-autoprefixer'),
      imagemin = require('gulp-imagemin'),
      del = require('del');


function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });
}

function cleanApp() {
    return del('app');
}

function images() {
    return src('src/img/**/*')
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]))
            .pipe(dest('app/img'));
}
      
function styles() {
    return src('src/scss/style.scss')
            .pipe(scss({outputStyle: 'compressed'}))
            .pipe(concat('style.min.css'))
            .pipe(autoprefixer({
                overrideBrowserslist: ['last 10 version'],
                grid: true,
                cascade: true
            }))
            .pipe(dest('src/css'))
            .pipe(browserSync.stream());
}

function scripts() {
    return src([
        'src/js/script.js'
    ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream());
}

function build() {
    return src([
        'src/css/style.min.css',
        'src/fonts/**/*',
        'src/js/script.min.js',
        'src/*.html',
    ], {base: 'src'})
        .pipe(dest('app'));
}

function watching() {
    watch(['src/scss/**/*.scss'], styles);
    watch(['src/js/**/*.js', '!src/js/script.min.js'], scripts);
    watch(['src/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanApp = cleanApp;


exports.build = series(cleanApp, images, build);
exports.default = parallel(styles, scripts, browsersync, watching); 
