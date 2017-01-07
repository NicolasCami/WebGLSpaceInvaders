import { Game3dObject } from "./abstract.game3dobject";
import { MeshService } from "../3dobject/meshservice";

export class Bonus extends Game3dObject {

    static increment = 0.05;
    static type = { superMissile: 1, extraLife: 2 };

    type: number;

    constructor(type: number = 1,
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        super(new THREE.Vector3(0.0, -Bonus.increment, 0.0), position);
        
        this.type = type;

        this.init();

    }

    public initMesh() {
        switch(this.type) {
            case Bonus.type.superMissile:
                this.mesh = MeshService.getRandomByName('bonus-missile');
                break;
            case Bonus.type.extraLife:
                this.mesh = MeshService.getRandomByName('bonus-life');
                break;
            default:
                this.mesh = MeshService.getRandomByName('bonus-missile');
                console.log('Warning: Unknown bonus created! With type:', this.type);
                break;
        }
    }

    public animate() {
        this.mesh.position.add(this.velocity);
        this.mesh.rotation.z += 0.1;
        
        if(this.mesh.position.y < -2.0) {
            return true;
        }
        return false;
    }
    
    public getType() {
        return this.type;
    }
}
