'use strict';

/*global require */
/* Options
--minify= 1 or 0
*/

// Config
var Config = {
    rootDir: './www',
    distDir: './dist',
    js: {
        entry: './www/src/js',
        dest: './www/js'
    },
    css: {
        entry: './www/src/css',
        dest: './www/css'
    },
    browserify: {
        isWatching: true,
        //
        insertGlobals: false,
        // Enable source maps
        debug: false, // !gulp.env.production
        // Additional file extensions to make optional
        extensions: ['.js', '.coffee'],
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
            {
                entries:    './www/src/js/main.js',
                dest:       './www/js',
                outputName: 'main.js'
            }
        ]
    }
};



var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        rename: {
            'gulp-minify-css': 'minifyCSS'
        }
    }),
    browsersync = require('browser-sync'),
    reload = browsersync.reload,
    argv = require('yargs').argv,
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    stylish = require('jshint-stylish'),
    rimraf = require('rimraf'),
    prettyHrtime = require('pretty-hrtime');


// Static server
gulp.task('browser-sync', function() {
    browsersync({
        server: {
            baseDir: Config.rootDir
        }
    });
});

// process JS files and return the stream.
var bundleLogger = {
    startTime: null,
    start: function(filepath) {
        this.startTime = process.hrtime();
        plugins.util.log('Bundling', plugins.util.colors.green(filepath));
    },

    end: function(filepath) {
        var taskTime = process.hrtime(this.startTime);
        var prettyTime = prettyHrtime(taskTime);
        plugins.util.log(
            'Bundled',
            plugins.util.colors.green(filepath),
            'in',
            plugins.util.colors.magenta(prettyTime)
        );
    }
};
var handleErrors = function() {

    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    plugins.notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};


gulp.task('js:watchOff', function(callback) {
    Config.browserify.isWatching = false;
    callback();
});
gulp.task('js:watchOn', function(callback) {
    Config.browserify.isWatching = true;
    callback();
});
gulp.task('js', function(callback) {

    browsersync.notify('Compiling JavaScript');

    var browserifyConfig = Config.browserify;
    var bundleQueue = browserifyConfig.bundleConfigs.length;

    var browserifyThis = function(bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: false,
            // Specify the entry point of your app
            entries: bundleConfig.entries,
            // Add file extentions to make optional in your requires
            extensions: browserifyConfig.extensions,
            // Enable source maps!
            debug: browserifyConfig.debug,
            //
            insertGlobals: browserifyConfig.insertGlobals
        }).transform(babelify.configure({
            ignore: /(node_modules|bower|vendor|test)/
        }));

        var bundle = function() {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            var build = bundler
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName));

            if(argv.minify){
                build = build.pipe(plugins.streamify(plugins.uglify()));
            }

            build = build
                .pipe(gulp.dest(bundleConfig.dest))
                .pipe(reload({stream: true}))
                .on('data', reportFinished);

            return build;
        };

        if(browserifyConfig.isWatching) {
            // Wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function() {
            // Log when bundling completes
            bundleLogger.end(bundleConfig.outputName);
            if(bundleQueue) {
                bundleQueue -= 1;
                if(bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    browserifyConfig.bundleConfigs.forEach(browserifyThis);
});

//css
gulp.task('css', function(callback){
    var sassList = Config.css.entry + '/**/*.scss';
    var st = gulp.src(sassList)
        .pipe(plugins.compass({
            comments: false,
            css: Config.css.dest,
            sass: Config.css.entry
        }).on('data', function(){
            callback();
        }))
        .pipe(reload({stream: true}));
    if(argv.minify){
        st.pipe(plugins.minifyCSS({keepBreaks: true}))
            .pipe(gulp.dest(Config.css.dest));
    }
});

//jshint
gulp.task('jshint', function(){
    return gulp.src([
            Config.js.entry + '/**/*.js'
        ])
        // .pipe(plugins.react())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish))
        .on('error', function() {

        });
});

//unit test
gulp.task('test', function() {
    return gulp.src(Config.rootDir + '/src/test/unit/**/*.spec.js')
            .pipe(plugins.karma({
                configFile: 'karma.conf.js',
                action: 'run'
            }))
            .on('error', function(err) {
                throw err;
            });
});

// server
gulp.task('server', ['browser-sync', 'jshint', 'js:watchOn', 'js', 'css'], function () {
    gulp.watch(Config.css.entry + '/**/*.scss', ['css']);
    gulp.watch(Config.rootDir + '/**/*.html').on('change', reload);
});

// build
gulp.task('build', ['jshint', 'js:watchOff', 'js', 'css'], function(callback) {
    //all delete
    rimraf(Config.distDir, function(){
        //all copy
        gulp.src([
            Config.rootDir + '/!(src)/**',
            Config.rootDir + '/!(src)'
        ])
        .pipe(gulp.dest(Config.distDir));
        callback();
    });
});

//default
gulp.task('default', ['server']);
