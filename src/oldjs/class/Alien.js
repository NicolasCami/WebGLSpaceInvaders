function Alien(params) {
	// const
	this.INCREMENT = 0.05;
	
	// attributes

	this.score = typeof params.score !== 'undefined' ? params.score : 100;
	this.type = typeof params.type !== 'undefined' ? params.type : 3;
	this.vx = typeof params.vx !== 'undefined' ? params.vx : this.INCREMENT;
	this.vy = typeof params.vy !== 'undefined' ? params.vy : 0.0;
	this.vz = typeof params.vz !== 'undefined' ? params.vz : 0.0;
	this.LastSwitch = 0;
	this.missileX = typeof params.missileX !== 'undefined' ? params.missileX : 0.0;
	this.missileY = typeof params.missileY !== 'undefined' ? params.missileY : 1.0;
	this.missileZ = typeof params.missileZ !== 'undefined' ? params.missileZ : 0.0;
	this.missileVelocity = typeof params.missileVelocity !== 'undefined' ? params.missileVelocity : -0.1;
	switch(this.type) {
		case 1:
			this.mesh = randFromArray(alienData.type[0].model1).clone();
			this.mesh2 = randFromArray(alienData.type[0].model2).clone();
            this.mesh2.visible = false;
            this.score = 200;
            this.explosionColor = 0x85b66c;
            //this.explosion = alienData.type[0].explosion.clone();
			break;
		case 2:
			this.mesh = randFromArray(alienData.type[1].model1).clone();
			this.mesh2 = randFromArray(alienData.type[1].model2).clone();
            this.mesh2.visible = false;
            this.score = 150;
            this.explosionColor = 0x3d6686;
            //this.explosion = alienData.type[1].explosion.clone();
			break;
		case 3:
			this.mesh = randFromArray(alienData.type[2].model1).clone();
			this.mesh2 = randFromArray(alienData.type[2].model2).clone();
            this.mesh2.visible = false;
            this.score = 100;
            this.explosionColor = 0xaf72c5;
            //this.explosion = alienData.type[2].explosion.clone();
			break;
	}
	this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
	this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
	this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;

	this.mesh2.position.x = typeof params.x !== 'undefined' ? params.x : this.mesh.position.x;
	this.mesh2.position.y = typeof params.y !== 'undefined' ? params.y : this.mesh.position.y;
	this.mesh2.position.z = typeof params.z !== 'undefined' ? params.z : this.mesh.position.z;

	this.size = typeof params.size !== 'undefined' ? params.size : {x:1.0, y:1.0, z:1.0};
	

	// methods
	this.animate = function(l) {
		if (alienGetDown<=0)		
		{
			this.mesh.position.x += this.vx * l;
			this.mesh.position.y += this.vy;
			this.mesh.position.z += this.vz;
			this.mesh2.position.x += this.vx * l;
			this.mesh2.position.y += this.vy;
			this.mesh2.position.z += this.vz;
		}
		else
		{
			this.mesh.position.y -= 0.1;
			this.mesh2.position.y -= 0.1;
		}
		this.fire();
		if ( (Date.now() - this.LastSwitch) > 1000)
		{  
			this.switchMesh();
			this.LastSwitch = Date.now();
		}    
	};

	this.switchMesh = function() {
		if (this.mesh.visible == true)
		{
			this.mesh.visible = false;
			this.mesh2.visible = true;
		}
		else
		{
			this.mesh2.visible = false;
			this.mesh.visible = true;
		}
	};
	
	this.getX = function() {
		return this.mesh.position.x;
	};
	this.getY = function() {
	    return this.mesh.position.y;
	};
	
	this.minX = function() {
	    return this.mesh.position.x-(this.size.x/2);
	};
	this.minY = function() {
	    return this.mesh.position.y-(this.size.y/2);
	};
	this.minZ = function() {
	    return this.mesh.position.z-(this.size.z/2);
	};
	this.maxX = function() {
	    return this.mesh.position.x+(this.size.x/2);
	};
	this.maxY = function() {
	    return this.mesh.position.y+(this.size.y/2);
	};
	this.maxZ = function() {
	    return this.mesh.position.z+(this.size.z/2);
	};
	
	this.getScore = function() {
	    return this.score;
	};
	
	this.fire = function() {
		m = new Missile({
			x : this.mesh.position.x - this.missileX,
			y : this.mesh.position.y - this.missileY,
			z : this.mesh.position.z - this.missileZ,
			vy : this.missileVelocity,
			alien: true,
		});
		return m;
	};
}

