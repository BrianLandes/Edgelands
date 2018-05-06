
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

var _purgeBuffer = [];
var _purgeI = 0;

BeginPurge = function() {
	_purgeBuffer = [];
	_purgeI = 0;
}

Purge = function(item) {
	_purgeBuffer.push(item);
}

EndPurge = function(list) {
	for( let i = 0; i < _purgeBuffer.length; i ++ ) {
		list_utils.Remove(list,_purgeBuffer[i]);
	}
}

ForEachStart = function(list, itemRef) {
	itemRef = list[_purgeI++];
}