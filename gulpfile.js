// Plugin dependencies
var gulp            = require('gulp'),                        // Gulp
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
    localUrl        = 'local' + project + localDomain,        // Local URL

    componentPackage= './components/package',                 // Package components
    componentCustom = './components/custom'                   // Custom components

// -----------------------------------------------------------------------------
// Methods
var browserReload   = browserSync.reload;                     // Browser reloading

// -----------------------------------------------------------------------------
// Globs

var toolkit         = '/toolkit/dist',                        // Toolkit framework
    sourceFiles     = localHost + '/sourcefiles',             // Source files
    sourceMaps      = '../sourcemaps',                        // Source maps
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
      sass: {
        common      : localHost + '/sass/**/*.scss',          // SASS - common
        vendor      : localHost + '/sass/vendor'              // SASS - vendor
      },
      images: {
        defaults    : localHost + '/img',                     // Images - defaults
        source      : sourceFiles + '/img/**/*'               // Images - source
      },
      source: {
        js          : sourceFiles + '/js/**/*',               // Source - JavaScript
        images      : sourceFiles + '/img/**/*'               // Source - images
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
      componentCustom + '/modernizr/modernizr.js',
      componentPackage + '/ua-parser-js/src/ua-parser.js',
      componentPackage + '/ua-detection-js/src/ua-detection.js'
    ],
    polyfills: [
      componentPackage + '/matchMedia/matchMedia.js',
      componentPackage + '/matchMedia/matchMedia.addListener.js'
    ],
    plugins: []
  },

  // SASS frameworks
  sassFrameworks: {
    reset: [
      componentPackage + '/reset-css/index.css'
    ],
    normalize: [
      componentPackage + '/normalize-scss/_normalize.scss'
    ],
    helpers: [
      componentPackage + toolkit + '/sass/**/*'
    ]
  }

};

// -----------------------------------------------------------------------------
// Build tasks
// Concatenating, minifying, and optimizing files

// JavaScript libraries
gulp.task('build:js.core', function() {
  return gulp.src(components.jsLibraries.core)
    .pipe(concat('libraries.core.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('build:js.features', function() {
  return gulp.src(components.jsLibraries.features)
    .pipe(concat('libraries.features.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('build:js.polyfills', function() {
  return gulp.src(components.jsLibraries.polyfills)
    .pipe(concat('libraries.polyfills.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('build:js.plugins', function() {
  return gulp.src(components.jsLibraries.plugins)
    .pipe(concat('libraries.plugins.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

// SASS reset & normalize
gulp.task('build:sass.reset', function() {
  return gulp.src(components.sassFrameworks.reset)
    .pipe(rename({prefix: '_', basename: 'reset', extname: '.scss'}))
    .pipe(gulp.dest(root.sass.vendor));
});

gulp.task('build:sass.normalize', function() {
  return gulp.src(components.sassFrameworks.normalize)
    .pipe(gulp.dest(root.sass.vendor));
});

// SASS function and mixin library
gulp.task('build:sass.helpers', function() {
  return gulp.src(components.sassFrameworks.helpers)
    .pipe(gulp.dest(root.sass.vendor));
});
// -----------------------------------------------------------------------------
// Compiling tasks

// SASS
gulp.task('compile:sass', function() {
  return gulp.src(root.sass.common)
    // Source map - initialize
    .pipe(sourcemaps.init())

    // Compiling
    .pipe(sass({
      indentedSyntax   : false,
      errLogToConsole  : true,
      outputStyle      : 'expanded'
    }).on('error', sass.logError))

    // Prefix
    .pipe(autoprefixer({
      browsers         : ['last 2 versions'],
      cascade          : false
    }))

    // Source map - output
    .pipe(sourcemaps.write(sourceMaps))

    // Output
    .pipe(gulp.dest(root.css.defaults))

    // Injecting CSS
    .pipe(browserSync.stream());
});

// -----------------------------------------------------------------------------
// Optimizing tasks

// Images
// Minify PNG, JPEG, GIF and SVG images
gulp.task('optimize:images', function() {
  gulp
    .src(root.images.source)
    .pipe(imagemin({
      progressive : true,
      svgoPlugins : [{removeViewBox: false}],
      use         : [pngquant()]
    }))
    .pipe(gulp.dest(root.images.defaults));
});

// -----------------------------------------------------------------------------
// Validation tasks

// HTML
gulp.task('lint:html', function() {
  return gulp.src(root.html.template)
    .pipe(htmlhint('.htmlhintrc'))                            // HTMLHint
    .pipe(htmlhint.reporter())                                // Default reporter
});

// CSS
gulp.task('lint:css', function() {
  return gulp.src(root.css.main)
    .pipe(csslint('.csslintrc'))                              // CSSLint
    .pipe(csslint.reporter());                                // Default reporter
});

// JavaScript
gulp.task('lint:js', function() {
  return gulp.src(root.js.main)
    .pipe(jshint('.jshintrc'))                                // JSHint
    .pipe(jshint.reporter('jshint-stylish'))                  // Stylish reporter for JSHint
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
  gulp.watch(root.sass.common, ['compile:sass']);             // SASS

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
gulp.task('build:js.libraries',
  [
    'build:js.core',                                          // Core
    'build:js.features',                                      // Features
    'build:js.polyfills',                                     // Polyfills
    'build:js.plugins'                                        // Plugins
  ]
);

// Build : SASS frameworks
gulp.task('build:sass.libraries',
  [
    'build:sass.reset',                                       // Reset
    'build:sass.normalize',                                   // Normalize
    'build:sass.helpers',                                     // Function & mixin
  ]
);

// Build : All
gulp.task('build',
  [
    'build:js.libraries',                                     // JavaScript libraries
    'build:sass.libraries'                                    // SASS frameworks
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