function AlienGroup() {
	//const
	this.FIRE_DELAY = 2000.0;
	//attributes
	this.aliens = [];
	this.aliensBottom = [];
	
	//methods
	this.addAlien = function(alien) {
		this.aliens.push(alien);
	};

	this.onRight = function () {
		var max = -999;
		for(var i =0; i < this.aliens.length; i++)
		{
			if (this.aliens[i].getX() > max)
				max=this.aliens[i].getX();
		}
		return max;
	}

	this.onLeft = function () {
		var min = 999;
		for(var i =0; i < this.aliens.length; i++)
		{
			if (this.aliens[i].getX() < min)
				min=this.aliens[i].getX();
		}
		return min;
	}

	this.onBottom = function () {
		var min = 999;
		for(var i =0; i < this.aliens.length; i++)
		{
			if (this.aliens[i].getY() < min)
				min=this.aliens[i].getY();
		}
		return min;
	}

	this.chooseFiringAlien = function () {
		var x = this.aliensBottom[0];
		if(world.getLevel() < 2) {
			x = randFromArray(this.aliensBottom);
		}
		else {
			for(var i=1; i < this.aliensBottom.length; i++) {
				if(Math.abs(this.aliens[this.aliensBottom[i]].getX() - world.pad.getX()) < Math.abs(this.aliens[x].getX() - world.pad.getX())) {
					x = this.aliensBottom[i];
				}
			}
		}
		return x;
	}

	this.init = function(lines, rows, level) {
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
				}));
			}
		}
		this.aliensBottom = [24,23,22,21,20];
	};
	
	this.remove = function(i)
	{
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
	};

	this.getLength = function ()
	{
		return this.aliens.length;
	};

	this.get = function (i)
	{
		return this.aliens[i];
	};

	this.fire = function (AlienGroupSize)
	{
		//var delay = this.FIRE_DELAY;
		//if(Date.now()-this.lastFire > delay) {
		if (AlienGroupSize>0)
		{
			var firingAlien = this.chooseFiringAlien();
			var m = this.aliens[firingAlien].fire();
			if(m) {
				soundAlienFire.play();
				return m;
			}
			else return false;
		}
		else return false;
		//}
		//else return false;
	};
	
	this.animate = function(fall) {
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
	};
}

function AlienBonus(params) {
	// const
	this.INCREMENT = 0.03;
	
	// attributes

	this.score = typeof params.score !== 'undefined' ? params.score : 100;
	this.vx = typeof params.vx !== 'undefined' ? params.vx : this.INCREMENT;
	this.vy = typeof params.vy !== 'undefined' ? params.vy : 0.0;
	this.vz = typeof params.vz !== 'undefined' ? params.vz : this.INCREMENT;
	this.LastSwitch = 0;
	this.missileX = typeof params.missileX !== 'undefined' ? params.missileX : 0.0;
	this.missileY = typeof params.missileY !== 'undefined' ? params.missileY : 1.0;
	this.missileZ = typeof params.missileZ !== 'undefined' ? params.missileZ : 0.0;
	this.missileVelocity = typeof params.missileVelocity !== 'undefined' ? params.missileVelocity : -0.1;
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

	this.size = typeof params.size !== 'undefined' ? params.size : {x:1.0, y:1.0, z:1.0};
	
	this.step = 'init';
	this.LastSwitch = 0;
	

	// methods
	
	// return false if need to be deleted
	this.animate = function() {
		if((Date.now() - this.LastSwitch) > 1000) {  
			this.switchMesh();
			this.LastSwitch = Date.now();
		}    
		switch(this.step) {
			case 'init':
				if(this.mesh.position.z > 0) {
					this.mesh.position.z -= this.vz;
					this.mesh2.position.z -= this.vz;
				}
				else {
					this.mesh.position.z = 0.0;
					this.mesh2.position.z = 0.0;
					this.step = 'move';
				}
				break;
			case 'move':
				this.mesh.position.x -= this.vx;
				this.mesh2.position.x -= this.vx;
				if(this.mesh.position.x < -10.0) {
					this.step = 'end';
				}
				break;
			case 'end':
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

	this.switchMesh = function() {
		if (this.mesh.visible == true)
		{
			this.mesh.visible = false;
			this.mesh2.visible = true;
		}
		else
		{
			this.mesh2.visible = false;
			this.mesh.visible = true;
		}
	};
	
	this.getX = function() {
		return this.mesh.position.x;
	};
	this.getY = function() {
	    return this.mesh.position.y;
	};
	
	this.minX = function() {
	    return this.mesh.position.x-(this.size.x/2);
	};
	this.minY = function() {
	    return this.mesh.position.y-(this.size.y/2);
	};
	this.minZ = function() {
	    return this.mesh.position.z-(this.size.z/2);
	};
	this.maxX = function() {
	    return this.mesh.position.x+(this.size.x/2);
	};
	this.maxY = function() {
	    return this.mesh.position.y+(this.size.y/2);
	};
	this.maxZ = function() {
	    return this.mesh.position.z+(this.size.z/2);
	};
	
	this.getScore = function() {
	    return this.score;
	};
}
