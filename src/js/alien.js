var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            return new Missile(false, true, new THREE.Vector3(this.mesh.position.x - this.missileX, this.mesh.position.y - this.missileY, this.mesh.position.z - this.missileZ));
        };
        this.type = type;
        this.lastMeshSwitch = 0;
        this.missileX = 0.0;
        this.missileY = 1.0;
        this.missileZ = 0.0;
        this.missileVelocity = missileVelocity;
        this.init();
        this.mesh2.position.copy(this.initialPosition);
        Game.getInstance().scene.add(this.mesh2);
    }
    Alien.prototype.initMesh = function () {
        switch (this.type) {
            case Alien.type.bottom:
                this.mesh = randFromArray(alienData.type[0].model1).clone();
                this.mesh2 = randFromArray(alienData.type[0].model2).clone();
                this.mesh2.visible = false;
                this.score = 200;
                this.explosionColor = 0x85b66c;
                break;
            case Alien.type.middle:
                this.mesh = randFromArray(alienData.type[1].model1).clone();
                this.mesh2 = randFromArray(alienData.type[1].model2).clone();
                this.mesh2.visible = false;
                this.score = 150;
                this.explosionColor = 0x3d6686;
                break;
            case Alien.type.top:
                this.mesh = randFromArray(alienData.type[2].model1).clone();
                this.mesh2 = randFromArray(alienData.type[2].model2).clone();
                this.mesh2.visible = false;
                this.score = 100;
                this.explosionColor = 0xaf72c5;
                break;
            case Alien.type.bonus:
                this.mesh = randFromArray(alienData.type[3].model1).clone();
                this.mesh2 = randFromArray(alienData.type[3].model2).clone();
                this.mesh2.visible = false;
                this.score = 500;
                this.explosionColor = 0xaf72c5;
                break;
        }
    };
    Alien.prototype.animate = function (direction, gettingDown) {
        if (direction === void 0) { direction = AlienGroup.direction.right; }
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
}(Game3dObject));

//# sourceMappingURL=alien.js.map
