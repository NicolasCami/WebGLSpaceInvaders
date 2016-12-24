var Key = (function () {
    function Key() {
        this._pressed = {};
        window.addEventListener('keyup', function (event) { this.onKeyup(event); }.bind(this), false);
        window.addEventListener('keydown', function (event) { this.onKeydown(event); }.bind(this), false);
        window.addEventListener('click', function (event) { Game.getInstance().menu.mouseClick(event); }.bind(this), false);
        window.addEventListener('mousemove', function (event) { Game.getInstance().menu.mouseMove(event); }.bind(this), false);
    }
    Key.prototype.isDown = function (keyCode) {
        return this._pressed[keyCode];
    };
    Key.prototype.onKeydown = function (event) {
        this._pressed[event.keyCode] = true;
        if (!Game.getInstance().pause) {
            if (event.key == "0") {
                Game.getInstance().currentCamera = 0;
            }
            if (event.key == "1") {
                Game.getInstance().currentCamera = 1;
            }
            if (event.keyCode == 75) {
                Game.getInstance().world.killThemAll();
            }
            if (event.keyCode == 73) {
                Game.getInstance().world.invinciblePad();
            }
            if (event.keyCode == 72) {
                Game.getInstance().help();
            }
            if (event.keyCode == 27) {
                Game.getInstance().pauseOn();
            }
        }
        else {
            if (event.keyCode == 27) {
                Game.getInstance().pauseOff();
            }
        }
        if (event.keyCode == 77) {
            Game.getInstance().musicOnOff();
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
