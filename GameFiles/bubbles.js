
/// Bubble
// 	* Maintains the collection of game objects in that 'area'
// 		* A game object can only be 'in' one bubble at a time
// 	* Has an abstract position in the overall world
// 	* Has a style, theme, or terrain 
// 	* Handles procedurally generating terrain and obstacles
// 	* Has a radius that it uses to generate and destroy objects as they move closer to the player or players
// 		* Keeps track of each objects 'distance to closest player'
// 	* Has the ability to merge with another bubble, resulting in a new single bubble
// 		* Periodically, two players in two different bubbles will be pitted against each other by merging their bubbles:
// 			* The average direction and speed of both characters is approximated
// 			* The vectors are projected onto their respective bubble's radius, marking two 'collision points', one for each player
// 			* The bubbles are oriented adjacent to each other and merged by matching the collision points on top of one another
// 			* If the directions are too similar, like they have a difference less than pi/4 or 45 degrees than the two bubbles would end up on top of each other -> failed to merge or just go out further for the collision points
// 	* Has the ability to split into two new bubbles
///		* If the two players in a merged bubble become too far away from each other (passed the radius) split the bubble back into two seperate areas

 var gridToScreen = 150,
     screenToGrid = 1/gridToScreen;

class Bubble {
	constructor(game) {
		this.game = game;
		this.players = [];
		this.gameObjects = [];
		this.worldPosition = null;
		this.theme = 'grass_plains';
		this.radius = 7;
		this.tiles = [];
		this.tilesByX = {};
		this.tilesByY = {};
		this.noise = new SimplexNoise();
		this.levelGenerator = new LevelGenerator(this);

	}

	AddPlayer( player ) {
		this.players.push( player );

		let px = this.TransformScreenToGrid(player.x);
		let py = this.TransformScreenToGrid(player.y);

		this.lastPx = px;
		this.lastPy = py;



		for ( let ox = -this.radius-1; ox < this.radius+1; ox ++ ) {
			this.MakeTileColumn(px + ox, py );
		}
	}

	TilesXList(x) {
		let xList = this.tilesByX[x];

		if ( xList == undefined ) {
			xList = [];
			this.tilesByX[x] = xList;
		}
		return xList;
	}

	TilesYList(y) {
		let yList = this.tilesByY[y];

		if ( yList == undefined ) {
			yList = [];
			this.tilesByY[y] = yList;
		}
		return yList;
	}

	AddTile( x, y, tile ) {

		// keep track of the tile by x, by y, and just in a list
		

		if ( tile==undefined ) {
			tile = this.game.add.sprite(x * gridToScreen, y * gridToScreen, this.theme,64);
			this.tiles.push( tile ) ;

			tile.obstacles = [];
		} else {
			this.ResetTile(tile);

			tile.x = x * gridToScreen;
			tile.y = y * gridToScreen;
		}
		
		tile.scaleX = tile.scaleY = gridToScreen/32 + 0.05;
		tile.depth = -100000000;
		// tile.recycle = false;
		tile.type = this.noise.noise((x+0.5) * gridToScreen,(y+0.5) * gridToScreen);
		if ( tile.type > 0 ) {
			tile.anims.play('grass', true);
			// this.GenerateObstacles(tile);
		} else {
			tile.anims.play('dirt', true);
		}

		let xList = this.TilesXList(x);
		xList.push(tile);

		let yList = this.TilesYList(y);
		yList.push(tile);
		
	}

	ResetTile( tile ) {
		let lastXList = this.TilesXList(tile.x * screenToGrid);
		list_utils.Remove(lastXList,tile);

		let lastYList = this.TilesYList(tile.y * screenToGrid);
		list_utils.Remove(lastYList,tile);

		for ( let i = tile.obstacles.length-1; i >= 0; i -- ) {
			let ob = tile.obstacles[i];
			ob.destroy();
		}
	}

	DistanceToClosestPlayer( point ) {
		let result = 100000000;
		for( let i = 0; i < this.players.length ; i ++ ) {
			let player = this.players[i];
			let x = point.x - player.x;
			let y = point.y - player.y;
			let d = x*x + y*y;
			if ( d < result ) {
				result = d;
			}
		}
		return Math.sqrt(result) * screenToGrid;
	}

	Update() {

		this.UpdateTiles();
		this.UpdateObjects();
		this.levelGenerator.Update();
	}

