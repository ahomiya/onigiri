// Plugin dependencies
var gulp            = require('gulp'),                        // Gulp
    sourcemaps      = require('gulp-sourcemaps'),             // Source maps
    autoprefixer    = require('gulp-autoprefixer'),           // Prefix CSS
    sass            = require('gulp-sass'),                   // Sass
    rename          = require('gulp-rename'),                 // Rename
    concat          = require('gulp-concat'),                 // Concatinate
    uglify          = require('gulp-uglify'),                 // Minify
    browserSync     = require('browser-sync');                // Browser sync

// -----------------------------------------------------------------------------
// Configurations
var browser_reload  = browserSync.reload,                     // Browser reloading
    document_root   = './public_html',                        // Document root
    packages        = './packages',                           // Packages
    packages_custom = document_root,                          // Custom packages
    toolkit         = '/ahomiya.toolkit/dist',                // Toolkit
    url             = 'ihost.ahomiya.com.onigiri';            // Server name

// -----------------------------------------------------------------------------
// Globs
var root            = {
  html : {
    template        : document_root + '/**/*.html'            // HTML template
  },
  css : {
    main            : document_root + '/css'                  // CSS - main
  },
  js: {
    default         : document_root + '/js',                  // JS - default
    main            : document_root + '/js/main.js',          // JS - main
    vendor          : document_root + '/js/vendor',           // JS - vendor
    custom          : document_root + '/js/vendor/custom'     // JS - custom
  },
  sass: {
    all             : document_root + '/sass/**/*.scss',      // SASS - all
    vendor          : document_root + '/sass/vendor',         // SASS - vendor
    vendor          : document_root + '/sass/vendor/custom'   // SASS - custom
  }
};

// -----------------------------------------------------------------------------
// Packages
var packages        = {

  // JavaScript libraries
  js_libraries: {
    core: [
      packages + '/jquery/dist/jquery.js',                    // Library
      packages + '/enquire/dist/enquire.js',                  // Media queries
      packages + '/smartresize/jquery.debouncedresize.js',    // Debounced resize
      packages + toolkit + '/js/toolkit/jquery.utilities.js', // Utilities
    ],
    features: [
      packages_custom + '/js/vendor/custom/modernizr.js',     // Feature detection
      packages + toolkit + '/js/toolkit/ua-parser.js',        // User-agent parser
      packages + toolkit + '/js/toolkit/ua-detection.js'      // User-agent detection
    ],
    plugins: [
      packages_custom + '/js/vendor/custom/console.js'        // Console
    ],
    polyfills: [
      packages + '/matchMedia/matchMedia.js',                 // Media queries polyfill
      packages + '/matchMedia/matchMedia.addListener.js'
    ]
  },

  // SASS frameworks
  sass_frameworks: {
    reset: [
      packages + '/reset-css/index.css'                       // CSS reset
    ],
    normalize: [
      packages + '/normalize-scss/_normalize.scss'            // CSS normalize
    ],
    helpers: [
      packages + toolkit + '/sass/**/*'                       // Function & mixin
    ]
  }

};

// -----------------------------------------------------------------------------
// Build tasks
// Concatenating, minifying, and optimizing files

// JavaScript libraries
gulp.task('build:js.core', function() {
  return gulp.src(packages.js_libraries.core)
    .pipe(concat('libraries.core.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('build:js.features', function() {
  return gulp.src(packages.js_libraries.features)
    .pipe(concat('libraries.features.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('build:js.polyfills', function() {
  return gulp.src(packages.js_libraries.polyfills)
    .pipe(concat('libraries.polyfills.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('build:js.plugins', function() {
  return gulp.src(packages.js_libraries.plugins)
    .pipe(concat('libraries.plugins.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

// SASS reset & normalize
gulp.task('build:sass.reset', function() {
  return gulp.src(packages.sass_frameworks.reset)
    .pipe(rename({prefix: '_', basename: 'reset', extname: '.scss'}))
    .pipe(gulp.dest(root.sass.vendor));
});

gulp.task('build:sass.normalize', function() {
  return gulp.src(packages.sass_frameworks.normalize)
    .pipe(gulp.dest(root.sass.vendor));
});

// SASS function and mixin library
gulp.task('build:sass.helpers', function() {
  return gulp.src(packages.sass_frameworks.helpers)
    .pipe(gulp.dest(root.sass.vendor));
});
// -----------------------------------------------------------------------------
// Compiling tasks

// SASS
gulp.task('compile:sass', function() {
  return gulp.src(root.sass.all)
    // Source map - initialize
    .pipe(sourcemaps.init())

    // Compiling
    .pipe(sass({
      includePaths     : require('node-sass').includePaths,
      indentedSyntax   : false,
      errLogToConsole  : true,
      outputStyle      : 'nested'
    }))

    // Prefix
    .pipe(autoprefixer({
      browsers         : ['last 2 versions'],
      cascade          : false
    }))

    // Source map - output
    .pipe(sourcemaps.write('../maps'))

    // Output
    .pipe(gulp.dest(root.css.main))

    // Injecting
    .pipe(browserSync.stream());
});

// -----------------------------------------------------------------------------
// Synchronising file changes
gulp.task('synchronize:browser', function() {
  // Initialize
  browserSync({
    proxy: url
  });

  // Injecting CSS
  gulp.watch(root.sass.all, ['compile:sass']);

  // Reloading changes in the browser
  gulp.watch(root.html.template).on('change', browser_reload);
  gulp.watch(root.js.main).on('change', browser_reload);
});

// -----------------------------------------------------------------------------
// Task runners

// JavaScript libraries
gulp.task('build:js.libraries',
  [
    'build:js.core',           // Core
    'build:js.features',       // Features
    'build:js.polyfills',      // Polyfills
    'build:js.plugins'         // Plugins
  ]
);

// SASS frameworks
gulp.task('build:sass.libraries',
  [
    'build:sass.reset',        // Reset
    'build:sass.normalize',    // Normalize
    'build:sass.helpers'       // Function & mixin
  ]
);

// Default
gulp.task('default',
  [
    'compile:sass',            // Compiling SASS
    'synchronize:browser'      // Synchronising file changes
  ]
);
