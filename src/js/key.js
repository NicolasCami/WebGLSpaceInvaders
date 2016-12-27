var Key = (function () {
    function Key() {
        if (Key.instance) {
            throw new Error("Key is a singleton. Use Key.getInstance() instead.");
        }
        this.pressed = {};
        this.initListeners();
    }
    Key.prototype.initListeners = function () {
        window.addEventListener('keyup', function (event) { this.onKeyup(event); }.bind(this), false);
        window.addEventListener('keydown', function (event) { this.onKeydown(event); }.bind(this), false);
        window.addEventListener('click', function (event) { Game.getInstance().menu.mouseClick(event); }.bind(this), false);
        window.addEventListener('mousemove', function (event) { Game.getInstance().menu.mouseMove(event); }.bind(this), false);
    };
    Key.getInstance = function () {
        if (!Key.instance) {
            Key.instance = new Key();
        }
        return Key.instance;
    };
    Key.prototype.isDown = function (keyCode) {
        return this.pressed[keyCode];
    };
    Key.prototype.onKeydown = function (event) {
        this.pressed[event.keyCode] = true;
        if (!Game.getInstance().pause) {
            if (event.key == "0") {
                Game.getInstance().currentCamera = 0;
            }
            if (event.key == "1") {
                Game.getInstance().currentCamera = 1;
            }
            if (event.keyCode == Key.keyCode.k) {
                Game.getInstance().world.killThemAll();
            }
            if (event.keyCode == Key.keyCode.i) {
                Game.getInstance().world.invinciblePad();
            }
            if (event.keyCode == Key.keyCode.h) {
                Game.getInstance().help();
            }
            if (event.keyCode == Key.keyCode.escape) {
                Game.getInstance().pauseOn();
            }
        }
        else {
            if (event.keyCode == Key.keyCode.escape) {
                Game.getInstance().pauseOff();
            }
        }
        if (event.keyCode == Key.keyCode.m) {
            Game.getInstance().musicOnOff();
        }
    };
    Key.prototype.onKeyup = function (event) {
        delete this.pressed[event.keyCode];
    };
    Key.keyCode = {
        escape: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        h: 72,
        i: 73,
        k: 75,
        m: 77
    };
    return Key;
}());
$(new Function('var key = Key.getInstance();'));

//# sourceMappingURL=key.js.map
