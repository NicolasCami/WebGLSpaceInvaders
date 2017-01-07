var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../core/game", "./abstract.game3dobject", "../3dobject/meshservice", "../3dobject/aliengroup", "../3dobject/missile"], function (require, exports, game_1, abstract_game3dobject_1, meshservice_1, aliengroup_1, missile_1) {
    "use strict";
    var Alien = (function (_super) {
        __extends(Alien, _super);
        function Alien(type, velocity, position, missileVelocity) {
            if (type === void 0) { type = Alien.type.top; }
            if (velocity === void 0) { velocity = new THREE.Vector3(0.0, 0.0, 0.0); }
            if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
            if (missileVelocity === void 0) { missileVelocity = -1.0; }
            _super.call(this, velocity, position);
            this.getScore = function () {
                return this.score;
            };
            this.fire = function () {
                return new missile_1.Missile(false, true, new THREE.Vector3(this.mesh.position.x - this.missileX, this.mesh.position.y - this.missileY, this.mesh.position.z - this.missileZ));
            };
            this.type = type;
            this.lastMeshSwitch = 0;
            this.missileX = 0.0;
            this.missileY = 1.0;
            this.missileZ = 0.0;
            this.missileVelocity = missileVelocity;
            this.init();
            this.mesh2.position.copy(this.initialPosition);
            game_1.Game.getInstance().scene.add(this.mesh2);
        }
        Alien.prototype.initMesh = function () {
            switch (this.type) {
                case Alien.type.bottom:
                    this.mesh = meshservice_1.MeshService.getRandomByName('alien-bottom-1');
                    this.mesh2 = meshservice_1.MeshService.getRandomByName('alien-bottom-2');
                    this.mesh2.visible = false;
                    this.score = 200;
                    this.explosionColor = 0x85b66c;
                    break;
                case Alien.type.middle:
                    this.mesh = meshservice_1.MeshService.getRandomByName('alien-middle-1');
                    this.mesh2 = meshservice_1.MeshService.getRandomByName('alien-middle-2');
                    this.mesh2.visible = false;
                    this.score = 150;
                    this.explosionColor = 0x3d6686;
                    break;
                case Alien.type.top:
                    this.mesh = meshservice_1.MeshService.getRandomByName('alien-top-1');
                    this.mesh2 = meshservice_1.MeshService.getRandomByName('alien-top-2');
                    this.mesh2.visible = false;
                    this.score = 100;
                    this.explosionColor = 0xaf72c5;
                    break;
                case Alien.type.bonus:
                    this.mesh = meshservice_1.MeshService.getRandomByName('alien-bonus-1');
                    this.mesh2 = meshservice_1.MeshService.getRandomByName('alien-bonus-2');
                    this.mesh2.visible = false;
                    this.score = 500;
                    this.explosionColor = 0xaf72c5;
                    break;
            }
        };
        Alien.prototype.animate = function (direction, gettingDown) {
            if (direction === void 0) { direction = aliengroup_1.AlienGroup.direction.right; }
            if (gettingDown === void 0) { gettingDown = 0; }
            if (gettingDown <= 0) {
                this.mesh.position.x += this.velocity.x * direction;
                this.mesh.position.y += this.velocity.y;
                this.mesh.position.z += this.velocity.z;
                this.mesh2.position.x += this.velocity.x * direction;
                this.mesh2.position.y += this.velocity.y;
                this.mesh2.position.z += this.velocity.z;
            }
            else {
                this.mesh.position.y -= 0.1;
                this.mesh2.position.y -= 0.1;
            }
            if ((Date.now() - this.lastMeshSwitch) > Alien.meshSwitchDelay) {
                this.switchMesh();
                this.lastMeshSwitch = Date.now();
            }
        };
        Alien.prototype.switchMesh = function () {
            if (this.mesh.visible == true) {
                this.mesh.visible = false;
                this.mesh2.visible = true;
            }
            else {
                this.mesh2.visible = false;
                this.mesh.visible = true;
            }
        };
        Alien.increment = 0.05;
        Alien.meshSwitchDelay = 1000;
        Alien.type = { bottom: 1, middle: 2, top: 3, bonus: 4 };
        return Alien;
    }(abstract_game3dobject_1.Game3dObject));
    exports.Alien = Alien;
});

//# sourceMappingURL=alien.js.map
