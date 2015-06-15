// Plugin dependencies
var gulp            = require('gulp'),                        // Gulp
    sourcemaps      = require('gulp-sourcemaps'),             // Source maps
    autoprefixer    = require('gulp-autoprefixer'),           // Prefix CSS
    sass            = require('gulp-sass'),                   // Sass
    rename          = require('gulp-rename'),                 // Rename
    concat          = require('gulp-concat'),                 // Concatinate
    uglify          = require('gulp-uglify'),                 // Minified
    browserSync     = require('browser-sync');                // Browser sync

// -----------------------------------------------------------------------------
// Configurations
var browser_reload  = browserSync.reload,                     // Browser reloading
    document_root   = './public_html',                        // Document root
    packages        = './packages',                           // Packages
    packages_custom = document_root + '/js/custom'            // Custom packages
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
    main            : document_root + '/js/main.js',          // JS - main
    vendor          : document_root + '/js/vendor',           // JS - vendor
    custom          : document_root + '/js/custom'            // JS - custom
  },
  sass: {
    all             : document_root + '/sass/**/*.scss',      // SASS - all
    vendor          : document_root + '/sass/vendor/'         // SASS - vendor
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
      packages + '/ahomiya.wasabi/js/**/*'                    // Utilities
    ],
    features: [
      packages_custom + '/modernizr/modernizr.js',            // Feature detection
      packages + '/ua-parser-js/src/ua-parser.js'             // User-agent string parser
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
      packages + '/ahomiya.sukiyaki/scss/**/*'                // Function & mixin
    ]
  }

};

// -----------------------------------------------------------------------------
// Build tasks
// Concatenating, minifying, and optimizing files

// JavaScript libraries
gulp.task('js.core', function() {
  return gulp.src(packages.js_libraries.core)
    .pipe(concat('libraries.core.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('js.features', function() {
  return gulp.src(packages.js_libraries.features)
    .pipe(concat('libraries.features.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

gulp.task('js.polyfills', function() {
  return gulp.src(packages.js_libraries.polyfills)
    .pipe(concat('libraries.polyfills.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(root.js.vendor));
});

// SASS reset & normalize
gulp.task('sass.reset', function() {
  return gulp.src(packages.sass_frameworks.reset)
    .pipe(rename({prefix: '_', basename: 'reset', extname: '.scss'}))
    .pipe(gulp.dest(root.sass.vendor));
});

gulp.task('sass.normalize', function() {
  return gulp.src(packages.sass_frameworks.normalize)
    .pipe(gulp.dest(root.sass.vendor));
});

// SASS function and mixin library
gulp.task('sass.helpers', function() {
  return gulp.src(packages.sass_frameworks.helpers)
    .pipe(gulp.dest(root.sass.vendor));
});
// -----------------------------------------------------------------------------
// Compiling tasks

// SASS
gulp.task('sass', function() {
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
gulp.task('browser.sync', function() {
  // Initialize
  browserSync({
    proxy: url
  });

  // Injecting CSS
  gulp.watch(root.sass.all, ['sass']);

  // Reloading changes in the browser
  gulp.watch(root.html.template).on('change', browser_reload);
  gulp.watch(root.js.main).on('change', browser_reload);
});

// -----------------------------------------------------------------------------
// Task runners

// JavaScript libraries
gulp.task('js.library.build',
  [
    'js.core',           // Core
    'js.features',       // Features
    'js.polyfills'       // Polyfills
  ]
);

// SASS frameworks
gulp.task('sass.library.build',
  [
    'sass.reset',        // Reset
    'sass.normalize',    // Normalize
    'sass.helpers'       // Function & mixin
  ]
);

// Default
gulp.task('default',
  [
    'sass',              // Compiling SASS
    'browser.sync'       // Synchronising file changes
  ]
);
