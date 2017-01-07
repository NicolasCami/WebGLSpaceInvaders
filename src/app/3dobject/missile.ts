import { Game3dObject } from "./abstract.game3dobject";
import { MeshService } from "../3dobject/meshservice";

export class Missile extends Game3dObject {

    static increment = 0.2;

    invincible: boolean;
    isAlien: boolean;

    constructor(invincible: boolean = false,
                isAlien: boolean = false,
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        super(new THREE.Vector3(0.0, Missile.increment, 0.0), position);
        
        this.invincible = invincible;
        this.isAlien = isAlien;

        this.init();

    }

    public initMesh() {
        if(this.isAlien) {
            this.mesh = MeshService.getRandomByName('missile-alien');
            this.size = new THREE.Vector3(0.1, 0.3, 0.1);
            this.velocity.y *= -1;
        }
        else {
            if(this.invincible) {
                this.mesh = MeshService.getRandomByName('missile-pad-big');
                this.size = new THREE.Vector3(0.3, 0.3, 0.3);
            }
            else {
                this.mesh = MeshService.getRandomByName('missile-pad');
                this.size = new THREE.Vector3(0.1, 0.3, 0.1);
            }
        }
    }

    public animate() {
        this.mesh.position.add(this.velocity);
    }

    public getDirection() : THREE.Vector3 {
        return this.velocity.clone();
    }
    
    public isInvincible() : boolean {
        return this.invincible;
    }

}
