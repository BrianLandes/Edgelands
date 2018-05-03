
var Player = this;

var _sprite;
var graphics;

var MOVE_SPEED = 300;

Create = function(game) {
	this.game = game;

	_sprite = this.game.physics.add.sprite(700,350, 'melina');
    _sprite.setOrigin(0.5,0.9);

    _sprite.body.setCircle(45);

    this.game.cameras.main.startFollow(_sprite);

    graphics = this.game.make.graphics();

    this.game.anims.create({
        key: 'left',
        frames: this.game.anims.generateFrameNumbers('melina', { start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.game.anims.create({
        key: 'right',
        frames: this.game.anims.generateFrameNumbers('melina', {start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.game.anims.create({
        key: 'down',
        frames: this.game.anims.generateFrameNumbers('melina', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.game.anims.create({
        key: 'up',
        frames: this.game.anims.generateFrameNumbers('melina', { start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
    });

    this.game.anims.create({
        key: 'dirt',
        frames: [ { key: 'grass_plains', frame: 64 } ],
        frameRate: 10,
        repeat: -1
    });

    this.game.anims.create({
        key: 'grass',
        frames: [ { key: 'grass_plains', frame: 81 } ],
        frameRate: 10,
        repeat: -1
    });
}

Update = function() {
    let v = controller.MoveAxis;

    _sprite.setVelocityX( MOVE_SPEED * v.x );
    _sprite.setVelocityY( MOVE_SPEED * v.y );

    graphics.clear();
    graphics.depth = _sprite.y - 100;
    graphics.alpha = 0.5;
    graphics.fillCircle(_sprite.x,_sprite.y,20);

    if ( Math.abs(v.x) > Math.abs(v.y) ) {
    	if (v.x<0) {
	        _sprite.anims.play('left', true);
	    }
	    else if (v.x>0){
	        _sprite.anims.play('right', true);
	    }
	    else {
            _sprite.anims.isPlaying = false;
        }
    } else {
        if (v.y<0) {
            _sprite.anims.play('up', true);
        }
        else if (v.y>0) {
            _sprite.anims.play('down', true);
        }
        else {
            _sprite.anims.isPlaying = false;
        }
    }

    _sprite.depth  = _sprite.y;
}