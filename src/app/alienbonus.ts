class AlienBonus extends Alien {

    static increment = 0.03;
    static steps = { init: 1, move: 2, end: 3 };

    step: number;
  
    constructor(params: any, game: Game) {
        super(params, game);

        this.vx = typeof params.vx !== 'undefined' ? params.vx : AlienBonus.increment;
        this.vy = typeof params.vy !== 'undefined' ? params.vy : 0.0;
        this.vz = typeof params.vz !== 'undefined' ? params.vz : AlienBonus.increment;
        this.lastMeshSwitch = 0;
        this.step = AlienBonus.steps.init;
        this.mesh = randFromArray(alienData.type[3].model1).clone();
        this.mesh2 = randFromArray(alienData.type[3].model2).clone();
        this.mesh2.visible = false;
        this.score = 500;
        
        this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 10.0;
        this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 21.0;
        this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 10.0;

        this.mesh2.position.x = typeof params.x !== 'undefined' ? params.x : this.mesh.position.x;
        this.mesh2.position.y = typeof params.y !== 'undefined' ? params.y : this.mesh.position.y;
        this.mesh2.position.z = typeof params.z !== 'undefined' ? params.z : this.mesh.position.z;
    }
  
    // return false if need to be deleted
    public animate(): boolean {
        if((Date.now() - this.lastMeshSwitch) > Alien.meshSwitchDelay) {  
          this.switchMesh();
          this.lastMeshSwitch = Date.now();
        }    
        switch(this.step) {
          case AlienBonus.steps.init:
            if(this.mesh.position.z > 0) {
              this.mesh.position.z -= this.vz;
              this.mesh2.position.z -= this.vz;
            }
            else {
              this.mesh.position.z = 0.0;
              this.mesh2.position.z = 0.0;
              this.step = AlienBonus.steps.move;
            }
            break;
          case AlienBonus.steps.move:
            this.mesh.position.x -= this.vx;
            this.mesh2.position.x -= this.vx;
            if(this.mesh.position.x < -10.0) {
              this.step = AlienBonus.steps.end;
            }
            break;
          case AlienBonus.steps.end:
            if(this.mesh.position.z < 10.0) {
              this.mesh.position.z += this.vz;
              this.mesh2.position.z += this.vz;
            }
            else {
              return false;
            }
            break;
        }
        return true;
    };

}
