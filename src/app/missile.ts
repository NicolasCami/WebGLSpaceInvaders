class Missile {

    static INCREMENT = 0.2;

    vx: number;
    vy: number;
    vz: number;
    invincible: boolean;
    alien: boolean;
    size: any;
    mesh: THREE.Mesh;
    game: Game;

    constructor(params: any, game: Game) {
        this.vx = typeof params.vx !== 'undefined' ? params.vx : 0.0;
        this.vy = typeof params.vy !== 'undefined' ? params.vy : Missile.INCREMENT;
        this.vz = typeof params.vz !== 'undefined' ? params.vz : 0.0;
        this.invincible = typeof params.invincible !== 'undefined' ? params.invincible : false;
        this.alien = typeof params.alien !== 'undefined' ? params.alien : false;
        
        if(this.alien) {
            this.mesh = missileData.type[0].model.clone();
            this.size = {x:0.1, y:0.3, z:0.1};
        }
        else {
            if(this.invincible) {
                this.mesh = missileData.type[2].model.clone();
                this.size = {x:0.3, y:0.3, z:0.3};
            }
            else {
                this.mesh = missileData.type[1].model.clone();
                this.size = {x:0.1, y:0.3, z:0.1};
            }
        }

        this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
        this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
        this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;

        this.game = game;
        this.game.scene.add(this.mesh);
    }

    public animate() {
        this.mesh.position.x += this.vx;
        this.mesh.position.y += this.vy;
        this.mesh.position.z += this.vz;
    }

    public getDirection() {
        return new THREE.Vector3(this.vx, this.vy, this.vz);
    }
    
    public isInvincible() {
        return this.invincible;
    }
    
    public minX = function() {
        return this.mesh.position.x-(this.size.x/2);
    }

    public minY = function() {
        return this.mesh.position.y-(this.size.y/2);
    }

    public minZ = function() {
        return this.mesh.position.z-(this.size.z/2);
    }

    public maxX = function() {
        return this.mesh.position.x+(this.size.x/2);
    }

    public maxY = function() {
        return this.mesh.position.y+(this.size.y/2);
    }

    public maxZ = function() {
        return this.mesh.position.z+(this.size.z/2);
    }
}
