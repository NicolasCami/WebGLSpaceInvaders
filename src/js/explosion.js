var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./abstract.game3dobject"], function (require, exports, abstract_game3dobject_1) {
    "use strict";
    var Explosion = (function (_super) {
        __extends(Explosion, _super);
        function Explosion(particleCloudSize, particleNb, particleSize, particleColor, position) {
            if (particleCloudSize === void 0) { particleCloudSize = 1.0; }
            if (particleNb === void 0) { particleNb = 10; }
            if (particleSize === void 0) { particleSize = 0.1; }
            if (particleColor === void 0) { particleColor = 0xff0000; }
            if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
            _super.call(this, new THREE.Vector3(0.0, 0.0, 0.0), position);
            this.particleCloudSize = particleCloudSize;
            this.particleNb = particleNb;
            this.particleSize = particleSize;
            this.particleColor = particleColor;
            this.particlesVelocity = [];
            this.init();
        }
        Explosion.prototype.initMesh = function () {
            this.particles = new THREE.Geometry;
            for (var p = 0; p < this.particleNb; p++) {
                var particle = new THREE.Vector3(Math.random() * this.particleCloudSize - (this.particleCloudSize / 2.0), Math.random() * this.particleCloudSize - (this.particleCloudSize / 2.0), Math.random() * this.particleCloudSize - (this.particleCloudSize / 2.0));
                this.particles.vertices.push(particle);
                this.particlesVelocity.push(new THREE.Vector3(Math.random() * 1 - 0.5, Math.random() * 1 - 0.5, Math.random() * 1 - 0.5));
            }
            var particleMaterial = new THREE.PointCloudMaterial({ color: this.particleColor, size: this.particleSize });
            this.mesh = new THREE.PointCloud(this.particles, particleMaterial);
        };
        Explosion.prototype.animate = function () {
            var geometry = this.mesh.geometry;
            for (var i = 0; i < geometry.vertices.length; i++) {
                var particle = geometry.vertices[i];
                particle.add(this.particlesVelocity[i]);
            }
            geometry.verticesNeedUpdate = true;
            if (this.time + Explosion.LIFE_TIME < Date.now()) {
                return true;
            }
            return false;
        };
        Explosion.LIFE_TIME = 1000.0;
        return Explosion;
    }(abstract_game3dobject_1.Game3dObject));
    exports.Explosion = Explosion;
});

//# sourceMappingURL=explosion.js.map
