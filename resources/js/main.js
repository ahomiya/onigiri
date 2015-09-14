/**
 * Project                    : Onigiri
 * JavaScript libraries       : jQuery
 * Features detection library : Modernizr
 * Developers                 : ahomiya.com
 */

// -----------------------------------------------------------------------------
// Variables
const $window    = $(window);
const $document  = $(document);
const $html      = $('html');
const $body      = $('body');

// -----------------------------------------------------------------------------
// Functions


// -----------------------------------------------------------------------------
// Document ready
// Specify a function to execute when the DOM is fully loaded.
$document.ready(function() {

  // Media queries
  enquire.register('screen and (min-width: 768px)', {
    setup   : function() {
      console.log('Media query : Desktop / Set up');
    },
    match   : function() {
      console.log('Media query : Desktop');
    },
    unmatch : function() {
      console.log('Media query : Mobile');
    }
  });

  // Existing element
  $body.exists(function() {
    console.log('Body element exists');
  });

  // Checking screen type
  if (Modernizr.touch) {
    console.log('Screen type : Touch');
  } else {
    console.log('Screen type : Standard');
  }

  // Log
  console.log('DOM is fully loaded.');
});

// -----------------------------------------------------------------------------
// Window - load
// Specify a function to execute when complete page is fully loaded.
$window.load(function() {

  // Log
  console.log('Page is fully loaded.');
});

// -----------------------------------------------------------------------------
// Window - resize
$window.on('debouncedresize', function() {

  // Log
  console.log('Window has been resized.');

});
