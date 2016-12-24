class Key {

    static LEFT = 37;
    static UP = 38;
    static RIGHT = 39;
    static DOWN = 40;
    static SPACE = 32;

    _pressed: any;

    constructor() {
        this._pressed = {};

        window.addEventListener('keyup', function(event) { this.onKeyup(event); }.bind(this), false);
        window.addEventListener('keydown', function(event) { this.onKeydown(event); }.bind(this), false);
        window.addEventListener('click', function(event) { Game.getInstance().menu.mouseClick(event); }.bind(this), false);
        window.addEventListener('mousemove', function(event) { Game.getInstance().menu.mouseMove(event); }.bind(this), false);
    }

    public isDown(keyCode: number): boolean {
        return this._pressed[keyCode];
    }

    public onKeydown(event) {
        this._pressed[event.keyCode] = true;
        if(!Game.getInstance().pause) {
            if(event.key == "0") {
                Game.getInstance().currentCamera = 0;
            }
            if(event.key == "1") {
                Game.getInstance().currentCamera = 1;
            }
            if(event.keyCode == 75) {
                Game.getInstance().world.killThemAll();
            }
            if(event.keyCode == 73) {
                Game.getInstance().world.invinciblePad();
                //Game.getInstance().invincibleGUI();
            }
            if(event.keyCode == 72) {
                Game.getInstance().help();
            }
            if(event.keyCode == 27) {
                Game.getInstance().pauseOn();
            }
        }
        else {
            if(event.keyCode == 27) {
                Game.getInstance().pauseOff();
            }
        }

        if(event.keyCode == 77) {
            Game.getInstance().musicOnOff();
        }
    }

    public onKeyup(event) {
        delete this._pressed[event.keyCode];
    }

}