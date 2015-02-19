function Missile(params) {
	// const
	this.INCREMENT = 0.2;

	// attributes
	this.vx = typeof params.vx !== 'undefined' ? params.vx : 0.0;
	this.vy = typeof params.vy !== 'undefined' ? params.vy : this.INCREMENT;
	this.vz = typeof params.vz !== 'undefined' ? params.vz : 0.0;
	this.invincible = typeof params.invincible !== 'undefined' ? params.invincible : false;
	this.alien = typeof params.alien !== 'undefined' ? params.alien : false;
	
	if(this.alien) {
		this.mesh = missileData.type[0].model.clone();
		this.size = {x:0.1, y:0.3, z:0.1};
	}
	else {
		if(this.invincible) {
			this.mesh = missileData.type[2].model.clone();
			this.size = {x:0.3, y:0.3, z:0.3};
		}
		else {
			this.mesh = missileData.type[1].model.clone();
			this.size = {x:0.1, y:0.3, z:0.1};
		}
	}

	this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
	this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
	this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;

	// methods
	this.animate = function() {
		this.mesh.position.x += this.vx;
		this.mesh.position.y += this.vy;
		this.mesh.position.z += this.vz;
	};
	this.getDirection = function() {
		return new THREE.Vector3(this.vx, this.vy, this.vz);
	};
	
	this.isInvincible = function() {
		return this.invincible;
	}
	
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
}
