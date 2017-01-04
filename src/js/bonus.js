var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./abstract.game3dobject"], function (require, exports, abstract_game3dobject_1) {
    "use strict";
    var Bonus = (function (_super) {
        __extends(Bonus, _super);
        function Bonus(type, position) {
            if (type === void 0) { type = 1; }
            if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
            _super.call(this, new THREE.Vector3(0.0, -Bonus.increment, 0.0), position);
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
    }(abstract_game3dobject_1.Game3dObject));
    exports.Bonus = Bonus;
});

//# sourceMappingURL=bonus.js.map
