/**
 *
 * @param variable
 * @returns {boolean}
 */
function isset(variable)
{
	if (typeof (variable) == "undefined" || variable == null)
		return false;
	else
		return !(typeof (variable) == "object" && !variable.length);
}

/**
 * gibt den Selector escaped für Jquery zurück
 * @param selector
 * @returns {*}
 */
function get_escaped_selector_name(selector)
{
	return selector.replace(/(:|\.|\[|\])/g,'\\$1');
}
