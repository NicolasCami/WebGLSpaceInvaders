var AlienGroup = (function () {
    function AlienGroup(game) {
        this.aliens = [];
        this.aliensBottom = [];
        this.game = game;
    }
    AlienGroup.prototype.addAlien = function (alien) {
        this.aliens.push(alien);
        return this.aliens.length - 1;
    };
    AlienGroup.prototype.onRight = function () {
        var max = -999;
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].getX() > max) {
                max = this.aliens[i].getX();
            }
        }
        return max;
    };
    AlienGroup.prototype.onLeft = function () {
        var min = 999;
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].getX() < min) {
                min = this.aliens[i].getX();
            }
        }
        return min;
    };
    AlienGroup.prototype.onBottom = function () {
        var min = 999;
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].getY() < min) {
                min = this.aliens[i].getY();
            }
        }
        return min;
    };
    AlienGroup.prototype.chooseFiringAlien = function () {
        var x = this.aliensBottom[0];
        if (this.game.world.getLevel() < 2) {
            x = randFromArray(this.aliensBottom);
        }
        else {
            for (var i = 1; i < this.aliensBottom.length; i++) {
                if (Math.abs(this.aliens[this.aliensBottom[i]].getX() - this.game.world.pad.getX()) < Math.abs(this.aliens[x].getX() - this.game.world.pad.getX())) {
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
                    type = Alien.type.bottom;
                }
                else if (i < 3) {
                    type = Alien.type.middle;
                }
                else {
                    type = Alien.type.top;
                }
                this.addAlien(new Alien(this.game, type, new THREE.Vector3(0.05 + (0.01 * level), 0.0, 0.0), new THREE.Vector3(-5 + j * 2, 20.0 - i * 2, 0.0), -0.1 - (level * 0.02)));
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
    AlienGroup.prototype.fire = function (AlienGroupSize) {
        if (AlienGroupSize > 0) {
            var firingAlien = this.chooseFiringAlien();
            var m = this.aliens[firingAlien].fire();
            if (m) {
                soundAlienFire.play();
                return m;
            }
            else
                return false;
        }
        return false;
    };
    AlienGroup.prototype.animate = function (fall) {
        if (fall === void 0) { fall = false; }
        if (alienGetDown <= 0) {
            if (this.onLeft() < xMin + 1.5) {
                dir = AlienGroup.direction.right;
                for (var i = 0; i < this.aliens.length; i++) {
                    this.aliens[i].animate(dir);
                }
                if (fall == true) {
                    alienGetDown = 8;
                }
            }
            if (this.onRight() > xMax - 1.5) {
                dir = AlienGroup.direction.left;
                for (var i = 0; i < this.aliens.length; i++) {
                    this.aliens[i].animate(dir);
                }
                if (fall == true) {
                    alienGetDown = 8;
                }
            }
        }
        if (alienGetDown > 0) {
            alienGetDown -= 1;
        }
        for (var i = 0; i < this.aliens.length; i++) {
            this.aliens[i].animate(dir);
        }
    };
    AlienGroup.direction = { right: 1, left: -1 };
    return AlienGroup;
}());

//# sourceMappingURL=aliengroup.js.map
