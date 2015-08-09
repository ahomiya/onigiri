// Has classes
// Determine whether any of the matched elements are assigned the given classes.
$.fn.hasClasses = function(selectors) {
  for (var i in selectors) {
    if($(this).hasClass(selectors[i])) {
      return true;
    }
  }
  return false;
};
