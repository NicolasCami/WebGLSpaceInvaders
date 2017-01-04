define(["require", "exports", "./game", "./soundservice"], function (require, exports, game_1, soundservice_1) {
    "use strict";
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
            window.addEventListener('click', function (event) { game_1.Game.getInstance().menu.mouseClick(event); }.bind(this), false);
            window.addEventListener('mousemove', function (event) { game_1.Game.getInstance().menu.mouseMove(event); }.bind(this), false);
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
            if (!game_1.Game.getInstance().pause) {
                if (event.key == "0") {
                    game_1.Game.getInstance().currentCamera = 0;
                }
                if (event.key == "1") {
                    game_1.Game.getInstance().currentCamera = 1;
                }
                if (event.keyCode == Key.keyCode.k) {
                    game_1.Game.getInstance().world.killThemAll();
                }
                if (event.keyCode == Key.keyCode.i) {
                    game_1.Game.getInstance().world.invinciblePad();
                }
                if (event.keyCode == Key.keyCode.h) {
                    game_1.Game.getInstance().help();
                }
                if (event.keyCode == Key.keyCode.escape) {
                    game_1.Game.getInstance().pauseOn();
                }
            }
            else {
                if (event.keyCode == Key.keyCode.escape) {
                    game_1.Game.getInstance().pauseOff();
                }
            }
            if (event.keyCode == Key.keyCode.m) {
                soundservice_1.SoundService.toggle();
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
    exports.Key = Key;
});

//# sourceMappingURL=key.js.map
