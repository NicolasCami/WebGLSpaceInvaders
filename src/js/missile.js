var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./abstract.game3dobject", "./meshservice"], function (require, exports, abstract_game3dobject_1, meshservice_1) {
    "use strict";
    var Missile = (function (_super) {
        __extends(Missile, _super);
        function Missile(invincible, isAlien, position) {
            if (invincible === void 0) { invincible = false; }
            if (isAlien === void 0) { isAlien = false; }
            if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
            _super.call(this, new THREE.Vector3(0.0, Missile.increment, 0.0), position);
            this.invincible = invincible;
            this.isAlien = isAlien;
            this.init();
        }
        Missile.prototype.initMesh = function () {
            if (this.isAlien) {
                this.mesh = meshservice_1.MeshService.getRandomByName('missile-alien');
                this.size = new THREE.Vector3(0.1, 0.3, 0.1);
                this.velocity.y *= -1;
            }
            else {
                if (this.invincible) {
                    this.mesh = meshservice_1.MeshService.getRandomByName('missile-pad-big');
                    this.size = new THREE.Vector3(0.3, 0.3, 0.3);
                }
                else {
                    this.mesh = meshservice_1.MeshService.getRandomByName('missile-pad');
                    this.size = new THREE.Vector3(0.1, 0.3, 0.1);
                }
            }
        };
        Missile.prototype.animate = function () {
            this.mesh.position.add(this.velocity);
        };
        Missile.prototype.getDirection = function () {
            return this.velocity.clone();
        };
        Missile.prototype.isInvincible = function () {
            return this.invincible;
        };
        Missile.increment = 0.2;
        return Missile;
    }(abstract_game3dobject_1.Game3dObject));
    exports.Missile = Missile;
});

//# sourceMappingURL=missile.js.map
