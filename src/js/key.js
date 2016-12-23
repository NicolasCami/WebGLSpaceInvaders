var Key = (function () {
    function Key(game) {
        this._pressed = {};
        this.game = game;
        window.addEventListener('keyup', function (event) { this.onKeyup(event); }.bind(this), false);
        window.addEventListener('keydown', function (event) { this.onKeydown(event); }.bind(this), false);
        window.addEventListener('click', function (event) { this.game.menu.mouseClick(event); }.bind(this), false);
        window.addEventListener('mousemove', function (event) { this.game.menu.mouseMove(event); }.bind(this), false);
    }
    Key.prototype.isDown = function (keyCode) {
        return this._pressed[keyCode];
    };
    Key.prototype.onKeydown = function (event) {
        this._pressed[event.keyCode] = true;
        if (!this.game.pause) {
            if (event.key == "0") {
                this.game.currentCamera = 0;
            }
            if (event.key == "1") {
                this.game.currentCamera = 1;
            }
            if (event.keyCode == 75) {
                this.game.world.killThemAll();
            }
            if (event.keyCode == 73) {
                this.game.world.invinciblePad();
            }
            if (event.keyCode == 72) {
                this.game.help();
            }
            if (event.keyCode == 27) {
                this.game.pauseOn();
            }
        }
        else {
            if (event.keyCode == 27) {
                this.game.pauseOff();
            }
        }
        if (event.keyCode == 77) {
            this.game.musicOnOff();
        }
    };
    Key.prototype.onKeyup = function (event) {
        delete this._pressed[event.keyCode];
    };
    Key.LEFT = 37;
    Key.UP = 38;
    Key.RIGHT = 39;
    Key.DOWN = 40;
    Key.SPACE = 32;
    return Key;
}());

//# sourceMappingURL=key.js.map
