import { Game } from "./game";
import { SoundService } from "./soundservice";
import { Alien } from "./alien";
import { Missile } from "./missile";

export class AlienGroup {

    static direction = { right: 1, left: -1 };
    static positionBounds = { min: -11, max: 11 };

    aliens: Alien[];
    aliensBottom: number[];
    gettingDown: number;
    currentDirection: number;

    constructor() {
        this.aliens = [];
        this.aliensBottom = [];
        this.gettingDown = 0;
        this.currentDirection = AlienGroup.direction.right;
    }
  
    public addAlien(alien: Alien) : number {
        this.aliens.push(alien);
        return this.aliens.length-1;
    }

    /**
     * Return the position of the alien at the right side of the group.
     * @return {number} The maximum right position.
     */
    public onRight() : number {
        let max = -999;
        for(let i =0; i < this.aliens.length; i++) {
            if (this.aliens[i].getX() > max) {
                max=this.aliens[i].getX();
            }
        }
        return max;
    }

    /**
     * Return the position of the alien at the left side of the group.
     * @return {number} The maximum left position.
     */
    public onLeft() : number {
        let min = 999;
        for(let i =0; i < this.aliens.length; i++) {
            if (this.aliens[i].getX() < min) {
                min=this.aliens[i].getX();
            }
        }
        return min;
    }

    /**
     * Return the position of the alien at the bottom side of the group.
     * @return {number} The maximum bottom position.
     */
    public onBottom() : number {
        let min = 999;
        for(let i =0; i < this.aliens.length; i++) {
            if (this.aliens[i].getY() < min) {
                min=this.aliens[i].getY();
            }
        }
        return min;
    }

    /**
     * Choose a random alien to fire.
     * Return the index of the chosen one.
     * @return {number} Index of an random alien which can fire.
     */
    public chooseFiringAlien(): number {
        let x = this.aliensBottom[0];
        if(Game.getInstance().world.getLevel() < 2) {
            x = randFromArray(this.aliensBottom);
        }
        else {
            for(let i=1; i < this.aliensBottom.length; i++) {
                if(Math.abs(this.aliens[this.aliensBottom[i]].getX() - Game.getInstance().world.pad.getX()) < Math.abs(this.aliens[x].getX() - Game.getInstance().world.pad.getX())) {
                    x = this.aliensBottom[i];
                }
            }
        }
        return x;
    }

    public init(lines: number, rows: number, level: number) {
        let type: number;
        for(let i = 0; i < lines; i++) {
            for(let j = 0; j < rows; j++) {
                if (i == 0) {
                    type = Alien.type.bottom;
                }
                else if (i < 3) {
                    type = Alien.type.middle;
                }
                else {
                    type = Alien.type.top;
                }

                this.addAlien(new Alien(type, new THREE.Vector3(0.05 + (0.01*level), 0.0, 0.0), new THREE.Vector3(-5 + j*2, 20.0 - i*2, 0.0), -0.1 - (level*0.02)));
            }
        }
        this.computeAliensBottom();
    }

    public computeAliensBottom() {
        this.aliensBottom = [];
        for(let j=0; j < this.aliens.length; j++) {
            let add = true;
            for(let k=j+1; k < this.aliens.length; k++) {
                if(this.aliens[k].mesh.position.x == this.aliens[j].mesh.position.x &&
                    this.aliens[k].mesh.position.y < this.aliens[j].mesh.position.y) {
                    add = false;
                    break;
                }
            }

            if(add) {
                this.aliensBottom.push(j);
            }
        }
    }

    public remove(i: number) {
        this.aliens.splice(i, 1);
        this.computeAliensBottom();
    }

    public getLength(): number {
        return this.aliens.length;
    }

    public get(i: number): Alien {
        return this.aliens[i];
    }

    public fire(): boolean | Missile {
        let firingAlien: number;
        let m: Missile | boolean;

        if(this.getLength()) {
            firingAlien = this.chooseFiringAlien();
            m = this.aliens[firingAlien].fire();
            if(m) {
                SoundService.getSoundByName('alien-fire').play();
                return m;
            }
        }
        
        return false;
    }

    /**
     * Animate all aliens.
     * Make them to change change direction and to fall if needed.
     * @param {boolean = true} canFall If false, aliens won't fall, they will only moving from left to right and right to left.
     */
    public animate(canFall: boolean = true) {
        if(this.gettingDown <= 0) {         
            if(this.onLeft() < AlienGroup.positionBounds.min + 1.5) {
                this.currentDirection = AlienGroup.direction.right;
                this.animateAliens();
                if(canFall) {
                    this.gettingDown = 8;
                }
            }
            if(this.onRight() > AlienGroup.positionBounds.max - 1.5) {
                this.currentDirection = AlienGroup.direction.left;
                this.animateAliens();
                if(canFall) {
                    this.gettingDown = 8;
                }
            }
        }
        else {
            this.gettingDown -= 1;
        }

        this.animateAliens();
    }

    public animateAliens() {
        for(let i=0; i < this.aliens.length; i++) {
            this.aliens[i].animate(this.currentDirection, this.gettingDown);
        }
    }
}