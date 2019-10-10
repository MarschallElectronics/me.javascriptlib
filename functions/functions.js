/**
 *
 * @param variable
 * @returns {boolean}
 *
 * @todo ist noch ungetestet
 */
function isset(variable)
{
	if (typeof (variable) == "undefined" || variable == null)
		return false;
	else
		return !(typeof (variable) == "object" && !variable.length);
}