	UpdateTiles() {
		let player = this.players[0];
		let px = this.TransformScreenToGrid(player.x);
		let py = this.TransformScreenToGrid(player.y);


		if ( px > this.lastPx ) {
			// recycle the left most column
			let leftMost = px - this.radius - 1;
			
			let xList = this.TilesXList(leftMost);
			for( let i = xList.length-1; i >=0 ; i -- ) {
				let tile = xList[i];
				this.ResetTile(tile);
				tile.destroy();
			}
			let rightMost = px + this.radius;
			this.MakeTileColumn(rightMost,py);

		} else if ( px < this.lastPx ) {
			// recycle the right most column
			let leftMost = px - this.radius;
			let rightMost = px + this.radius+1;
			let xList = this.TilesXList(rightMost);
			for( let i = xList.length-1; i >=0 ; i -- ) {
				let tile = xList[i];
				this.ResetTile(tile);
				tile.destroy();
			}

			this.MakeTileColumn(leftMost,py);
		}


		if ( py > this.lastPy ) {
			// recycle the left most column
			let topMost = py - this.radius - 1;
			
			let yList = this.TilesYList(topMost);
			for( let i = yList.length-1; i >=0 ; i -- ) {
				let tile = yList[i];
				this.ResetTile(tile);
				tile.destroy();
			}

			let bottomMost = py + this.radius;

			this.MakeTileRow(px,bottomMost)
		} else if ( py < this.lastPy ) {
			// recycle the right most column
			
			let bottomMost = py + this.radius + 1;
			let yList = this.TilesYList(bottomMost);
			for( let i = yList.length-1; i >=0 ; i -- ) {
				let tile = yList[i];
				this.ResetTile(tile);
				tile.destroy();
			}

			let topMost = py - this.radius;
			this.MakeTileRow(px,topMost)
		}
		
		this.lastPx = px;
		this.lastPy = py;

	}

	MakeTileColumn( x , y ) {
		let b = 0;
		for( let i = -this.radius; i <= this.radius; i ++ ) {
			// let tile = this.tilePool[b++];
			this.AddTile(x, y + i);
		}
		// this.tilePool.splice(0,b);
	}

	MakeTileRow( x , y ) {
		let b = 0;
		for( let i = -this.radius; i <= this.radius; i ++ ) {
			// let tile = this.tilePool[b++];
			this.AddTile(x + i, y);
		}
		// this.tilePool.splice(0,b);
	}

	UpdateObjects() {
		// console.log(this.gameObjects);
		for( let i = 0; i < this.gameObjects.length; i++ ) {
			let gameObject = this.gameObjects[i];
			let d = this.DistanceToClosestPlayer(gameObject);
			if  ( d > this.radius * 6 ) {
				// console.log(gameObject);
				gameObject.destroy();
				
			}
		}
	}

	GenerateObstacles( tile ) {
		// console.log("GenerateObstacles");
		let tree = this.game.obstacles.create(tile.x, tile.y, 'tree_green');

		let s = tile.type;

        tree.setScale(3 * s);
        tree.setOrigin(0.5,0.6);
        tree.body.setCircle(50 * s);
        tree.body.setOffset(-25 * s + tree.originX * tree.width,-25 * s + tree.originY * tree.height);
        tree.depth = tree.y;

        tile.obstacles.push( tree );
        // this.gameObjects.push( tree );

	}

	NewObstacle( x, y, key ) {
		if ( key==undefined){
			key = 'tree_green';
		}
		let tree = this.game.obstacles.create( x, y, key);

		tree.s = 1 + this.noise.noise(x,y)*0.5;


        tree.setScale(3 * tree.s);
        tree.setOrigin(0.5,0.6);
        tree.body.setCircle(50 * tree.s);
        tree.body.setOffset(-25 * tree.s + tree.originX * tree.width,-25 * tree.s + tree.originY * tree.height);
        tree.depth = tree.y;

        // tile.obstacles.push( tree );
        this.gameObjects.push( tree );

        return tree;

	}

	RemoveObstacle( tree ) {
		tree.destroy();
		list_utils.Remove(this.gameObjects,tree);
	}

	TransformScreenToGrid( screenScalar ) {
		return Math.round( screenScalar * screenToGrid );
	}
}

/// Bubbles is the Bubble Factory and Manager
//	

class Bubbles {

	constructor(game) {
		this.game = game;
		this._ = [];
	}

	Add () {
		let newBubble = new Bubble(this.game);
		this._ += newBubble;

		return newBubble;
	}
}
