import { Game } from "../core/game";
import { Game3dObject } from "./abstract.game3dobject";
import { MeshService } from "../3dobject/meshservice";

export class Block extends Game3dObject {

    static orientations = { up: 1, down: -1 };

    orientation: number;
    moveLimit: number;

    constructor(position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        super(new THREE.Vector3(0.001 + (Math.random()*0.005), 0.0, 0.0), position);
        
        this.orientation = (Math.floor((Math.random()*2)) > 0) ? Block.orientations.down : Block.orientations.up;
        this.moveLimit = 0.2;

        this.init();

    }

    public initMesh() {
        let mesh = MeshService.getRandomByName('block');
        mesh.castShadow = true;
        this.mesh = mesh;
    }

    public animate() {
        this.mesh.position.z += this.orientation * this.velocity.x;

        if(this.mesh.position.z > this.moveLimit) {
          this.mesh.position.z = this.moveLimit;
          this.orientation = Block.orientations.down;
        }
        else if(this.mesh.position.z < -this.moveLimit) {
          this.mesh.position.z = -this.moveLimit;
          this.orientation = Block.orientations.up;
        }
    }
}
