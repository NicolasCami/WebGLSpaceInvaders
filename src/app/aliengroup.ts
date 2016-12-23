class AlienGroup {

    static FIRE_DELAY = 2000.0;

    aliens: Alien[];
    aliensBottom: number[];
    game: Game;

    constructor(game: Game) {
        this.aliens = [];
        this.aliensBottom = [];
        this.game = game;
    }
  
    public addAlien(alien: Alien) {
        this.aliens.push(alien);
    }

    public onRight() {
        var max = -999;
        for(var i =0; i < this.aliens.length; i++)
        {
          if (this.aliens[i].getX() > max)
            max=this.aliens[i].getX();
        }
        return max;
    }

    public onLeft() {
        var min = 999;
        for(var i =0; i < this.aliens.length; i++)
        {
          if (this.aliens[i].getX() < min)
            min=this.aliens[i].getX();
        }
        return min;
    }

    public onBottom() {
        var min = 999;
        for(var i =0; i < this.aliens.length; i++)
        {
          if (this.aliens[i].getY() < min)
            min=this.aliens[i].getY();
        }
        return min;
    }

    public chooseFiringAlien(): number {
        var x = this.aliensBottom[0];
        if(this.game.world.getLevel() < 2) {
          x = randFromArray(this.aliensBottom);
        }
        else {
          for(var i=1; i < this.aliensBottom.length; i++) {
            if(Math.abs(this.aliens[this.aliensBottom[i]].getX() - this.game.world.pad.getX()) < Math.abs(this.aliens[x].getX() - this.game.world.pad.getX())) {
              x = this.aliensBottom[i];
            }
          }
        }
        return x;
    }

    public init(lines: number, rows: number, level: number) {
        var _type;
        for(var i = 0; i < lines; i++)
        {
          for(var j = 0; j < rows; j++)
          {
            if (i == 0) _type = 1;
            else if (i < 3) _type = 2;
            else _type = 3;

            this.addAlien(new Alien({
                x : -5 + j*2,
                y : 20.0 - i*2,
                z : 0.0,
                vx : 0.05 + (0.01*level),
                type : _type,
                missileVelocity : -0.1 - (level*0.02),
            }, this.game));
          }
        }
        this.aliensBottom = [24,23,22,21,20];
    }

    public remove(i: number) {
        this.aliens.splice(i, 1);

        // recherche des aliens en bas de colonnes
        this.aliensBottom = [];
        for(var j=0; j < this.aliens.length; j++) {
          var add = true;
          for(var k=j+1; k < this.aliens.length; k++) {
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

    public getLength(): number {
        return this.aliens.length;
    }

    public get(i: number): Alien {
        return this.aliens[i];
    }

    public fire(AlienGroupSize: number): boolean | Missile {
        if (AlienGroupSize>0) {
          let firingAlien = this.chooseFiringAlien();
          let m = this.aliens[firingAlien].fire();
          if(m) {
            soundAlienFire.play();
            return m;
          }
          else return false;
        }
        else return false;
    }

    public animate(fall: boolean) {
        fall = typeof fall !== 'undefined' ? fall : true;

        if (alienGetDown<=0)
        {         
          if (this.onLeft()<xMin+1.5){
            dir = 1;
            for(var i= 0; i < this.aliens.length; i++) {
              this.aliens[i].animate(dir);
            }
            if(fall == true)
            alienGetDown=8;
          }
          if (this.onRight()>xMax-1.5){
            dir = -1;
            for(var i= 0; i < this.aliens.length; i++) {
              this.aliens[i].animate(dir);
            }
            if(fall == true)
            alienGetDown=8;
          }
        }
        if (alienGetDown>0) alienGetDown-=1;
        for(var i= 0; i < this.aliens.length; i++) {
             this.aliens[i].animate(dir);
        }
    }
}