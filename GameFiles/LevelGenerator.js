
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

	}

        Update() {
                this.Scatter();
                this.Snake();
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

                        let tree = this.bubble.NewObstacle( newx, newy);

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
                if (this.last_spawned_obstacle == null ) {
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
                        let tree = this.bubble.NewObstacle( newx, newy, 'tree_purple');
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
}
