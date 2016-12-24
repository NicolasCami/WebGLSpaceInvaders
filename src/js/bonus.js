var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bonus = (function (_super) {
    __extends(Bonus, _super);
    function Bonus(game, type, position) {
        if (type === void 0) { type = 1; }
        if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
        _super.call(this, game, new THREE.Vector3(0.8, 0.8, 1.0), new THREE.Vector3(0.0, -Bonus.increment, 0.0), position);
        this.type = type;
        this.init();
    }
    Bonus.prototype.initMesh = function () {
        switch (this.type) {
            case Bonus.type.superMissile:
                this.mesh = bonusData.type[0].model.clone();
                break;
            case Bonus.type.extraLife:
                this.mesh = bonusData.type[1].model.clone();
                break;
            default:
                this.mesh = bonusData.type[0].model.clone();
                console.log('Warning: Unknown bonus created! With type:', this.type);
                break;
        }
    };
    Bonus.prototype.animate = function () {
        this.mesh.position.add(this.velocity);
        this.mesh.rotation.z += 0.1;
        if (this.mesh.position.y < -2.0) {
            return true;
        }
        return false;
    };
    Bonus.prototype.getType = function () {
        return this.type;
    };
    Bonus.increment = 0.05;
    Bonus.type = { superMissile: 1, extraLife: 2 };
    return Bonus;
}(Game3dObject));

//# sourceMappingURL=bonus.js.map
