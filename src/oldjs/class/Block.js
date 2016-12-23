function Block(params) {
	// const

	// attributes
	var mesh = randFromArray(blockData.model).clone();
	mesh.castShadow = true;
	this.mesh = mesh;
	this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
	this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
	this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;
	this.size = typeof params.size !== 'undefined' ? params.size : {x:0.6, y:0.6, z:1.0};
	this.velocity = typeof params.velocity !== 'undefined' ? params.velocity : 0.001 + (Math.random()*0.005) ;
	this.orientation = (Math.floor((Math.random()*2)) > 0) ? -1 : 1;
	this.moveLimit = 0.2;

	// methods
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
	
	this.animate = function() {
		this.mesh.position.z += this.orientation * this.velocity;
		
		if(this.mesh.position.z > this.moveLimit) {
			this.mesh.position.z = this.moveLimit;
			this.orientation = -1;
		}
		else if(this.mesh.position.z < -this.moveLimit) {
			this.mesh.position.z = -this.moveLimit;
			this.orientation = 1;
		}
	};
}
