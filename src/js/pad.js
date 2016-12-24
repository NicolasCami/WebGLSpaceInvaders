var Pad = (function () {
    function Pad(params, game) {
        // animation
        this.left = function () {
            this.movingLeft = true;
            this.movingRight = false;
            this.movingTime = Date.now();
            this.mesh.position.x -= Pad.INCREMENT;
            if (this.mesh.position.x < this.screenMinX + Pad.WIDTH) {
                this.mesh.position.x = this.screenMinX + Pad.WIDTH;
            }
        };
        this.right = function () {
            this.movingRight = true;
            this.movingLeft = false;
            this.movingTime = Date.now();
            this.mesh.position.x += Pad.INCREMENT;
            if (this.mesh.position.x > this.screenMaxX - Pad.WIDTH) {
                this.mesh.position.x = this.screenMaxX - Pad.WIDTH;
            }
        };
        this.animate = function () {
            if (Date.now() - this.movingTime > Pad.DELAY_ROTATION) {
                this.movingLeft = false;
                this.movingRight = false;
            }
            if (this.movingLeft) {
                this.mesh.rotation.y -= Pad.INCREMENT_ROTATION;
                if (this.mesh.rotation.y < -Pad.MAX_ROTATION) {
                    this.mesh.rotation.y = -Pad.MAX_ROTATION;
                }
            }
            else if (this.movingRight) {
                this.mesh.rotation.y += Pad.INCREMENT_ROTATION;
                if (this.mesh.rotation.y > Pad.MAX_ROTATION) {
                    this.mesh.rotation.y = Pad.MAX_ROTATION;
                }
            }
            else {
                if (this.mesh.rotation.y > -0.15 && this.mesh.rotation.y < 0.15) {
                    this.mesh.rotation.y = 0.0;
                }
                else if (this.mesh.rotation.y < 0.0) {
                    this.mesh.rotation.y += Pad.INCREMENT_ROTATION;
                }
                else if (this.mesh.rotation.y > 0.0) {
                    this.mesh.rotation.y -= Pad.INCREMENT_ROTATION;
                }
            }
        };
        this.resetPosition = function () {
            this.lastFire = 0;
            this.movingLeft = false;
            this.movingRight = false;
            this.movingTime = 0;
            this.mesh.rotation.y = 0;
            this.mesh.position.x = 0;
        };
        this.animateResetInit = function () {
            this.curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z), new THREE.Vector3(this.mesh.position.x / 2, this.mesh.position.y / 2, 3), new THREE.Vector3(0.0, 0.0, 0.0));
            this.curveProgress = 0.0;
        };
        this.animateReset = function () {
            if (this.curveProgress < 1.0) {
                var point = this.curve.getPoint(this.curveProgress);
                this.mesh.position.x = point.x;
                this.mesh.position.y = point.y;
                this.mesh.position.z = point.z;
                this.mesh.rotation.y = (2 * Math.PI * this.curveProgress);
                this.curveProgress += 0.02;
                this.game.updateCameraPad();
            }
            else {
                this.mesh.rotation.y = 0;
                return true;
            }
            return false;
        };
        this.fire = function () {
            var delay = Pad.FIRE_DELAY;
            if (this.missileFast > 0) {
                delay = Pad.FIRE_DELAY_FAST;
            }
            if (Date.now() - this.lastFire > delay) {
                soundPadFire.play();
                var m = null;
                if (this.missileInvincible) {
                    m = new Missile(this.game, true, false, new THREE.Vector3(this.mesh.position.x + this.missileX, this.mesh.position.y + this.missileY, this.mesh.position.z + this.missileZ));
                    this.missileInvincible -= 1;
                }
                else {
                    m = new Missile(this.game, false, false, new THREE.Vector3(this.mesh.position.x + this.missileX, this.mesh.position.y + this.missileY, this.mesh.position.z + this.missileZ));
                }
                if (this.missileFast > 0) {
                    this.missileFast -= 1;
                }
                //console.log(Date.now() + " : fire");
                this.lastFire = Date.now();
                return m;
            }
            return false;
        };
        this.resetFireDelay = function () {
            this.lastFire = 0;
        };
        this.getX = function () {
            return this.mesh.position.x;
        };
        this.getY = function () {
            return this.mesh.position.y;
        };
        this.minX = function () {
            return this.mesh.position.x - (this.size.x / 2);
        };
        this.minY = function () {
            return this.mesh.position.y - (this.size.y / 2);
        };
        this.minZ = function () {
            return this.mesh.position.z - (this.size.z / 2);
        };
        this.maxX = function () {
            return this.mesh.position.x + (this.size.x / 2);
        };
        this.maxY = function () {
            return this.mesh.position.y + (this.size.y / 2);
        };
        this.maxZ = function () {
            return this.mesh.position.z + (this.size.z / 2);
        };
        this.addBonus = function (bonus) {
            var e;
            switch (bonus.getType()) {
                case 1:
                    this.missileInvincible += 1;
                    e = new ScoreAnimation({
                        x: this.mesh.position.x,
                        y: this.mesh.position.y,
                        z: this.mesh.position.z,
                        text: 'MEGA SHOT',
                    }, this.game);
                    this.game.world.scores.push(e);
                    break;
                case 2:
                    this.game.updateLife(this.game.life + 1);
                    e = new ScoreAnimation({
                        x: this.mesh.position.x,
                        y: this.mesh.position.y,
                        z: this.mesh.position.z,
                        text: '+1 LIFE',
                    }, this.game);
                    this.game.world.scores.push(e);
                    break;
                default:
                    break;
            }
        };
        var model = loadModel({
            content: ',          **      **,         *  *    *  *,         *  *    *  *,          **      **,          **      **,         *  *    *  *,         *  *    *  *,          **      **/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */,,              **,            ******,            ******,            ******,            ******,              **/,,              **,            ******,            ******,            ******,            ******,              **/,,,             ****,            ******,            ******,             ****,/,,,             ****,            ******,            ******,             ****,/,,,              **,             ****,             ****,              **/',
            modelSize: { x: 1.5, y: 0.75, z: 1.0 },
            material: padMaterials,
            geometry: padBlockGeometry,
            blockSize: 0.05,
            axe: 'y',
        });
        this.mesh = model;
        this.size = typeof params.size !== 'undefined' ? params.size : { x: 1.5, y: 0.75, z: 1.0 };
        this.missileX = typeof params.missileX !== 'undefined' ? params.missileX : 0.0;
        this.missileY = typeof params.missileY !== 'undefined' ? params.missileY : 1.0;
        this.missileZ = typeof params.missileZ !== 'undefined' ? params.missileZ : 0.0;
        this.screenMinX = typeof params.minx !== 'undefined' ? params.minx : -5.0;
        this.screenMaxX = typeof params.maxx !== 'undefined' ? params.maxx : 5.0;
        this.lastFire = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingTime = 0;
        this.missileInvincible = 0;
        this.missileFast = 0;
        this.curve = null;
        this.curveProgress = 100;
        this.game = game;
    }
    Pad.INCREMENT = 0.15;
    Pad.FIRE_DELAY = 2000.0;
    Pad.FIRE_DELAY_FAST = 500.0;
    Pad.WIDTH = 1.0;
    Pad.DELAY_ROTATION = 50.0;
    Pad.MAX_ROTATION = 0.5;
    Pad.INCREMENT_ROTATION = 0.1;
    return Pad;
}());

//# sourceMappingURL=pad.js.map
