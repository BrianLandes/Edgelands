
class LevelGenerator {

	constructor(bubble) {
		this.bubble = bubble;
		
		this.spawn_rate = 100; // distance the player must move each time we spawn
                this.scatter_angle_variance = Math.PI / 6; // up to 45 degrees in either direction
                this.scatter_spawning_distance = 1100;
                this.distance_variance = 100;

                this.snake_angle_variance = Math.PI * 0.25;
                this.snake_max_spawn_distance = 1300;

                this.last_spawned_obstacle = null;
                this.snake_vx = 0;
                this.snake_vy = 0;

                // save the position of the player each time we spawn something
                // we'll use it (and the new position of the player) to determine when to spawn the next thing
                this.last_spawn_position_x = 0;
                this.last_spawn_position_y = 0;

                this.gameObjects = [];

                this.physicsGroup = this.bubble.game.matter.world.nextGroup(false);
                this.physicsCategory = this.bubble.game.matter.world.nextCategory();
                // this.physicsOptions = { friction: 0.0000001, collisionFilter: { category: this.physicsCategory}, isStatic: true, };
                // this.physicsOptions = { friction: 0.0000001, collisionFilter: { group: this.physicsGroup }, isStatic: true, };
                this.physicsOptions = { friction: 0.0000001, collisionFilter: { group: this.physicsGroup }, isStatic: true, };

	}

        Update() {
                this.Scatter();
                this.Snake();
                this.UpdateObjects();
        }

        Scatter() {

                let player = this.bubble.players[0];
                // if self.type is SCATTER or self.last_spawned_obstacle is None:
                // get the distance the players moved since we last spawned something
                let d = utils.Distance( this.last_spawn_position_x, this.last_spawn_position_y,
                              player.x, player.y);

                if (d > this.spawn_rate){
                        // then we'll spawn something

                        // create a random point in front of the player, outside of the screen
                        let vx = player.x - this.last_spawn_position_x
                        let vy = player.y - this.last_spawn_position_y
                        let r = utils.RandomVector(vx,vy,this.scatter_angle_variance,
                                          this.scatter_spawning_distance,this.distance_variance);
                        let newx = player.x + r.x;
                        let newy = player.y + r.y;

                        let tree = this.NewObstacle( newx, newy);

                        if (this.last_spawned_obstacle == null || Math.random()>0.9) {
                                this.last_spawned_obstacle = tree
                                this.snake_vx = vx
                                this.snake_vy = vy
                        }

                        // finalize
                        this.last_spawn_position_x = player.x
                        this.last_spawn_position_y = player.y
                }
        }

