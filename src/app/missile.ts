class Missile extends Game3dObject {

    static increment = 0.2;

    invincible: boolean;
    isAlien: boolean;

    constructor(invincible: boolean = false,
                isAlien: boolean = false,
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        super(new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, Missile.increment, 0.0), position);
        
        this.invincible = invincible;
        this.isAlien = isAlien;

        this.init();

    }

    public initMesh() {
        if(this.isAlien) {
            this.mesh = missileData.type[0].model.clone();
            this.size = new THREE.Vector3(0.1, 0.3, 0.1);
            this.velocity.y *= -1;
        }
        else {
            if(this.invincible) {
                this.mesh = missileData.type[2].model.clone();
                this.size = new THREE.Vector3(0.3, 0.3, 0.3);
            }
            else {
                this.mesh = missileData.type[1].model.clone();
                this.size = new THREE.Vector3(0.1, 0.3, 0.1);
            }
        }
    }

    public animate() {
        this.mesh.position.add(this.velocity);
    }

    public getDirection() {
        return this.velocity.clone();
    }
    
    public isInvincible() {
        return this.invincible;
    }

}
