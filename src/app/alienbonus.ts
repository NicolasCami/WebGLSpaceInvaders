class AlienBonus extends Alien {

    static increment = 0.03;
    static steps = { init: 1, move: 2, end: 3 };

    step: number;

    constructor() {
        super(Alien.type.bonus, new THREE.Vector3(AlienBonus.increment, 0.0, AlienBonus.increment), new THREE.Vector3(10.0, 21.0, 10.0));

        this.step = AlienBonus.steps.init;
    }
  
    /**
     * Animate the alien.
     * @return {boolean} If false, the alien have reach the end, it needs to be deleted.
     */
    public animate(): boolean {
        if((Date.now() - this.lastMeshSwitch) > Alien.meshSwitchDelay) {  
            this.switchMesh();
            this.lastMeshSwitch = Date.now();
        }    
        switch(this.step) {
          case AlienBonus.steps.init:
            if(this.mesh.position.z > 0) {
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
            if(this.mesh.position.x < -10.0) {
              this.step = AlienBonus.steps.end;
            }
            break;
          case AlienBonus.steps.end:
            if(this.mesh.position.z < 10.0) {
              this.mesh.position.z += this.velocity.z;
              this.mesh2.position.z += this.velocity.z;
            }
            else {
              return false;
            }
            break;
        }
        return true;
    }

}
