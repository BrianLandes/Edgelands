
var ZOBLIN_MOVE_SPEED = 490;
var ZOBLIN_RADIUS = 28;
var ZOBLIN_MAX = 100;
var ZOBLIN_SPAWN_DISTANCE = 900;
var ZOBLIN_SURROUND_RADIUS = 200;

class Zoblins {
	constructor(game) {
		this.game = game;

		// this.game.physics.add.collider(player._sprite, this.group);
		// this.game.physics.add.collider(this.group, this.group);
		// this.game.physics.add.collider(this.game.obstacles, this.group);
		// this.game.physics.add.overlap(this.game.bullets, this.group, this.HitByBullet);
		this.game.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
			if ( bodyA.gameObject.isZomblin ) {
				if ( bodyB.gameObject.isBullet ) {
					this.HitByBullet( bodyB.gameObject, bodyA.gameObject);
					console.log("is bullet");
				}
				console.log("is zoblin");
			} else if ( bodyB.gameObject.isZomblin ) {
				if ( bodyA.gameObject.isBullet ) {
					this.HitByBullet( bodyA.gameObject, bodyB.gameObject);
					console.log("is bullet B");
				}
				console.log("is zoblin B");
			}
	        // bodyA.gameObject.setTint(0xff0000);
	        // bodyB.gameObject.setTint(0x00ff00);

	    }, this);
		this.spawnRate = 2.3;

		this._spawnDelay = 0;

		this.graphics = this.game.make.graphics();

		this._ = [];

		this.game.anims.create({
            key: 'zoblinRun',
            frames: this.game.anims.generateFrameNumbers('zoblin', { start: 0, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        this.physicsCategory = this.game.matter.world.nextCategory();
        // this.physicsOptions = { friction: 0.0000001, collisionFilter: { group: [this.physicsGroup, this.game.bubble.levelGenerator.physicsGroup] }, isStatic: false, };

	}

	Update(deltaTime) {
		this.graphics.clear();
        this.graphics.alpha = 0.5;

		if ( this._spawnDelay > 0 ) {
			this._spawnDelay -= deltaTime;
		} else {
			this.SpawnNewEnemy();
	        this._spawnDelay += this.spawnRate;
		}

		let pfv = player.ForwardVector;

		list_utils.BeginPreserve();

		for ( let i = 0; i < this._.length; i ++ ) {
			let zoblin = this._[i];

			let d = DistanceSquared(player.x,player.y,zoblin.x,zoblin.y);

			let targetx = player.x + pfv.x * ZOBLIN_SURROUND_RADIUS;
			let targety = player.y + pfv.y * ZOBLIN_SURROUND_RADIUS;

			if ( d > ZOBLIN_SURROUND_RADIUS*ZOBLIN_SURROUND_RADIUS ) {
				targetx = player.x - pfv.y* ZOBLIN_SURROUND_RADIUS * zoblin.flank;
				targety = player.y + pfv.x* ZOBLIN_SURROUND_RADIUS * zoblin.flank;
			} else if ( d < ZOBLIN_SURROUND_RADIUS*ZOBLIN_SURROUND_RADIUS / 2 ) {
				targetx = player.x;
				targety = player.y;
			}


			

			let v = utils.UnitVector( targetx-zoblin.x, targety-zoblin.y );
			zoblin.setVelocityX( v.x * ZOBLIN_MOVE_SPEED * deltaTime );
			zoblin.setVelocityY( v.y * ZOBLIN_MOVE_SPEED * deltaTime );
			// console.log( deltaTime);
			// let weight = .5;
			// zoblin.setVelocityX( (zoblin.body.velocity.x*weight + v.x * ZOBLIN_MOVE_SPEED ) / (1+weight) );
			// zoblin.setVelocityY( (zoblin.body.velocity.y*weight + v.y * ZOBLIN_MOVE_SPEED ) / (1+weight));
			// zoblin.setAccelerationX( v.x * ZOBLIN_MOVE_SPEED );
			// zoblin.setAccelerationY( v.y * ZOBLIN_MOVE_SPEED );
			zoblin.depth = zoblin.y;

			// this.graphics.depth = zoblin.y - 10;
	  //       this.graphics.fillCircle(zoblin.x,zoblin.y,20);

			// console.log(zoblin);

			if ( v.x > 0 ) {
				zoblin.flipX = false;
			} else {
				zoblin.flipX = true;
			}

			if ( zoblin.isDead ) {
				zoblin.destroy();
				
			} else {
				list_utils.Preserve(zoblin);
			}

		}

		this._ = list_utils.EndPreserve();

	}

	// Takes the world position x,y and a unit vector2 for the direction to fire in
	SpawnNewEnemy() {
		if ( this._.length > ZOBLIN_MAX ) {
			return;
		}
		let v = player.ForwardVector;
		let zoblin = null;
		if ( v.m == 0 ) {
			let r = utils.RandomVector(1,0, Math.PI, ZOBLIN_SPAWN_DISTANCE, 10);
			let newx = player.x + r.x;
        	let newy = player.y + r.y;
			zoblin = this.game.matter.add.sprite( newx, newy, 'zoblin' );
		} else {
			// let r = utils.RandomVector(vx,vy,this.scatter_angle_variance,
   //                        this.scatter_spawning_distance,this.distance_variance);
			let r = utils.RandomVector( -v.x, -v.y, Math.PI/2, ZOBLIN_SPAWN_DISTANCE, 10);
			let newx = player.x + r.x;
        	let newy = player.y + r.y;
        	zoblin = this.game.matter.add.sprite( newx, newy, 'zoblin' );
		}

		zoblin.flank = Math.random() * 2 - 1;
		zoblin.isZomblin = true;

		
		zoblin.anims.play('zoblinRun', true);
		zoblin.setScale(2 + (Math.random() * 0.8-0.4));
		zoblin.setTint( (1-Math.random() *0.001) * 0xffffff );
		// zoblin.rotation = utils.GetAngle(dir.x,dir.y);
		zoblin.setCircle(ZOBLIN_RADIUS);
		zoblin.setOrigin(0.5,0.6);
		zoblin.setCollisionCategory(this.physicsCategory);
        zoblin.setCollidesWith([player.physicsCategory,this.physicsCategory,this.game.bubble.levelGenerator.physicsCategory, bullets.physicsCategory]);
        zoblin.setFixedRotation();
		// zoblin.body.setOffset(-ZOBLIN_RADIUS*0.5 + zoblin.originX * zoblin.width,-ZOBLIN_RADIUS*0.5+ zoblin.originY * zoblin.height);
		zoblin.depth = zoblin.y;
		zoblin.isDead = false;

		this._.push(zoblin);
	}

	HitByBullet(bullet, zoblin) {
		bullet.isDead = true;
		zoblin.isDead = true;
	}

}