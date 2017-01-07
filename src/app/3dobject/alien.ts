import { Game } from "../core/game";
import { Game3dObject } from "./abstract.game3dobject";
import { MeshService } from "../3dobject/meshservice";
import { AlienGroup } from "../3dobject/aliengroup";
import { Missile } from "../3dobject/missile";

export class Alien extends Game3dObject {

    static increment = 0.05;
    static meshSwitchDelay = 1000;
    static type = { bottom: 1, middle: 2, top: 3, bonus: 4 };

    score: number;
    type: number;
    lastMeshSwitch: number;
    missileX: number;
    missileY: number;
    missileZ: number;
    missileVelocity: number;
    explosionColor: number;
    mesh2: THREE.Mesh;

    constructor(type: number = Alien.type.top,
                velocity: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0),
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0),
                missileVelocity: number = -1.0) {

        super(velocity, position);
        
        this.type = type;
        this.lastMeshSwitch = 0;
        this.missileX = 0.0;
        this.missileY = 1.0;
        this.missileZ = 0.0;
        this.missileVelocity = missileVelocity;

        this.init();

        this.mesh2.position.copy(this.initialPosition);
        Game.getInstance().scene.add(this.mesh2);
    }

    public initMesh() {
        switch(this.type) {
            case Alien.type.bottom:
                this.mesh = MeshService.getRandomByName('alien-bottom-1');
                this.mesh2 = MeshService.getRandomByName('alien-bottom-2');
                this.mesh2.visible = false;
                this.score = 200;
                this.explosionColor = 0x85b66c;
              break;
            case Alien.type.middle:
                this.mesh = MeshService.getRandomByName('alien-middle-1');
                this.mesh2 = MeshService.getRandomByName('alien-middle-2');
                this.mesh2.visible = false;
                this.score = 150;
                this.explosionColor = 0x3d6686;
              break;
            case Alien.type.top:
                this.mesh = MeshService.getRandomByName('alien-top-1');
                this.mesh2 = MeshService.getRandomByName('alien-top-2');
                this.mesh2.visible = false;
                this.score = 100;
                this.explosionColor = 0xaf72c5;
              break;
            case Alien.type.bonus:
                this.mesh = MeshService.getRandomByName('alien-bonus-1');
                this.mesh2 = MeshService.getRandomByName('alien-bonus-2');
                this.mesh2.visible = false;
                this.score = 500;
                this.explosionColor = 0xaf72c5;
              break;
        }
    }

    public animate(direction: number = AlienGroup.direction.right, gettingDown: number = 0) {
        if (gettingDown<=0) {
          this.mesh.position.x += this.velocity.x * direction;
          this.mesh.position.y += this.velocity.y;
          this.mesh.position.z += this.velocity.z;
          this.mesh2.position.x += this.velocity.x * direction;
          this.mesh2.position.y += this.velocity.y;
          this.mesh2.position.z += this.velocity.z;
        }
        else {
          this.mesh.position.y -= 0.1;
          this.mesh2.position.y -= 0.1;
        }
        if ( (Date.now() - this.lastMeshSwitch) > Alien.meshSwitchDelay) {  
          this.switchMesh();
          this.lastMeshSwitch = Date.now();
        }    
    }

    public switchMesh() {
        if (this.mesh.visible == true) {
            this.mesh.visible = false;
            this.mesh2.visible = true;
        }
        else {
            this.mesh2.visible = false;
            this.mesh.visible = true;
        }
    }

    public getScore = function() : number {
        return this.score;
    }

    public fire = function() : Missile {
        return new Missile(false, true, new THREE.Vector3(this.mesh.position.x - this.missileX, this.mesh.position.y - this.missileY, this.mesh.position.z - this.missileZ));
    }
}