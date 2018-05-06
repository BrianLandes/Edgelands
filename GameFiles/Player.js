


var MOVE_SPEED = 400;
var PLAYER_SIZE = 45;

class Player {
    constructor( game ) {
        this.game = game;

        this._sprite = this.game.physics.add.sprite(700,350, 'melina');
        this._sprite.setOrigin(0.5,0.9);

        this._sprite.body.setCircle(PLAYER_SIZE);

        this.game.cameras.main.startFollow(this._sprite);

        this.graphics = this.game.make.graphics();

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

        this.forwardWeight = 3;
        this.lastEmaForwardVector = { x:0, y: 0 };
    }

    get x() {
        return this._sprite.x;
    }

    get y() {
        return this._sprite.y;
    }

    Update() {
        let m = controller.MoveAxis;

        this._sprite.setVelocityX( MOVE_SPEED * m.x );
        this._sprite.setVelocityY( MOVE_SPEED * m.y );

        this.graphics.clear();
        this.graphics.depth = this._sprite.y - 1;
        this.graphics.alpha = 0.5;
        this.graphics.fillCircle(this._sprite.x,this._sprite.y,20);

        let v = controller.AimAxis;

        if ( Math.abs(v.x) > Math.abs(v.y) ) {
            if (v.x<0) {
                this._sprite.anims.play('left', true);
            }
            else if (v.x>0){
                this._sprite.anims.play('right', true);
            }
        } else {
            if (v.y<0) {
                this._sprite.anims.play('up', true);
            }
            else if (v.y>0) {
                this._sprite.anims.play('down', true);
            }
        }

        // walking or standing still
        this._sprite.anims.isPlaying = m.m !=0;

        // update the depth or z
        this._sprite.depth  = this._sprite.y;

        // try to keep an exponention moving average of the player's approximate forward direction
        this.lastEmaForwardVector = UnitVector( (m.x * this.forwardWeight + this.lastEmaForwardVector.x ) / (this.forwardWeight + 1),
                                                (m.y * this.forwardWeight + this.lastEmaForwardVector.y ) / (this.forwardWeight + 1));
        

    }

    // returns a unit vector representing the approximate average direction the player has recently been moving forward
    get ForwardVector() {
        return this.lastEmaForwardVector;
    }
}
