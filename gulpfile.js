// Plugin dependencies
var gulp            = require('gulp'),                        // Gulp
    notify          = require('gulp-notify'),                 // Notification
    sourcemaps      = require('gulp-sourcemaps'),             // Source maps
    autoprefixer    = require('gulp-autoprefixer'),           // Prefix CSS
    sass            = require('gulp-sass'),                   // Sass
    rename          = require('gulp-rename'),                 // Rename files
    concat          = require('gulp-concat'),                 // Concatinate files
    uglify          = require('gulp-uglify'),                 // Minify files
    htmlhint        = require('gulp-htmlhint'),               // HTML validation
    csslint         = require('gulp-csslint'),                // CSS code quality
    jshint          = require('gulp-jshint'),                 // JavaScript code quality
    imagemin        = require('gulp-imagemin'),               // Minify images
    pngquant        = require('imagemin-pngquant'),           // PNG optimizer
    browserSync     = require('browser-sync');                // Live reload & Browser syncing

// -----------------------------------------------------------------------------
// Configurations
var project         = 'onigiri',                              // Project name

    localHost       = './public_html',                        // Local host
    localDomain     = '.ahomiya.com',                         // Local domain
    localUrl        = 'local.' + project + localDomain,       // Local URL

    localResources  = './resources',                          // Local resources

    componentPackage= './components/package',                 // Package components
    componentCustom = './components/custom';                  // Custom components

// -----------------------------------------------------------------------------
// Methods
var browserReload   = browserSync.reload;                     // Browser reloading

// -----------------------------------------------------------------------------
// Globs

var toolkit         = '/toolkit/dist',                        // Toolkit framework
    sourceMaps      = '../../resources/sourcemaps',           // Source maps
    resources       = {
      sass: {
        defaults    : localResources + '/sass/**/*.scss'      // SASS
      },
      js: {
        defaults    : localResources + '/js',                 // JS - defaults
        main        : localResources + '/js/main.js',         // JS - main
        vendor      : localResources + '/js/vendor'           // JS - vendor
      },
      images: {
        defaults    : localResources + '/img/**/*'            // Images
      }
    },
    root            = {
      html : {
        template    : localHost + '/**/*.html'                // HTML template
      },
      css : {
        defaults    : localHost + '/css',                     // CSS - defaults
        main        : localHost + '/css/main.css'             // CSS - main
      },
      js: {
        defaults    : localHost + '/js',                      // JS - defaults
        main        : localHost + '/js/main.js',              // JS - main
        vendor      : localHost + '/js/vendor'                // JS - vendor
      },
      images: {
        defaults    : localHost + '/img',                     // Images
      }
    };

// -----------------------------------------------------------------------------
// Components
var components      = {

  // JavaScript libraries
  jsLibraries: {
    core: [
      componentPackage + '/jquery/dist/jquery.js',
      componentPackage + '/enquire/dist/enquire.js',
      componentPackage + '/smartresize/jquery.debouncedresize.js',
      componentPackage + toolkit + '/js/toolkit/jquery.utilities.js',
    ],
    features: [
      componentCustom  + '/modernizr/modernizr.js',
      componentPackage + '/ua-parser-js/src/ua-parser.js',
      componentPackage + '/ua-detection-js/src/ua-detection.js'
    ],
    polyfills: [
      componentPackage + '/matchMedia/matchMedia.js',
      componentPackage + '/matchMedia/matchMedia.addListener.js'
    ],
    plugins: []
  }

};

// -----------------------------------------------------------------------------
// Build tasks
// Concatenating, minifying, and optimizing files

// JavaScript libraries
gulp.task('build:js.core', function() {
  return gulp
    .src(components.jsLibraries.core)                         // Source
    .pipe(concat('libraries.core.js'))                        // Concatenating
    // .pipe(uglify())                                        // Minifying
    .pipe(gulp.dest(root.js.vendor));                         // Output
});

gulp.task('build:js.features', function() {
  return gulp
    .src(components.jsLibraries.features)                     // Source
    .pipe(concat('libraries.features.js'))                    // Concatenating
    // .pipe(uglify())                                        // Minifying
    .pipe(gulp.dest(root.js.vendor));                         // Output
});

gulp.task('build:js.polyfills', function() {
  return gulp
    .src(components.jsLibraries.polyfills)                    // Source
    .pipe(concat('libraries.polyfills.js'))                   // Concatenating
    // .pipe(uglify())                                        // Minifying
    .pipe(gulp.dest(root.js.vendor));                         // Output
});

