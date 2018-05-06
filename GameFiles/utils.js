var utils = this;

/// Takes an optional magnitude to reduce recomputation
UnitVector = function( x, y, m, verbose = false ) {
	if ( m==undefined ) {
		m = Magnitude(x,y);
	}
	if ( verbose ) {
		console.log(x);
		console.log(y);
		console.log(m);
	}
	if ( m == 0 ) {
		return {
			x: 0,
			y: 0,
			m: 0
		};
	}
	return {
		x: x/m,
		y: y/m,
		m: m
	};
}

Magnitude = function(x,y) {
	return Math.sqrt( x*x + y*y );
}

Distance = function( x1, y1, x2, y2 ) {
	return Magnitude( x2 - x1, y2 - y1 );
}

DistanceSquared = function( x1, y1, x2, y2 ) {
	let u = x2 - x1;
	let v = y2 - y1;
	return u*u + v*v;
}

GetAngle = function( x, y ) {
    // get the angle of the vector<x,y>
    return Math.atan2( y, x );
}

RandomVector = function( vx, vy, angle_variance, magnitude, magnitude_variance ) {
    // returns a vector with a similar direction to vector <vx, vy>
    // with the direction randomized by + or - up to angle_variance (in radians)
    // and a magnitude/length of the given magnitude + or - up to magnitude_variance

    // get a random value between +angle_variance and -angle_variance
    var v = Math.random() * 2.0 * angle_variance - angle_variance;
    // get the angle of <vx,vy> and add our randomness
    let theta = GetAngle( vx, vy ) + v;

    // get a random value between +magnitude_variance and -magnitude_variance
    let mag_var = Math.random() * 2.0 * magnitude_variance - magnitude_variance;
    // get the sum of the desired magnitude and our randomness
    let m = magnitude + mag_var;
    // turn our angle and magnitude into a vector
    let x = Math.cos(theta) * m;
    let y = Math.sin(theta) * m;
    // console.log(mag_var);
    return {
    	x: x,
    	y: y
    };
}
