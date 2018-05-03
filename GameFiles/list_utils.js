
var list_utils = this;

list_utils.Remove = function(list, object) {

	for( let i = 0; i < list.length; i ++ ) {
		var element = list[i];
		if ( element == object ) {
			list.splice(i,1);
			return;
		}
	}
};