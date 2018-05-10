
var list_utils = this;

Remove = function(list, object) {

	for( let i = 0; i < list.length; i ++ ) {
		var element = list[i];
		if ( element == object ) {
			list.splice(i,1);
			return;
		}
	}
};

RemoveAt = function(list, index) {

	list.splice(index,1);
};

var _purgeBuffer = [];

BeginPurge = function() {
	_purgeBuffer = [];
}

Purge = function(item) {
	_purgeBuffer.push(item);
}

EndPurge = function(list) {
	for( let i = 0; i < _purgeBuffer.length; i ++ ) {
		list_utils.Remove(list,_purgeBuffer[i]);
	}
}

var _preserveBuffer = [];

BeginPreserve = function() {
	_preserveBuffer = [];
}

Preserve = function(item) {
	_preserveBuffer.push(item);
}

EndPreserve = function() {
	return _preserveBuffer;
}
