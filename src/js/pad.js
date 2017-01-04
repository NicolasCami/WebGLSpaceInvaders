var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./game", "./abstract.game3dobject", "./soundservice", "./missile", "./bonus", "./scoreanimation"], function (require, exports, game_1, abstract_game3dobject_1, soundservice_1, missile_1, bonus_1, scoreanimation_1) {
    "use strict";
    var Pad = (function (_super) {
        __extends(Pad, _super);
        function Pad(positionBounds, position) {
            if (positionBounds === void 0) { positionBounds = { min: 0, max: 1 }; }
            if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
            _super.call(this, new THREE.Vector3(Pad.increment, 0.0, 0.0), position);
            this.positionBounds = positionBounds;
            this.missileStartPosition = new THREE.Vector3(0.0, 1.0, 0.0);
            this.lastFire = 0;
            this.movingLeft = false;
            this.movingRight = false;
            this.movingTime = 0;
            this.missileInvincible = 0;
            this.missileFast = 0;
            this.curve = null;
            this.curveProgress = 100;
            this.init();
        }
        Pad.prototype.initMesh = function () {
            var model = loadModel({
                content: ',          **      **,         *  *    *  *,         *  *    *  *,          **      **,          **      **,         *  *    *  *,         *  *    *  *,          **      **/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */,,              **,            ******,            ******,            ******,            ******,              **/,,              **,            ******,            ******,            ******,            ******,              **/,,,             ****,            ******,            ******,             ****,/,,,             ****,            ******,            ******,             ****,/,,,              **,             ****,             ****,              **/',
                modelSize: { x: 1.5, y: 0.75, z: 1.0 },
                material: padMaterials,
                geometry: padBlockGeometry,
                blockSize: 0.05,
                axe: 'y',
            });
            this.mesh = model;
        };
        Pad.prototype.left = function () {
            this.movingLeft = true;
            this.movingRight = false;
            this.movingTime = Date.now();
            this.mesh.position.x -= Pad.increment;
            if (this.mesh.position.x < this.positionBounds.min + Pad.width) {
                this.mesh.position.x = this.positionBounds.min + Pad.width;
            }
        };
        Pad.prototype.right = function () {
            this.movingRight = true;
            this.movingLeft = false;
            this.movingTime = Date.now();
            this.mesh.position.x += Pad.increment;
            if (this.mesh.position.x > this.positionBounds.max - Pad.width) {
                this.mesh.position.x = this.positionBounds.max - Pad.width;
            }
        };
        Pad.prototype.animate = function () {
            if (Date.now() - this.movingTime > Pad.rotationDelay) {
                this.movingLeft = false;
                this.movingRight = false;
            }
            if (this.movingLeft) {
                this.mesh.rotation.y -= Pad.rotationIncrement;
                if (this.mesh.rotation.y < -Pad.rotationMaxAngleRadian) {
                    this.mesh.rotation.y = -Pad.rotationMaxAngleRadian;
                }
            }
            else if (this.movingRight) {
                this.mesh.rotation.y += Pad.rotationIncrement;
                if (this.mesh.rotation.y > Pad.rotationMaxAngleRadian) {
                    this.mesh.rotation.y = Pad.rotationMaxAngleRadian;
                }
            }
            else {
                if (this.mesh.rotation.y > -0.15 && this.mesh.rotation.y < 0.15) {
                    this.mesh.rotation.y = 0.0;
                }
                else if (this.mesh.rotation.y < 0.0) {
                    this.mesh.rotation.y += Pad.rotationIncrement;
                }
                else if (this.mesh.rotation.y > 0.0) {
                    this.mesh.rotation.y -= Pad.rotationIncrement;
                }
            }
        };
        Pad.prototype.resetPosition = function () {
            this.lastFire = 0;
            this.movingLeft = false;
            this.movingRight = false;
            this.movingTime = 0;
            this.mesh.rotation.y = 0;
            this.mesh.position.x = 0;
        };
        Pad.prototype.animateResetInit = function () {
            this.curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z), new THREE.Vector3(this.mesh.position.x / 2, this.mesh.position.y / 2, 3), new THREE.Vector3(0.0, 0.0, 0.0));
            this.curveProgress = 0.0;
        };
        Pad.prototype.animateReset = function () {
            if (this.curveProgress < 1.0) {
                var point = this.curve.getPoint(this.curveProgress);
                this.mesh.position.x = point.x;
                this.mesh.position.y = point.y;
                this.mesh.position.z = point.z;
                this.mesh.rotation.y = (2 * Math.PI * this.curveProgress);
                this.curveProgress += 0.02;
                game_1.Game.getInstance().updateCameraPad();
            }
            else {
                this.mesh.rotation.y = 0;
                return true;
            }
            return false;
        };
        Pad.prototype.fire = function () {
            var delay = Pad.fireDelay;
            if (this.missileFast > 0) {
                delay = Pad.fireDelayFast;
            }
            if (Date.now() - this.lastFire > delay) {
                soundservice_1.SoundService.getSoundByName('pad-fire').play();
                var m = null;
                if (this.missileInvincible) {
                    m = new missile_1.Missile(true, false, this.mesh.position.clone().add(this.missileStartPosition));
                    this.missileInvincible -= 1;
                }
                else {
                    m = new missile_1.Missile(false, false, this.mesh.position.clone().add(this.missileStartPosition));
                }
                if (this.missileFast > 0) {
                    this.missileFast -= 1;
                }
                this.lastFire = Date.now();
                return m;
            }
            return false;
        };
        Pad.prototype.resetFireDelay = function () {
            this.lastFire = 0;
        };
        Pad.prototype.addBonus = function (bonus) {
            var e;
            switch (bonus.getType()) {
                case bonus_1.Bonus.type.superMissile:
                    this.missileInvincible += 1;
                    e = new scoreanimation_1.ScoreAnimation('MEGA SHOT', this.mesh.position.clone());
                    game_1.Game.getInstance().world.scores.push(e);
                    break;
                case bonus_1.Bonus.type.extraLife:
                    game_1.Game.getInstance().updateLife(game_1.Game.getInstance().life + 1);
                    e = new scoreanimation_1.ScoreAnimation('+1 LIFE', this.mesh.position.clone());
                    game_1.Game.getInstance().world.scores.push(e);
                    break;
                default:
                    console.log('Warning: catching unknown bonus. No effect!');
                    break;
            }
        };
        Pad.increment = 0.15;
        Pad.fireDelay = 2000.0;
        Pad.fireDelayFast = 500.0;
        Pad.width = 1.0;
        Pad.rotationDelay = 50.0;
        Pad.rotationMaxAngleRadian = 0.5;
        Pad.rotationIncrement = 0.1;
        return Pad;
    }(abstract_game3dobject_1.Game3dObject));
    exports.Pad = Pad;
});

//# sourceMappingURL=pad.js.map
