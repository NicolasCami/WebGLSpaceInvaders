class Pad {

    static INCREMENT = 0.15;
    static FIRE_DELAY = 2000.0;
    static FIRE_DELAY_FAST = 500.0;
    static WIDTH = 1.0;
    static DELAY_ROTATION = 50.0;
    static MAX_ROTATION = 0.5;
    static INCREMENT_ROTATION = 0.1;

    mesh: THREE.Mesh;
    size: any;
    missileX: number;
    missileY: number;
    missileZ: number;
    screenMinX: number;
    screenMaxX: number;
    lastFire: number;
    movingLeft: boolean;
    movingRight: boolean;
    movingTime: number;
    missileInvincible: number;
    missileFast: number;
    curve: THREE.QuadraticBezierCurve3;
    curveProgress: number;
    game: Game;

    constructor(params: any, game: Game) {
        let model = loadModel({
            content : ',          **      **,         *  *    *  *,         *  *    *  *,          **      **,          **      **,         *  *    *  *,         *  *    *  *,          **      **/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */,,              **,            ******,            ******,            ******,            ******,              **/,,              **,            ******,            ******,            ******,            ******,              **/,,,             ****,            ******,            ******,             ****,/,,,             ****,            ******,            ******,             ****,/,,,              **,             ****,             ****,              **/',
            modelSize : {x:1.5,y:0.75,z:1.0},
            material : padMaterials,
            geometry : padBlockGeometry,
            blockSize : 0.05,
            axe : 'y',
        });
        this.mesh = model;

        this.size = typeof params.size !== 'undefined' ? params.size : {x:1.5,y:0.75,z:1.0};
        this.missileX = typeof params.missileX !== 'undefined' ? params.missileX : 0.0;
        this.missileY = typeof params.missileY !== 'undefined' ? params.missileY : 1.0;
        this.missileZ = typeof params.missileZ !== 'undefined' ? params.missileZ : 0.0;
        this.screenMinX = typeof params.minx !== 'undefined' ? params.minx : -5.0;
        this.screenMaxX = typeof params.maxx !== 'undefined' ? params.maxx : 5.0;
        this.lastFire = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingTime = 0;
        this.missileInvincible = 0;
        this.missileFast = 0;
        this.curve = null;
        this.curveProgress = 100;
        this.game = game;
    }

    // animation
    public left = function() {
        this.movingLeft = true;
        this.movingRight = false;
        this.movingTime = Date.now();
        this.mesh.position.x -= Pad.INCREMENT;
        if(this.mesh.position.x < this.screenMinX+Pad.WIDTH) {
          this.mesh.position.x = this.screenMinX+Pad.WIDTH;
        }
    }

    public right = function() {
        this.movingRight = true;
        this.movingLeft = false;
        this.movingTime = Date.now();
        this.mesh.position.x += Pad.INCREMENT;
        if(this.mesh.position.x > this.screenMaxX-Pad.WIDTH) {
          this.mesh.position.x = this.screenMaxX-Pad.WIDTH;
        }
    }

    public animate = function() {
        if(Date.now()-this.movingTime > Pad.DELAY_ROTATION) {
          this.movingLeft = false;
          this.movingRight = false;
        }
        if(this.movingLeft) {
          this.mesh.rotation.y -= Pad.INCREMENT_ROTATION;
          if(this.mesh.rotation.y < -Pad.MAX_ROTATION) {
            this.mesh.rotation.y = -Pad.MAX_ROTATION;
          }
        }
        else if(this.movingRight) {
          this.mesh.rotation.y += Pad.INCREMENT_ROTATION;
          if(this.mesh.rotation.y > Pad.MAX_ROTATION) {
            this.mesh.rotation.y = Pad.MAX_ROTATION;
          }
        }
        else {
          if(this.mesh.rotation.y > -0.15 && this.mesh.rotation.y < 0.15) {
            this.mesh.rotation.y = 0.0;
          }
          else if(this.mesh.rotation.y < 0.0) {
            this.mesh.rotation.y += Pad.INCREMENT_ROTATION;
          }
          else if(this.mesh.rotation.y > 0.0) {
            this.mesh.rotation.y -= Pad.INCREMENT_ROTATION;
          }
        }
    }

    public resetPosition = function() {
        this.lastFire = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingTime = 0;
        this.mesh.rotation.y = 0;
        this.mesh.position.x = 0;
    }

    public animateResetInit = function() {
        this.curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z), new THREE.Vector3(this.mesh.position.x / 2, this.mesh.position.y / 2, 3), new THREE.Vector3(0.0, 0.0, 0.0));
        this.curveProgress = 0.0;
    }

    public animateReset = function() {
        if(this.curveProgress < 1.0) {
          var point = this.curve.getPoint(this.curveProgress);
          this.mesh.position.x = point.x;
          this.mesh.position.y = point.y;
          this.mesh.position.z = point.z;
          this.mesh.rotation.y = (2*Math.PI * this.curveProgress);
          this.curveProgress += 0.02;
          this.game.updateCameraPad();
        }
        else {
          this.mesh.rotation.y = 0;
          return true;
        }

        return false;
    }

    public fire = function() {
        var delay = Pad.FIRE_DELAY;
        if(this.missileFast > 0) {
          delay = Pad.FIRE_DELAY_FAST;
        }

        if(Date.now()-this.lastFire > delay) {
          soundPadFire.play();
          var m = null;
          if(this.missileInvincible) {
            m = new Missile(this.game, true, false, new THREE.Vector3(this.mesh.position.x + this.missileX, this.mesh.position.y + this.missileY, this.mesh.position.z + this.missileZ));
            this.missileInvincible -= 1;
          }
          else {
            m = new Missile(this.game, false, false, new THREE.Vector3(this.mesh.position.x + this.missileX, this.mesh.position.y + this.missileY, this.mesh.position.z + this.missileZ));
          }
          if(this.missileFast > 0) {
            this.missileFast -= 1;
          }
          this.lastFire = Date.now();
          return m;
        }
        return false;
    }

    public resetFireDelay = function() {
        this.lastFire = 0;
    }

    public getX = function() {
        return this.mesh.position.x;
    }

    public getY = function() {
      return this.mesh.position.y;
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

    public addBonus = function(bonus) {
        let e: ScoreAnimation;
        
        switch(bonus.getType()) {
          case 1:
            this.missileInvincible += 1;
            e = new ScoreAnimation({
              x : this.mesh.position.x,
              y : this.mesh.position.y,
              z : this.mesh.position.z,
              text : 'MEGA SHOT',
            }, this.game);
            this.game.world.scores.push(e);
            break;
            
          case 2:
            this.game.updateLife(this.game.life+1);
            e = new ScoreAnimation({
              x : this.mesh.position.x,
              y : this.mesh.position.y,
              z : this.mesh.position.z,
              text : '+1 LIFE',
            }, this.game);
            this.game.world.scores.push(e);
            break;
          
          default:
            break;
        }
    }
}
