var Game3dObject = (function () {
    function Game3dObject(game, size, velocity, position) {
        if (size === void 0) { size = new THREE.Vector3(0.0, 0.0, 0.0); }
        if (velocity === void 0) { velocity = new THREE.Vector3(0.0, 0.0, 0.0); }
        if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
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
        this.size = size;
        this.velocity = velocity;
        this.initialPosition = position;
        this.game = game;
    }
    Game3dObject.prototype.init = function () {
        this.initMesh();
        this.mesh.position.copy(this.initialPosition);
        this.game.scene.add(this.mesh);
    };
    Game3dObject.prototype.animate = function () {
        this.mesh.position.add(this.velocity);
    };
    Game3dObject.increment = 0.05;
    return Game3dObject;
}());

//# sourceMappingURL=abstract.game3dobject.js.map
