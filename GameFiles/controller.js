// console.log("Load Controller");
// module.exports =  function(game)  {

        // console.log("Start Controller");

//         this.cursors = game.input.keyboard.createCursorKeys();

//         this.MoveXaxis = function () {
//             if (cursors.left.isDown)
//             {
//                 return -1.0;
//             }
//             else if (cursors.right.isDown)
//             {
//                 return 1.0;
//             } else {
//                 return 0.0;
//             }
//         }
// }

var VIRTUAL_STICK_SCALE = 3;
var VIRTUAL_STICK_LEFT_X = 0.2; // position as percentage of screen width
var VIRTUAL_STICK_LEFT_Y = 0.7; // position as percentage of screen height
var VIRTUAL_STICK_MAX_DISTANCE = 100;

class Controller {
    constructor( game ) {
        this.game = game;
        this.cursors = game.input.keyboard.createCursorKeys();

        this.isMobile = false; //initiate as false
        this.config = Phaser.Input.Gamepad.Configs.XBOX_360;

        let controller = this;
        // console.log( this.config);
        game.input.gamepad.on('down', function (pad, button, value, data) {
            // console.log("Gamepad On");
            controller.gamepad = pad;
            // console.log(button.index);
            switch (button.index)
            {
                case controller.config.B:
                    // console.log("B");
                    // sprite.alpha -= 0.1;
                    break;

                case controller.config.A:
                    // sprite.alpha += 0.1;
                    break;
            }

        });

        this.gamepadIsOn = false;
        this.virtualStickIsOn = false;

        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
            this.isMobile = true;
            this._ShowVirtualSticks();
        }
        


    }

    Update() {
        this.gamepadIsOn = this.gamepad;

        if ( this.gamepadIsOn ) {
            if ( this.virtualStickIsOn ) {
                this._HideVirtualSticks();
            // } else if ( this.isMobile ) {
            //     this._ShowVirtualSticks();
            }
        } else {
            if ( this.virtualStickIsOn ) {
                this._RepositionVirtualSticks();
            }
        }

        
        
    }

    Resize() {
        this._ResizeVirtualSticks();
    }

    get MoveAxis () {
        let x = 0;
        let y = 0;

        if ( this.virtualStickIsOn ) {
            let m = utils.Magnitude(this.leftStick.dragOffsetX, this.leftStick.dragOffsetY);

            if ( m < VIRTUAL_STICK_MAX_DISTANCE ) {
                x = this.leftStick.dragOffsetX/VIRTUAL_STICK_MAX_DISTANCE;
                y = this.leftStick.dragOffsetY/VIRTUAL_STICK_MAX_DISTANCE;
            } else {
                let v = utils.UnitVector(this.leftStick.dragOffsetX, this.leftStick.dragOffsetY, m );
                x = v.x;
                y = v.y;
            }
        } else
        if ( this.gamepadIsOn ) {
            if (this.gamepad.axes.length){
                x = this.gamepad.axes[0].getValue();
                y = this.gamepad.axes[1].getValue();
            }
        } else {
            if (this.cursors.left.isDown) {
                x = -1.0;
            }
            else if (this.cursors.right.isDown) {
                x = 1.0;
            } else {
                x = 0.0;
            }
            if (this.cursors.up.isDown) {
                y = -1.0;
            }
            else if (this.cursors.down.isDown) {
                y = 1.0;
            }
            else {
               y = 0.0;
            }
        }

        return {
            x: x,
            y: y,
        };
    }

    _ShowVirtualSticks() {
        if ( this.virtualStickIsOn ) {
            return;
        }
        var canvas = $('canvas')[0];

        this.leftStickBack = this.game.add.sprite(100,100,"blue_circle");
        this.leftStickBack.setOrigin(0.5);
        this.leftStickBack.depth = 999999998;
        this.leftStickBack.alpha = 0.3;

        this.leftStick = this.game.add.sprite(100,100,"blue_circle").setInteractive();
        this.leftStick.setOrigin(0.5);
        this.leftStick.depth = 999999999;
        this.leftStick.alpha = 0.5;
        this.leftStick.inputEnabled = true;
        this.leftStick.dragOffsetX = 0;
        this.leftStick.dragOffsetY = 0;
        this.leftStick.stickPositionX = VIRTUAL_STICK_LEFT_X;
        this.leftStick.stickPositionY = VIRTUAL_STICK_LEFT_Y;
        
        this.game.input.setDraggable(this.leftStick);

        //  The pointer has to move 16 pixels before it's considered as a drag
        this.game.input.dragDistanceThreshold = 2;

        this.game.input.on('dragstart', function (pointer, gameObject) {
            gameObject.startDragX = pointer.x - gameObject.x;
            gameObject.startDragY = pointer.y - gameObject.y;
            gameObject.setTint(0xff0000);

        });

        this.game.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            var canvas = $('canvas')[0];
            // gameObject.dragOffsetX = dragX;
            gameObject.dragOffsetX = dragX - canvas.width * gameObject.stickPositionX + gameObject.startDragX;
            gameObject.dragOffsetY = dragY - canvas.height*gameObject.stickPositionY + gameObject.startDragY;
            // gameObject.dragOffsetY = pointer.y - gameObject.y;

            // gameObject.x = dragX;
            // gameObject.y = dragY;

        });

        this.game.input.on('dragend', function (pointer, gameObject) {
            gameObject.dragOffsetX = 0;
            gameObject.dragOffsetY = 0;
            gameObject.clearTint();

        });

        this.virtualStickIsOn = true;
        this._ResizeVirtualSticks();
    }

    _HideVirtualSticks() {
        if ( !this.virtualStickIsOn ) {
            return;
        }

        this.leftStick.destroy();
        this.leftStickBack.destroy();

        this.virtualStickIsOn = false;
    }

    _ResizeVirtualSticks() {
        if ( !this.virtualStickIsOn ) {
            return;
        }
        var canvas = $('canvas')[0];
        let scale = canvas.width/1600 * VIRTUAL_STICK_SCALE * window.devicePixelRatio;
        
        this.leftStick.setScale(scale);
        this.leftStickBack.setScale(scale * 2);
    }

    _RepositionVirtualSticks() {
        var canvas = $('canvas')[0];

        let x = canvas.width * this.leftStick.stickPositionX + this.game.cameras.main.scrollX;
        let y = canvas.height *this.leftStick.stickPositionY + this.game.cameras.main.scrollY;

        this.leftStickBack.setPosition(x,y);

        let m = utils.Magnitude(this.leftStick.dragOffsetX, this.leftStick.dragOffsetY);

        if ( m < VIRTUAL_STICK_MAX_DISTANCE ) {
            this.leftStick.setPosition( x + this.leftStick.dragOffsetX, y + this.leftStick.dragOffsetY);
        } else {
            let v = utils.UnitVector(this.leftStick.dragOffsetX, this.leftStick.dragOffsetY, m );
            this.leftStick.setPosition(x + VIRTUAL_STICK_MAX_DISTANCE * v.x, y + VIRTUAL_STICK_MAX_DISTANCE * v.y);
        }

    }
}