        Snake() {
                let player = this.bubble.players[0];
                // elif self.type is SNAKE:
                if (this.last_spawned_obstacle == undefined || this.last_spawned_obstacle.body==undefined || this.last_spawned_obstacle.body.position==undefined ) {
                    return;
                }
                // get the distance between the player and the last spawned object
                let d = utils.Distance( this.last_spawned_obstacle.x, this.last_spawned_obstacle.y,
                              player.x, player.y)

                // if that distance is less than our spawning distance we'll spawn another obstacle to try and stay ahead
                if( d < this.snake_max_spawn_distance) {

                        
                        // console.log(tree);
                        // level_mod = PLAYER_RADIUS*0.3 * (self.game.level-1)
                        // if level_mod >= PLAYER_RADIUS*3.0:
                        //         level_mod = PLAYER_RADIUS*3.0
                        // let magnitude = tree.width*0.5 + this.last_spawned_obstacle.width+PLAYER_SIZE*2.5; //-level_mod
                        let magnitude = this.last_spawned_obstacle.width+PLAYER_SIZE*2.5; //-level_mod
                        let mag_variance = PLAYER_SIZE*2.0;
                        // if self.game.level >= 4:
                        //         mag_variance = max(0,mag_variance - PLAYER_SIZE*0.2 * (self.game.level-13))

                        let r = utils.RandomVector(this.snake_vx,this.snake_vy,this.snake_angle_variance,
                                          magnitude, mag_variance );
                        // console.log(r);
                        let newx = this.last_spawned_obstacle.x + r.x;
                        let newy = this.last_spawned_obstacle.y + r.y;

                        let tries_left = 10;
                        while ( utils.Distance( newx, newy, player.x, player.y ) < this.scatter_spawning_distance){
                                // if the tree would spawn where the player can see then try to find another place
                                let r = utils.RandomVector(this.snake_vx,this.snake_vy,this.snake_angle_variance,
                                                  magnitude, mag_variance );

                                newx = this.last_spawned_obstacle.x + r.x
                                newy = this.last_spawned_obstacle.y + r.y
                                tries_left -= 1
                                if (tries_left == 0){
                                    this.last_spawned_obstacle = null;
                                    // print('Snake giving up')
                                    // this.bubble.RemoveObstacle(tree);// we need to remove it
                                    return // not only break out of the loop but give up on making a tree
                                }
                        }


                        // console.log(newx);
                        // tree.x = newx;
                        // tree.y = newy;
                        let tree = this.NewObstacle( newx, newy, 'tree_purple');
                        // tree.depth = tree.y;
                        // console.log(tree);
                        // tree.body.setCircle(50 * tree.s);
                        // tree.body.setOffset(-25 * tree.s + tree.originX * tree.width,-25 * tree.s + tree.originY * tree.height);
                        // tree.body.updateCenter();

                        this.snake_vx = newx - this.last_spawned_obstacle.x;
                        this.snake_vy = newy - this.last_spawned_obstacle.y;
                        this.last_spawned_obstacle = tree;
                }
        }

        DistanceToClosestPlayer( point ) {
                return utils.DistanceSquared(point.x,point.y,player.x,player.y);
                // let result = 100000000;
                // for( let i = 0; i < this.players.length ; i ++ ) {
                //         let player = this.players[i];
                //         let x = point.x - player.x;
                //         let y = point.y - player.y;
                //         let d = x*x + y*y;
                //         if ( d < result ) {
                //                 result = d;
                //         }
                // }
                // return Math.sqrt(result) * screenToGrid;
        }

        UpdateObjects() {
                // this.graphics.clear();
                // this.graphics.alpha = 0.5;

                list_utils.BeginPreserve();

                // console.log(this.gameObjects);
                for( let i = 0; i < this.gameObjects.length; i++ ) {
                        let gameObject = this.gameObjects[i];
                        let d = this.DistanceToClosestPlayer(gameObject);
                        if  ( d > this.scatter_spawning_distance * this.scatter_spawning_distance * 4 ) {
                                // console.log(gameObject);
                                gameObject.destroy();
                                
                        } else {
                                list_utils.Preserve(gameObject);
                        // this.graphics.depth = gameObject.y - 1;
                       
                        // this.graphics.fillCircle( gameObject.body.position.x, gameObject.body.position.y, gameObject.body.circleRadius);
                        }
                }
                this.gameObjects = list_utils.EndPreserve();

                // console.log(this.gameObjects.length);
        }

        NewObstacle( x, y, key ) {
                if ( key==undefined){
                        key = 'tree_green';
                }
                
                var tree = this.bubble.game.matter.add.sprite(x, y, key );

                tree.s = 1 + this.bubble.noise.noise(x,y)*0.5;


                tree.setScale(3 * tree.s);
                
                tree.setCircle(60 * tree.s, this.physicsOptions);
                tree.setCollisionCategory(this.physicsCategory);
                tree.setCollidesWith([player.physicsCategory,this.bubble.game.zoblins.physicsCategory]);
                // tree.setStatic(true);
                // tree.setCollisionGroup(this.physicsGroup);
                tree.setOrigin(0.5,0.7);
                // tree.body.setOffset(-25 * tree.s + tree.originX * tree.width,-25 * tree.s + tree.originY * tree.height);
                tree.depth = tree.y;

                // tile.obstacles.push( tree );
                this.gameObjects.push( tree );

                return tree;

        }
}
