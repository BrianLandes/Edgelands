
var BULLET_SPEED = 40;
var BULLET_DISTANCE = 600;
var BULLET_SPAWN_DISTANCE = 50;
var BULLET_SPAWN_Y_OFFSET = -30;

class Bullets {
	constructor(game) {
		this.game = game;
		this.fireRate = 0.3;

		this._fireDelay = 0;

		this._ = [];

		this.physicsCategory = this.game.matter.world.nextCategory();
		this.physicsGroup = this.game.matter.world.nextGroup(true);
        this.physicsOptions = { friction: 0.0000001, collisionFilter: { group: [this.physicsGroup, this.game.bubble.levelGenerator.physicsGroup] }, isStatic: false, };

	}

	Update(deltaTime) {
		if ( this._fireDelay > 0 ) {
			this._fireDelay -= deltaTime;
		} else {
			if ( controller.Fire ) {
				let v = controller.AimAxis;
	            this.New( player.x, player.y, v );
	            this._fireDelay = this.fireRate;
	        }
		}

		list_utils.BeginPreserve();

		for ( let i = 0; i < this._.length; i ++ ) {
			let bullet = this._[i];
			let d = utils.DistanceSquared(bullet.x,bullet.y,player.x,player.y);
			bullet.depth = bullet.y;
			if ( d > BULLET_DISTANCE * BULLET_DISTANCE|| bullet.isDead ) {
				bullet.destroy();
				
			} else {
				list_utils.Preserve(bullet);
			}

		}

		this._ = list_utils.EndPreserve();

	}

	// Takes the world position x,y and a unit vector2 for the direction to fire in
	New(x,y,dir) {
		let vx = dir.x * BULLET_SPEED + player._sprite.body.velocity.x * 0.5;
		let vy = dir.y * BULLET_SPEED + player._sprite.body.velocity.y * 0.5;

		let bullet = this.game.matter.add.sprite( x + dir.x * BULLET_SPAWN_DISTANCE, y + dir.y * BULLET_SPAWN_DISTANCE + BULLET_SPAWN_Y_OFFSET, 'bullet' );
		// let bullet = this.game.bullets.create( x + dir.x * BULLET_SPAWN_DISTANCE, y + dir.y * BULLET_SPAWN_DISTANCE + BULLET_SPAWN_Y_OFFSET, 'bullet')
		// 	.setVelocity(vx, vy);
		
		// bullet.rotation = utils.GetAngle(dir.x,dir.y);
		// bullet.body.setCircle(30);
		bullet.setCircle( 20, this.physicsOptions);
		bullet.setVelocity(vx,vy);
		bullet.setFixedRotation();
		bullet.setRotation( utils.GetAngle(dir.x,dir.y) );
		bullet.setCollisionCategory(this.physicsCategory);
		// bullet.setCollidesWith([this.physicsCategory,this.game.bubble.levelGenerator.physicsCategory, bullets.physicsCategory]);
		// bullet.body.setOffset(-ZOBLIN_RADIUS*0.5 + bullet.originX * bullet.width,-ZOBLIN_RADIUS*0.5+ bullet.originY * bullet.height);
		bullet.depth = bullet.y;
		bullet.isDead = false;
		bullet.isBullet = true;

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

