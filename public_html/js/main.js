/**
 * Project                    : Project name
 * JavaScript libraries       : jQuery
 * Features detection library : Modernizr
 * Developers                 : ahomiya.com
 */

// -----------------------------------------------------------------------------
// Variables
var $window                   = $(window),
    $document                 = $(document),
    $html                     = $('html'),
    $body                     = $('body');
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
$window.resize(function() {

  // Log
  console.log('Window\'s is changed.');
});
