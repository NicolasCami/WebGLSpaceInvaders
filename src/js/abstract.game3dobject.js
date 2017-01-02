var Game3dObject = (function () {
    function Game3dObject(velocity, position) {
        if (velocity === void 0) { velocity = new THREE.Vector3(0.0, 0.0, 0.0); }
        if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
        this.velocity = velocity;
        this.initialPosition = position;
    }
    Game3dObject.prototype.init = function () {
        this.initMesh();
        if (this.mesh) {
            this.mesh.position.copy(this.initialPosition);
            this.bb = new THREE.Box3().setFromObject(this.mesh);
            this.size = (this.bb.size()) ? this.bb.size() : new THREE.Vector3(0, 0, 0);
        }
        Game.getInstance().scene.add(this.mesh);
    };
    Game3dObject.prototype.animate = function () {
        this.mesh.position.add(this.velocity);
    };
    Game3dObject.prototype.getX = function () {
        return this.mesh.position.x;
    };
    Game3dObject.prototype.getY = function () {
        return this.mesh.position.y;
    };
    Game3dObject.prototype.getSize = function () {
        return this.size;
    };
    Game3dObject.prototype.minX = function () {
        return this.mesh.position.x - (this.size.x / 2);
    };
    Game3dObject.prototype.minY = function () {
        return this.mesh.position.y - (this.size.y / 2);
    };
    Game3dObject.prototype.minZ = function () {
        return this.mesh.position.z - (this.size.z / 2);
    };
    Game3dObject.prototype.maxX = function () {
        return this.mesh.position.x + (this.size.x / 2);
    };
    Game3dObject.prototype.maxY = function () {
        return this.mesh.position.y + (this.size.y / 2);
    };
    Game3dObject.prototype.maxZ = function () {
        return this.mesh.position.z + (this.size.z / 2);
    };
    Game3dObject.prototype.collision = function (obj) {
        var result = false;
        result = (obj.maxX() >= this.minX() && obj.minX() <= this.maxX())
            && (obj.maxY() >= this.minY() && obj.minY() <= this.maxY())
            && (obj.maxZ() >= this.minZ() && obj.minZ() <= this.maxZ());
        if (this.bb && obj.bb) {
        }
        return result;
    };
    Game3dObject.increment = 0.05;
    return Game3dObject;
}());

//# sourceMappingURL=abstract.game3dobject.js.map
