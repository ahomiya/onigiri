// Has attribute
// Determine whether any of the matched elements are assigned the given attribute.
$.fn.hasAttr = function(name) {
	return this.attr(name) !== undefined;
};
