// Plugin dependencies
var gulp            = require('gulp'),                        // Gulp
    concat          = require('gulp-concat')                  // Concatinate files

// -----------------------------------------------------------------------------
// Globs
var root            = {
  src               : './src',                                // Sources
  dist: {
    js              : './dist/js',                            // Distribution - JS
    sass            : './dist/sass'                           // Distribution - SASS
  }
};

// -----------------------------------------------------------------------------
// Packages
var packages        = {

  js: [
    root.src + "/js/**/*"
  ],
  sass: [
    root.src + "/sass/**/*"
  ]

};

// -----------------------------------------------------------------------------
// Build tasks
// Concatenating, minifying, optimizing and organizing files

// JavaScript utilities
gulp.task('build:js.utilities', function() {
  gulp.src(packages.js)
    .pipe(concat('jquery.utilities.js'))
    .pipe(gulp.dest(root.dist.js + '/toolkit'));

  gulp.src(packages.js)
    .pipe(gulp.dest(root.dist.js));
});

// SASS function and mixin library
gulp.task('build:sass.utilities', function() {
  gulp.src(packages.sass)
    .pipe(gulp.dest(root.dist.sass));
});

gulp.task('build',
  [
    'build:js.utilities',                                     // JavaScript
    'build:sass.utilities'                                    // Sass
  ]
);
