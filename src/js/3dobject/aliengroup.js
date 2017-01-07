define(["require", "exports", "../core/game", "../sound/soundservice", "./alien"], function (require, exports, game_1, soundservice_1, alien_1) {
    "use strict";
    var AlienGroup = (function () {
        function AlienGroup() {
            this.aliens = [];
            this.aliensBottom = [];
            this.gettingDown = 0;
            this.currentDirection = AlienGroup.direction.right;
        }
        AlienGroup.prototype.addAlien = function (alien) {
            this.aliens.push(alien);
            return this.aliens.length - 1;
        };
        /**
         * Return the position of the alien at the right side of the group.
         * @return {number} The maximum right position.
         */
        AlienGroup.prototype.onRight = function () {
            var max = -999;
            for (var i = 0; i < this.aliens.length; i++) {
                if (this.aliens[i].getX() > max) {
                    max = this.aliens[i].getX();
                }
            }
            return max;
        };
        /**
         * Return the position of the alien at the left side of the group.
         * @return {number} The maximum left position.
         */
        AlienGroup.prototype.onLeft = function () {
            var min = 999;
            for (var i = 0; i < this.aliens.length; i++) {
                if (this.aliens[i].getX() < min) {
                    min = this.aliens[i].getX();
                }
            }
            return min;
        };
        /**
         * Return the position of the alien at the bottom side of the group.
         * @return {number} The maximum bottom position.
         */
        AlienGroup.prototype.onBottom = function () {
            var min = 999;
            for (var i = 0; i < this.aliens.length; i++) {
                if (this.aliens[i].getY() < min) {
                    min = this.aliens[i].getY();
                }
            }
            return min;
        };
        /**
         * Choose a random alien to fire.
         * Return the index of the chosen one.
         * @return {number} Index of an random alien which can fire.
         */
        AlienGroup.prototype.chooseFiringAlien = function () {
            var x = this.aliensBottom[0];
            if (game_1.Game.getInstance().world.getLevel() < 2) {
                x = randFromArray(this.aliensBottom);
            }
            else {
                for (var i = 1; i < this.aliensBottom.length; i++) {
                    if (Math.abs(this.aliens[this.aliensBottom[i]].getX() - game_1.Game.getInstance().world.pad.getX()) < Math.abs(this.aliens[x].getX() - game_1.Game.getInstance().world.pad.getX())) {
                        x = this.aliensBottom[i];
                    }
                }
            }
            return x;
        };
        AlienGroup.prototype.init = function (lines, rows, level) {
            var type;
            for (var i = 0; i < lines; i++) {
                for (var j = 0; j < rows; j++) {
                    if (i == 0) {
                        type = alien_1.Alien.type.bottom;
                    }
                    else if (i < 3) {
                        type = alien_1.Alien.type.middle;
                    }
                    else {
                        type = alien_1.Alien.type.top;
                    }
                    this.addAlien(new alien_1.Alien(type, new THREE.Vector3(0.05 + (0.01 * level), 0.0, 0.0), new THREE.Vector3(-5 + j * 2, 20.0 - i * 2, 0.0), -0.1 - (level * 0.02)));
                }
            }
            this.computeAliensBottom();
        };
        AlienGroup.prototype.computeAliensBottom = function () {
            this.aliensBottom = [];
            for (var j = 0; j < this.aliens.length; j++) {
                var add = true;
                for (var k = j + 1; k < this.aliens.length; k++) {
                    if (this.aliens[k].mesh.position.x == this.aliens[j].mesh.position.x &&
                        this.aliens[k].mesh.position.y < this.aliens[j].mesh.position.y) {
                        add = false;
                        break;
                    }
                }
                if (add) {
                    this.aliensBottom.push(j);
                }
            }
        };
        AlienGroup.prototype.remove = function (i) {
            this.aliens.splice(i, 1);
            this.computeAliensBottom();
        };
        AlienGroup.prototype.getLength = function () {
            return this.aliens.length;
        };
        AlienGroup.prototype.get = function (i) {
            return this.aliens[i];
        };
        AlienGroup.prototype.fire = function () {
            var firingAlien;
            var m;
            if (this.getLength()) {
                firingAlien = this.chooseFiringAlien();
                m = this.aliens[firingAlien].fire();
                if (m) {
                    soundservice_1.SoundService.getSoundByName('alien-fire').play();
                    return m;
                }
            }
            return false;
        };
        /**
         * Animate all aliens.
         * Make them to change change direction and to fall if needed.
         * @param {boolean = true} canFall If false, aliens won't fall, they will only moving from left to right and right to left.
         */
        AlienGroup.prototype.animate = function (canFall) {
            if (canFall === void 0) { canFall = true; }
            if (this.gettingDown <= 0) {
                if (this.onLeft() < AlienGroup.positionBounds.min + 1.5) {
                    this.currentDirection = AlienGroup.direction.right;
                    this.animateAliens();
                    if (canFall) {
                        this.gettingDown = 8;
                    }
                }
                if (this.onRight() > AlienGroup.positionBounds.max - 1.5) {
                    this.currentDirection = AlienGroup.direction.left;
                    this.animateAliens();
                    if (canFall) {
                        this.gettingDown = 8;
                    }
                }
            }
            else {
                this.gettingDown -= 1;
            }
            this.animateAliens();
        };
        AlienGroup.prototype.animateAliens = function () {
            for (var i = 0; i < this.aliens.length; i++) {
                this.aliens[i].animate(this.currentDirection, this.gettingDown);
            }
        };
        AlienGroup.direction = { right: 1, left: -1 };
        AlienGroup.positionBounds = { min: -11, max: 11 };
        return AlienGroup;
    }());
    exports.AlienGroup = AlienGroup;
});

//# sourceMappingURL=aliengroup.js.map
