class Key {

    static LEFT = 37;
    static UP = 38;
    static RIGHT = 39;
    static DOWN = 40;
    static SPACE = 32;

    _pressed: any;
    game: Game;

    constructor(game: Game) {
        this._pressed = {};

        this.game = game;

        window.addEventListener('keyup', function(event) { this.onKeyup(event); }.bind(this), false);
        window.addEventListener('keydown', function(event) { this.onKeydown(event); }.bind(this), false);
        window.addEventListener('click', function(event) { this.game.menu.mouseClick(event); }.bind(this), false);
        window.addEventListener('mousemove', function(event) { this.game.menu.mouseMove(event); }.bind(this), false);
    }

    public isDown(keyCode: number): boolean {
        return this._pressed[keyCode];
    }

    public onKeydown(event) {
        this._pressed[event.keyCode] = true;
        if(!this.game.pause) {
            if(event.key == "0") {
                this.game.currentCamera = 0;
            }
            if(event.key == "1") {
                this.game.currentCamera = 1;
            }
            if(event.keyCode == 75) {
                this.game.world.killThemAll();
            }
            if(event.keyCode == 73) {
                this.game.world.invinciblePad();
                //this.game.invincibleGUI();
            }
            if(event.keyCode == 72) {
                this.game.help();
            }
            if(event.keyCode == 27) {
                this.game.pauseOn();
            }
        }
        else {
            if(event.keyCode == 27) {
                this.game.pauseOff();
            }
        }

        if(event.keyCode == 77) {
            this.game.musicOnOff();
        }
    }

    public onKeyup(event) {
        delete this._pressed[event.keyCode];
    }

}