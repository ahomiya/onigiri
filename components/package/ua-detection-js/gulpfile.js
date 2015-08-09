// Plugin dependencies
var gulp            = require('gulp'),                        // Gulp
    concat          = require('gulp-concat'),                 // Concatinate files
    uglify          = require('gulp-uglify')                  // Minify files

// -----------------------------------------------------------------------------
// Globs
var components      = './bower_components',                   // Components
    js              = {
    src             : './src',                                // Sources
    dist            : './dist'                                // Distribution
};

// -----------------------------------------------------------------------------
// Packages
var packages        = {

  js: {
    parser          : [
      components + '/ua-parser-js/src/ua-parser.js'           // UA - Parser
    ],
    detection       : [
      js.src + '/ua-detection.js'                             // UA - Detection
    ]
  }

};

// -----------------------------------------------------------------------------
// Build tasks
// Concatenating, minifying, optimizing and organizing files

// UA - Detection
gulp.task('build:js.detection', function() {
  return gulp.src(packages.js.detection)
    .pipe(concat('ua-detection.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js.dist));
});

// UA - Parser
gulp.task('build:js.parser', function() {
  return gulp.src(packages.js.parser)
    .pipe(concat('ua-parser.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js.dist));
});

gulp.task('build',
  [
    'build:js.parser',                                        // Parser
    'build:js.detection'                                      // Detection
  ]
);