gulp.task('build:js.plugins', function() {
  return gulp
    .src(components.jsLibraries.plugins)                      // Source
    .pipe(concat('libraries.plugins.js'))                     // Concatenating
    // .pipe(uglify())                                        // Minifying
    .pipe(gulp.dest(root.js.vendor));                         // Ouput
});

// -----------------------------------------------------------------------------
// Compiling tasks

// SASS
gulp.task('compile:sass', function() {
  return gulp
    .src(resources.sass.defaults)                             // Source
    .pipe(sourcemaps.init())                                  // Initializing source maps
    .pipe(sass({                                              // Compling
      indentedSyntax   : false,
      errLogToConsole  : true,
      outputStyle      : 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({                                      // Prefixing
      browsers         : ['last 2 versions'],
      cascade          : false
    }))
    .pipe(browserSync.stream())                               // Injecting CSS
    .pipe(sourcemaps.write(sourceMaps))                       // Writing source maps
    .pipe(gulp.dest(root.css.defaults))                       // Output
    .pipe(notify('Sass Compiled & Prefixed'));                // Notification
});

// -----------------------------------------------------------------------------
// Optimizing tasks

// Images
// Minify PNG, JPEG, GIF and SVG images
gulp.task('optimize:images', function() {
  return gulp
    .src(resources.images.defaults)                           // Source
    .pipe(imagemin({                                          // Optimizing
      progressive : true,
      svgoPlugins : [{removeViewBox: false}],
      use         : [pngquant()]
    }))
    .pipe(gulp.dest(root.images.defaults))                    // Output
    .pipe(notify('Image optimized'));                         // Notification
});

// -----------------------------------------------------------------------------
// Linting tasks

// HTML
gulp.task('lint:html', function() {
  return gulp
    .src(root.html.template)                                  // Source
    .pipe(htmlhint('.htmlhintrc'))                            // HTMLHint
    .pipe(htmlhint.reporter())                                // Default reporter
    .pipe(notify('HTML validated'));                          // Notification
});

// CSS
gulp.task('lint:css', function() {
  return gulp
    .src(root.css.main)                                       // Source
    .pipe(csslint('.csslintrc'))                              // CSSLint
    .pipe(csslint.reporter())                                 // Default reporter
    .pipe(notify('CSS validated'));                           // Notification
});

// JavaScript
gulp.task('lint:js', function() {
  return gulp
    .src(root.js.main)                                        // Source
    .pipe(jshint('.jshintrc'))                                // JSHint
    .pipe(jshint.reporter('jshint-stylish'))                  // Stylish reporter for JSHint
    .pipe(notify('JavaScript validated'));                    // Notification
});

// -----------------------------------------------------------------------------
// Live reload & browser syncing
gulp.task('browser-synchronize', function() {
  browserSync({
    proxy: localUrl                                           // Dynamic URL
  });
});

// -----------------------------------------------------------------------------
// Watching file changes
gulp.task('watch:changes', function() {
  // Compiling
  gulp.watch(resources.sass.defaults, ['compile:sass']);      // SASS

  // Reloading changes in the browser
  gulp.watch(root.html.template, browserReload);              // HTML
  gulp.watch(root.js.main, browserReload);                    // JavaScript
});

gulp.task('watch:lint', function() {
  gulp.watch(root.html.template, ['lint:html']);              // HTML
  gulp.watch(root.css.main, ['lint:css']);                    // CSS
  gulp.watch(root.js.main, ['lint:js']);                      // JavaScript
});

// -----------------------------------------------------------------------------
// Task runners

// Build : JavaScript libraries
gulp.task('build:js',
  [
    'build:js.core',                                          // Core
    'build:js.features',                                      // Features
    'build:js.polyfills',                                     // Polyfills
    'build:js.plugins'                                        // Plugins
  ]
);

// Build : All
gulp.task('build',
  [
    'build:js'                                                // JavaScript libraries
  ]
);

// Optimizing : All
gulp.task('optimize',
  [
    'optimize:images'                                         // Images
  ]
);

// Linting : All
gulp.task('lint',
  [
    'lint:html',                                              // HTML
    'lint:css',                                               // CSS
    'lint:js'                                                 // JavaScript
  ]
);

// Default
gulp.task('default',
  [
    'compile:sass',                                           // Compiling SASS
    'browser-synchronize',                                    // Live reload & browser syncing
    'watch:changes'                                           // Watching file changes
    // 'watch:lint'                                           // Linting
  ]
);
