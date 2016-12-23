var Alien = (function () {
    function Alien(params, game) {
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
        this.getScore = function () {
            return this.score;
        };
        this.fire = function () {
            var m = new Missile({
                x: this.mesh.position.x - this.missileX,
                y: this.mesh.position.y - this.missileY,
                z: this.mesh.position.z - this.missileZ,
                vy: this.missileVelocity,
                alien: true,
            }, this.game);
            return m;
        };
        this.score = typeof params.score !== 'undefined' ? params.score : 100;
        this.type = typeof params.type !== 'undefined' ? params.type : 3;
        this.vx = typeof params.vx !== 'undefined' ? params.vx : Alien.INCREMENT;
        this.vy = typeof params.vy !== 'undefined' ? params.vy : 0.0;
        this.vz = typeof params.vz !== 'undefined' ? params.vz : 0.0;
        this.LastSwitch = 0;
        this.missileX = typeof params.missileX !== 'undefined' ? params.missileX : 0.0;
        this.missileY = typeof params.missileY !== 'undefined' ? params.missileY : 1.0;
        this.missileZ = typeof params.missileZ !== 'undefined' ? params.missileZ : 0.0;
        this.missileVelocity = typeof params.missileVelocity !== 'undefined' ? params.missileVelocity : -0.1;
        switch (this.type) {
            case 1:
                this.mesh = randFromArray(alienData.type[0].model1).clone();
                this.mesh2 = randFromArray(alienData.type[0].model2).clone();
                this.mesh2.visible = false;
                this.score = 200;
                this.explosionColor = 0x85b66c;
                break;
            case 2:
                this.mesh = randFromArray(alienData.type[1].model1).clone();
                this.mesh2 = randFromArray(alienData.type[1].model2).clone();
                this.mesh2.visible = false;
                this.score = 150;
                this.explosionColor = 0x3d6686;
                break;
            case 3:
                this.mesh = randFromArray(alienData.type[2].model1).clone();
                this.mesh2 = randFromArray(alienData.type[2].model2).clone();
                this.mesh2.visible = false;
                this.score = 100;
                this.explosionColor = 0xaf72c5;
                break;
        }
        this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
        this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
        this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;
        this.mesh2.position.x = typeof params.x !== 'undefined' ? params.x : this.mesh.position.x;
        this.mesh2.position.y = typeof params.y !== 'undefined' ? params.y : this.mesh.position.y;
        this.mesh2.position.z = typeof params.z !== 'undefined' ? params.z : this.mesh.position.z;
        this.size = typeof params.size !== 'undefined' ? params.size : { x: 1.0, y: 1.0, z: 1.0 };
        this.game = game;
    }
    Alien.prototype.animate = function (l) {
        if (alienGetDown <= 0) {
            this.mesh.position.x += this.vx * l;
            this.mesh.position.y += this.vy;
            this.mesh.position.z += this.vz;
            this.mesh2.position.x += this.vx * l;
            this.mesh2.position.y += this.vy;
            this.mesh2.position.z += this.vz;
        }
        else {
            this.mesh.position.y -= 0.1;
            this.mesh2.position.y -= 0.1;
        }
        if ((Date.now() - this.LastSwitch) > 1000) {
            this.switchMesh();
            this.LastSwitch = Date.now();
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
    Alien.INCREMENT = 0.05;
    return Alien;
}());

//# sourceMappingURL=alien.js.map
