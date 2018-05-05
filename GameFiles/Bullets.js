
var BULLET_SPEED = 600;
var BULLET_DISTANCE = 1000;
var BULLET_SPAWN_DISTANCE = 50;

class Bullets {
	constructor(game) {
		this.game = game;
		this.fireRate = 0.3;

		this._fireDelay = 0;

		this._ = [];
	}

	Update() {
		if ( this._fireDelay > 0 ) {
			this._fireDelay -= deltaTime;
		} else {
			if ( controller.Fire ) {
				let v = controller.AimAxis;
	            this.New( player.x, player.y, v );
	            this._fireDelay = this.fireRate;
	        }
		}

		let buffer = [];

		for ( let i = 0; i < this._.length; i ++ ) {
			let bullet = this._[i];
			let d = utils.Distance(bullet.x,bullet.y,player.x,player.y);
			bullet.depth = bullet.y;
			if ( d > BULLET_DISTANCE ) {
				bullet.destroy();
				buffer.push(bullet);
			} 

		}

		for( let i = 0; i < buffer.length; i ++ ) {
			list_utils.Remove(this._,buffer[i]);
		}

	}

	// Takes the world position x,y and a unit vector2 for the direction to fire in
	New(x,y,dir) {
		let vx = dir.x * BULLET_SPEED + player._sprite.body.velocity.x * 0.5;
		let vy = dir.y * BULLET_SPEED + player._sprite.body.velocity.y * 0.5;


		let bullet = this.game.bullets.create( x + dir.x * BULLET_SPAWN_DISTANCE, y + dir.y * BULLET_SPAWN_DISTANCE, 'bullet')
			.setVelocity(vx, vy);
		bullet.rotation = utils.GetAngle(dir.x,dir.y);
		bullet.body.setCircle(10);
		bullet.depth = bullet.y;

		this._.push(bullet);
		// console.log(dir);
		// bullet.setVelocityX(dir.x);
		// bullet.setVelocityY(dir.y);
		// bullet.update = function() {
		// 	console.log("Bullet");
		// };
		// tree.s = 1 + this.noise.noise(x,y)*0.5;


	 //    tree.setScale(3 * tree.s);
	 //    tree.setOrigin(0.5,0.6);
	 //    tree.body.setCircle(50 * tree.s);
	 //    tree.body.setOffset(-25 * tree.s + tree.originX * tree.width,-25 * tree.s + tree.originY * tree.height);
	 //    tree.depth = tree.y;
	}
}

