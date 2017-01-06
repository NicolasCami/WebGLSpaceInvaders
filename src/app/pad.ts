import { Game } from "./game";
import { Game3dObject } from "./abstract.game3dobject";
import { MeshService } from "./meshservice";
import { SoundService } from "./soundservice";
import { Missile } from "./missile";
import { Bonus } from "./bonus";
import { ScoreAnimation } from "./scoreanimation";

export class Pad extends Game3dObject {

    static increment = 0.15;
    static fireDelay = 2000.0;
    static fireDelayFast = 500.0;
    static width = 1.0;
    static rotationDelay = 50.0;
    static rotationMaxAngleRadian = 0.5;
    static rotationIncrement = 0.1;

    positionBounds: any;
    missileStartPosition: THREE.Vector3;
    lastFire: number;
    movingLeft: boolean;
    movingRight: boolean;
    movingTime: number;
    missileInvincible: number;
    missileFast: number;
    curve: THREE.QuadraticBezierCurve3;
    curveProgress: number;

    constructor(positionBounds: any = { min: 0, max: 1 },
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        super(new THREE.Vector3(Pad.increment, 0.0, 0.0), position);
        
        this.positionBounds = positionBounds;
        this.missileStartPosition = new THREE.Vector3(0.0, 1.0, 0.0);
        this.lastFire = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingTime = 0;
        this.missileInvincible = 0;
        this.missileFast = 0;
        this.curve = null;
        this.curveProgress = 100;

        this.init();

    }

    public initMesh() {
        this.mesh = MeshService.getRandomByName('pad');
    }

    public left() {
        this.movingLeft = true;
        this.movingRight = false;
        this.movingTime = Date.now();
        this.mesh.position.x -= Pad.increment;
        if(this.mesh.position.x < this.positionBounds.min + Pad.width) {
          this.mesh.position.x = this.positionBounds.min + Pad.width;
        }
    }

    public right() {
        this.movingRight = true;
        this.movingLeft = false;
        this.movingTime = Date.now();
        this.mesh.position.x += Pad.increment;
        if(this.mesh.position.x > this.positionBounds.max - Pad.width) {
          this.mesh.position.x = this.positionBounds.max - Pad.width;
        }
    }

    public animate() {
        if(Date.now()-this.movingTime > Pad.rotationDelay) {
          this.movingLeft = false;
          this.movingRight = false;
        }
        if(this.movingLeft) {
          this.mesh.rotation.y -= Pad.rotationIncrement;
          if(this.mesh.rotation.y < -Pad.rotationMaxAngleRadian) {
            this.mesh.rotation.y = -Pad.rotationMaxAngleRadian;
          }
        }
        else if(this.movingRight) {
          this.mesh.rotation.y += Pad.rotationIncrement;
          if(this.mesh.rotation.y > Pad.rotationMaxAngleRadian) {
            this.mesh.rotation.y = Pad.rotationMaxAngleRadian;
          }
        }
        else {
          if(this.mesh.rotation.y > -0.15 && this.mesh.rotation.y < 0.15) {
            this.mesh.rotation.y = 0.0;
          }
          else if(this.mesh.rotation.y < 0.0) {
            this.mesh.rotation.y += Pad.rotationIncrement;
          }
          else if(this.mesh.rotation.y > 0.0) {
            this.mesh.rotation.y -= Pad.rotationIncrement;
          }
        }
    }

    public resetPosition() {
        this.lastFire = 0;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingTime = 0;
        this.mesh.rotation.y = 0;
        this.mesh.position.x = 0;
    }

    public animateResetInit() {
        this.curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z), new THREE.Vector3(this.mesh.position.x / 2, this.mesh.position.y / 2, 3), new THREE.Vector3(0.0, 0.0, 0.0));
        this.curveProgress = 0.0;
    }

    public animateReset() : boolean {
        if(this.curveProgress < 1.0) {
          var point = this.curve.getPoint(this.curveProgress);
          this.mesh.position.x = point.x;
          this.mesh.position.y = point.y;
          this.mesh.position.z = point.z;
          this.mesh.rotation.y = (2*Math.PI * this.curveProgress);
          this.curveProgress += 0.02;
          Game.getInstance().updateCameraPad();
        }
        else {
          this.mesh.rotation.y = 0;
          return true;
        }

        return false;
    }

    public fire() : Missile | boolean {
        var delay = Pad.fireDelay;
        if(this.missileFast > 0) {
          delay = Pad.fireDelayFast;
        }

        if(Date.now()-this.lastFire > delay) {
          SoundService.getSoundByName('pad-fire').play();
          var m = null;
          if(this.missileInvincible) {
            m = new Missile(true, false, this.mesh.position.clone().add(this.missileStartPosition));
            this.missileInvincible -= 1;
          }
          else {
            m = new Missile(false, false, this.mesh.position.clone().add(this.missileStartPosition));
          }
          if(this.missileFast > 0) {
            this.missileFast -= 1;
          }
          this.lastFire = Date.now();
          return m;
        }
        return false;
    }

    public resetFireDelay() {
        this.lastFire = 0;
    }

    public addBonus(bonus) {
        let e: ScoreAnimation;
        
        switch(bonus.getType()) {
            case Bonus.type.superMissile:
                this.missileInvincible += 1;
                e = new ScoreAnimation('MEGA SHOT', this.mesh.position.clone());
                Game.getInstance().world.scores.push(e);
                break;

            case Bonus.type.extraLife:
                Game.getInstance().updateLife(Game.getInstance().life+1);
                e = new ScoreAnimation('+1 LIFE', this.mesh.position.clone());
                Game.getInstance().world.scores.push(e);
                break;

            default:
                console.log('Warning: catching unknown bonus. No effect!');
                break;
        }
    }
}
