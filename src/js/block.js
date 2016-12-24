var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Block = (function (_super) {
    __extends(Block, _super);
    function Block(game, position) {
        if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
        _super.call(this, game, new THREE.Vector3(0.6, 0.6, 1.0), new THREE.Vector3(0.001 + (Math.random() * 0.005), 0.0, 0.0), position);
        this.orientation = (Math.floor((Math.random() * 2)) > 0) ? Block.orientations.down : Block.orientations.up;
        this.moveLimit = 0.2;
        this.init();
    }
    Block.prototype.initMesh = function () {
        var mesh = randFromArray(blockData.model).clone();
        mesh.castShadow = true;
        this.mesh = mesh;
    };
    Block.prototype.animate = function () {
        this.mesh.position.z += this.orientation * this.velocity.x;
        if (this.mesh.position.z > this.moveLimit) {
            this.mesh.position.z = this.moveLimit;
            this.orientation = Block.orientations.down;
        }
        else if (this.mesh.position.z < -this.moveLimit) {
            this.mesh.position.z = -this.moveLimit;
            this.orientation = Block.orientations.up;
        }
    };
    Block.orientations = { up: 1, down: -1 };
    return Block;
}(Game3dObject));

//# sourceMappingURL=block.js.map
