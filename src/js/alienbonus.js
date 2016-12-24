var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AlienBonus = (function (_super) {
    __extends(AlienBonus, _super);
    function AlienBonus(game) {
        _super.call(this, game, Alien.type.bonus, new THREE.Vector3(AlienBonus.increment, 0.0, AlienBonus.increment), new THREE.Vector3(10.0, 21.0, 10.0));
        this.step = AlienBonus.steps.init;
    }
    /**
     * Animate the alien.
     * @return {boolean} If false, the alien have reach the end, it needs to be deleted.
     */
    AlienBonus.prototype.animate = function () {
        if ((Date.now() - this.lastMeshSwitch) > Alien.meshSwitchDelay) {
            this.switchMesh();
            this.lastMeshSwitch = Date.now();
        }
        switch (this.step) {
            case AlienBonus.steps.init:
                if (this.mesh.position.z > 0) {
                    this.mesh.position.z -= this.velocity.z;
                    this.mesh2.position.z -= this.velocity.z;
                }
                else {
                    this.mesh.position.z = 0.0;
                    this.mesh2.position.z = 0.0;
                    this.step = AlienBonus.steps.move;
                }
                break;
            case AlienBonus.steps.move:
                this.mesh.position.x -= this.velocity.x;
                this.mesh2.position.x -= this.velocity.x;
                if (this.mesh.position.x < -10.0) {
                    this.step = AlienBonus.steps.end;
                }
                break;
            case AlienBonus.steps.end:
                if (this.mesh.position.z < 10.0) {
                    this.mesh.position.z += this.velocity.z;
                    this.mesh2.position.z += this.velocity.z;
                }
                else {
                    return false;
                }
                break;
        }
        return true;
    };
    AlienBonus.increment = 0.03;
    AlienBonus.steps = { init: 1, move: 2, end: 3 };
    return AlienBonus;
}(Alien));

//# sourceMappingURL=alienbonus.js.map
