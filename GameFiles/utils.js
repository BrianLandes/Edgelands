var utils = this;

/// Takes an optional magnitude to reduce recomputation
UnitVector = function( x, y, m ) {
	if ( !m ) {
		m = Magnitude(x,y);
	}
	return {
		x: x/m,
		y: y/m
	};
}

Magnitude = function(x,y) {
	return Math.sqrt( x*x + y*y );
}

Distance = function( x1, y1, x2, y2 ) {
	return Magnitude( x2 - x1, y2 - y1 );
}