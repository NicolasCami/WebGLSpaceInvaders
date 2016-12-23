function ScoreAnimation(params) {
	// const
	this.INCREMENT = 0.05;
	this.LIFE_TIME = 2000.0;

	// attributes
	this.time = Date.now();
	this.vx = typeof params.vx !== 'undefined' ? params.vx : 0.0;
	this.vy = typeof params.vy !== 'undefined' ? params.vy : 0.0;
	this.vz = typeof params.vz !== 'undefined' ? params.vz : this.INCREMENT;
	this.text = typeof params.text !== 'undefined' ? params.text : '';
	this.width = typeof params.width !== 'undefined' ? params.width : 5;
	
	if(this.text in textData) {
		this.mesh = textData[this.text].clone();
	}
	else {
		textData[this.text] = textMesh({
			text:this.text,
			color:'rgba(255,255,255,1)',
			font:'Bold 50px Arial',
			width: this.width,
			height: 3,
		});
		this.mesh = textData[this.text].clone();
	}
	
	this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
	this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
	this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;
	this.mesh.rotation.x = Math.PI / 2;
	scene.add(this.mesh);

	// methods
	this.animate = function() {
		this.mesh.position.x += this.vx;
		this.mesh.position.y += this.vy;
		this.mesh.position.z += this.vz;
		
		if(this.time+this.LIFE_TIME < Date.now()) {
			return true;
		}
		return false;
	};
	this.getDirection = function() {
		return new THREE.Vector3(this.vx, this.vy, this.vz);
	};
}