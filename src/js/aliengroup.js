var AlienGroup = (function () {
    function AlienGroup(game) {
        this.aliens = [];
        this.aliensBottom = [];
        this.game = game;
    }
    AlienGroup.prototype.addAlien = function (alien) {
        this.aliens.push(alien);
    };
    AlienGroup.prototype.onRight = function () {
        var max = -999;
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].getX() > max)
                max = this.aliens[i].getX();
        }
        return max;
    };
    AlienGroup.prototype.onLeft = function () {
        var min = 999;
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].getX() < min)
                min = this.aliens[i].getX();
        }
        return min;
    };
    AlienGroup.prototype.onBottom = function () {
        var min = 999;
        for (var i = 0; i < this.aliens.length; i++) {
            if (this.aliens[i].getY() < min)
                min = this.aliens[i].getY();
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
        var _type;
        for (var i = 0; i < lines; i++) {
            for (var j = 0; j < rows; j++) {
                if (i == 0)
                    _type = 1;
                else if (i < 3)
                    _type = 2;
                else
                    _type = 3;
                this.addAlien(new Alien({
                    x: -5 + j * 2,
                    y: 20.0 - i * 2,
                    z: 0.0,
                    vx: 0.05 + (0.01 * level),
                    type: _type,
                    missileVelocity: -0.1 - (level * 0.02),
                }, this.game));
            }
        }
        this.aliensBottom = [24, 23, 22, 21, 20];
    };
    AlienGroup.prototype.remove = function (i) {
        this.aliens.splice(i, 1);
        // recherche des aliens en bas de colonnes
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
        else
            return false;
    };
    AlienGroup.prototype.animate = function (fall) {
        fall = typeof fall !== 'undefined' ? fall : true;
        if (alienGetDown <= 0) {
            if (this.onLeft() < xMin + 1.5) {
                dir = 1;
                for (var i = 0; i < this.aliens.length; i++) {
                    this.aliens[i].animate(dir);
                }
                if (fall == true)
                    alienGetDown = 8;
            }
            if (this.onRight() > xMax - 1.5) {
                dir = -1;
                for (var i = 0; i < this.aliens.length; i++) {
                    this.aliens[i].animate(dir);
                }
                if (fall == true)
                    alienGetDown = 8;
            }
        }
        if (alienGetDown > 0)
            alienGetDown -= 1;
        for (var i = 0; i < this.aliens.length; i++) {
            this.aliens[i].animate(dir);
        }
    };
    AlienGroup.FIRE_DELAY = 2000.0;
    return AlienGroup;
}());

//# sourceMappingURL=aliengroup.js.map
