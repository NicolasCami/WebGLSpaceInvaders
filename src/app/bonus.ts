class Bonus {

    static INCREMENT = 0.05;

    vx: number;
    vy: number;
    vz: number;
    type: number;
    size: any;
    mesh: THREE.Mesh;
    game: Game;

    constructor(params: any, game: Game) {
        this.vx = typeof params.vx !== 'undefined' ? params.vx : 0.0;
        this.vy = typeof params.vy !== 'undefined' ? params.vy : -Bonus.INCREMENT;
        this.vz = typeof params.vz !== 'undefined' ? params.vz : 0.0;
        this.type = typeof params.type !== 'undefined' ? params.type : 0;
        
        switch(this.type) {
            case 1:
                this.mesh = bonusData.type[0].model.clone();
                this.size = {x:0.8,y:0.8,z:1.0};
                break;
            case 2:
                this.mesh = bonusData.type[1].model.clone();
                this.size = {x:0.8,y:0.8,z:1.0};
                break;
            default:
                this.mesh = bonusData.type[0].model.clone();
                this.size = {x:0.8,y:0.8,z:1.0};
                break;
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
        this.mesh.rotation.z += 0.1;
        
        if(this.mesh.position.y < -2.0) {
            return true;
        }
        return false;
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
    
    public getType() {
        return this.type;
    }
}
