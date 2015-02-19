function World(params) {
	// attributes
	this.missiles = [];
	this.lights = [];
	this.blocks = [];
	this.explosions = [];
	this.scores = [];
	this.bonus = [];
	this.alienBonus = [];
	this.caster = new THREE.Raycaster();
	this.x = typeof params.x !== 'undefined' ? params.x : 0.0;
	this.y = typeof params.y !== 'undefined' ? params.y : 0.0;
	this.z = typeof params.z !== 'undefined' ? params.z : 0.0;
	this.width = typeof params.width !== 'undefined' ? params.width : 10.0;
	this.height = typeof params.height !== 'undefined' ? params.height : 10.0;
	this.limitY = this.height;
	this.level = 0;
	this.onLevelInit = false;
	this.AlienGroup = new AlienGroup();
	this.LastFire = 0;
	this.lastAlienBonus = 0;
	this.alienBonusDelay = 2000;
	this.invincible = false;
	this.earth = earthMesh;
	this.deathStar = deathStarMesh;
	this.place = new THREE.Mesh(new THREE.SphereGeometry(30,30,30));
	this.destructionTimer = Date.now();
	this.destructionDelay = 40000;
	this.earthDestroyed = false;

	// methods
	this.init = function() {
		this.destructionTimer = Date.now();

		this.place.position.set(this.x, this.y-200, this.z+0.1);
		var squareMaterial = new THREE.MeshBasicMaterial({
			color:0xFFFFFF,
			side:THREE.DoubleSide,
			opacity:0.5,
			specular: 0xffffff,
			shininess: 200,
			transparent:true,
		});

		var ground = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.height, 0.1), groundMaterial);
		ground.position.set(this.x, this.y+2, this.z);
		ground.receiveShadow = true;
		scene.add(ground);

		/*var limit = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, 0.1), new THREE.MeshBasicMaterial({
			color:0xff0000,
			side:THREE.DoubleSide,
		}));
		limit.position.set(this.x, this.y-2, this.z+0.1);*/
		var sphere = new THREE.SphereGeometry( 0.2, 16, 8 );
		
		// plots de signalisation : limite alien
		for(var i=0; i<8; i++) {
			var tmp = worldData.limit.clone();
			tmp.position.set(this.x-(this.width/2)+0.5 + i*2.7, this.y-2, this.z+0.2);
			scene.add(tmp);
		}
		
		missileLight1.position.copy(this.place);
		missileLight2.position.copy(this.place)
		missileLight3.position.copy(this.place)
		missileLight4.position.copy(this.place)
		/*scene.add(missileLight1);
		scene.add(missileLight2);
		scene.add(missileLight3);
		scene.add(missileLight4);*/
		this.lights.push(missileLight1);
		this.lights.push(missileLight2);
		this.lights.push(missileLight3);
		this.lights.push(missileLight4);

		this.deathBeamLoad = new THREE.PointLight( 0x00ff00, 2, 20 );
		this.deathBeamLoad.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) ) );
		this.deathBeamLoad.position.set(114, 255, -80);
		scene.add( this.deathBeamLoad );
		this.deathBeam = new THREE.PointLight( 0x00ff00, 2, 20 );
		this.deathBeam.add( new THREE.Mesh(new THREE.PlaneGeometry( 1, 5, 5 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } )) );
		this.deathBeam.position.set(114, 255, -80);
		scene.add( this.deathBeam );

		/*this.earthDestroyed = false;
		this.deathBeam.visible = true;
		this.deathBeamLoad.visible = true;
		this.earth.visible = true;*/
		this.earth.position.set(-140, 255, -80);
		this.deathStar.position.set(140, 255, -80);
		this.deathStar.rotation.x -= 49;
		this.earth.rotation.x += 1.2;

		scene.add(this.earth);
		scene.add(this.deathStar);

		this.pad = new Pad({
			minx : this.x-this.width/2.0,
			maxx : this.x+this.width/2.0,
			x : 0.0,
			y : 0.0,
			z : 0.0,
		});
		scene.add(this.pad.mesh);
	};
	this.addBlock = function(block) {
		this.blocks.push(block);
	};
	this.addAlienBonus = function() {
		var a = new AlienBonus({
			missileVelocity : -0.1,
		})
		this.alienBonus.push(a);
		scene.add(a.mesh);
		scene.add(a.mesh2);
	};
	this.randomAlienBonus = function() {
		if(this.alienBonus.length == 0) {
			if(Date.now()-this.lastAlienBonus > this.alienBonusDelay) {
				this.addAlienBonus();
				this.lastAlienBonus = Date.now();
			}
		}
	};
	this.buildBunker = function(x,y) {
		var size = 0.6;
		for(var i=0; i<4; i++) {
			for(var j=0; j<(3-this.level); j++) {
				var b = new Block({
					x : x+(size-0.01)*i,
					y : y+(size-0.01)*j,
					z : Math.random()*6.0,
				});
				this.addBlock(b);
				scene.add(b.mesh);
			}
		}
	};
	this.initLevel = function(level) {
		this.level = level;
		this.onLevelInit = true;
		this.pad.mesh.visible = true;
		this.pad.animateResetInit();
		this.clear();
		
		switch(this.level) {
			
			case 0:
				this.AlienGroup.init(5,5,level);
				for(var i= 0; i < this.AlienGroup.getLength(); i++) {
					this.AlienGroup.get(i).mesh.position.z = Math.random()*6.0;
					scene.add(this.AlienGroup.get(i).mesh);
					scene.add(this.AlienGroup.get(i).mesh2);
				}

				this.initBunkers();
				break;
				
			default:
				this.AlienGroup.init(5,5,level);
				for(var i= 0; i < this.AlienGroup.getLength(); i++) {
					this.AlienGroup.get(i).mesh.position.z = Math.random()*6.0;
					scene.add(this.AlienGroup.get(i).mesh);
					scene.add(this.AlienGroup.get(i).mesh2);
				}

				this.initBunkers();
				break;
		}
		
		return this.level;
	};
	this.nextLevel = function() {
		return this.initLevel(this.level+1);
	};
	this.initBunkers = function() {
		this.buildBunker(-7.0, 1.7);
		this.buildBunker(-3.0, 1.7);
		this.buildBunker(1.0, 1.7);
		this.buildBunker(5.0, 1.7);
	}
	this.clear = function() {
		for(var j= 0; j < this.blocks.length; j++) {
			scene.remove(this.blocks[j].mesh);
		}
		this.blocks = [];
		
		for(var j= 0; j < this.AlienGroup.aliens.length; j++) {
			scene.remove(this.AlienGroup.aliens[j].mesh);
			scene.remove(this.AlienGroup.aliens[j].mesh2);
		}
		this.AlienGroup.aliens = [];
		
		for(var j= 0; j < this.alienBonus.length; j++) {
			scene.remove(this.alienBonus[j].mesh);
			scene.remove(this.alienBonus[j].mesh2);
		}
		this.alienBonus = [];
		
		for(var j= 0; j < this.bonus.length; j++) {
			scene.remove(this.bonus[j].mesh);
		}
		this.bonus = [];
		
		for(var j= 0; j < this.missiles.length; j++) {
			scene.remove(this.missiles[j].mesh);
		}
		this.missiles = [];
		
		for(var j= 0; j < this.explosions.length; j++) {
			scene.remove(this.explosions[j].mesh);
		}
		this.explosions = [];
		
		for(var j= 0; j < this.scores.length; j++) {
			scene.remove(this.scores[j].mesh);
		}
		this.scores = [];
		
		this.lastAlienBonus = Date.now();
		this.pad.resetPosition();
	}
	this.killThemAll = function() {
		for(var j= 0; j < this.AlienGroup.getLength(); j++) {
			soundAlienExplosion.play();
			var e = new Explosion({
				x : this.AlienGroup.get(j).mesh.position.x,
				y : this.AlienGroup.get(j).mesh.position.y,
				z : this.AlienGroup.get(j).mesh.position.z,
				size : 1.5,
				particleNb : 50,
				particleSize : 0.4,
				particleColor : 0xff0000,
			});
			this.explosions.push(e);
			scene.remove(this.AlienGroup.get(j).mesh);
			scene.remove(this.AlienGroup.get(j).mesh2);
		}
		this.AlienGroup.aliens = [];
	};
	this.invinciblePad = function() {
		if(this.invincible == false)
			this.invincible = true;
		else
			this.invincible = false;
	};
	this.killPad = function() {
		var e = new Explosion({
			x : this.pad.mesh.position.x,
			y : this.pad.mesh.position.y,
			z : this.pad.mesh.position.z,
			size : 1.5,
			particleNb : 100,
			particleSize : 0.5,
			particleColor : 0x2FA1D6,
		});
		this.explosions.push(e);
	};
	this.padFire = function() {
		//console.log('pad fire');
		var m = this.pad.fire();
		if(m) {
			this.missiles.push(m);
			scene.add(m.mesh);
		}
	};
	this.alienFire = function() {
		//console.log('alien fire');
		var AlienGroupSize = this.AlienGroup.getLength();

		if (AlienGroupSize>0){ 
			var m = this.AlienGroup.fire(AlienGroupSize);
			if(m) {
				this.missiles.push(m);
				scene.add(m.mesh);
				this.updateMissileLights();
			}
		}
	};
	this.removeMissile = function(i) {
		scene.remove(this.missiles[i].mesh);
		this.missiles.splice(i, 1);
		this.updateMissileLights();
	};
	this.removeAlien = function(i) {
		scene.remove(this.AlienGroup.get(i).mesh);
		scene.remove(this.AlienGroup.get(i).mesh2);
		this.AlienGroup.remove(i);
	};
	this.updateMissileLights = function() {
		/*console.log('update lights');
		// remove lights
		for(var i=0; i<this.lights.length; i++) {
			scene.remove(this.lights[i]);
		}
		// add lights
		for(var i=0; i<this.missiles.length && i<this.lights.length; i++) {
			this.lights[i].color.copy(new THREE.Color(0xff0000));
			this.lights[i].position.copy(this.missiles[i].mesh.position);
			scene.add(this.lights[i]);
			console.log(this.lights[i]);
		}*/
	};
	this.animate = function() {
		if (this.earthDestroyed == false)
		{
			if (Date.now() - this.destructionTimer < this.destructionDelay-4225)
			{
				
				this.deathBeamLoad.scale.setX (this.deathBeamLoad.scale.x + 0.01);
				this.deathBeamLoad.scale.setY (this.deathBeamLoad.scale.y + 0.01);
				this.deathBeamLoad.scale.setZ (this.deathBeamLoad.scale.z + 0.01);
			}else{
				this.deathBeamLoad.scale.setX (this.deathBeamLoad.scale.x - 0.05);
				this.deathBeamLoad.scale.setY (this.deathBeamLoad.scale.y - 0.05);
				this.deathBeamLoad.scale.setZ (this.deathBeamLoad.scale.z - 0.05);
				this.deathBeam.scale.setX (this.deathBeam.scale.x + 1);
				this.deathBeam.position.x-= 0.4;
			}
			
			if (Date.now() - this.destructionTimer > this.destructionDelay)
			{
				console.log("DESTROY EARTH");
				this.earth.visible= false;
				this.earthDestroyed = true;
				this.deathBeamLoad.visible = false;
				var e = new Explosion({
					x : this.earth.position.x,
					y : this.earth.position.y,
					z : this.earth.position.z,
					size : 100,
					particleNb : 200,
					particleSize : 10,
					particleColor : 0x354696,
				});
				this.explosions.push(e);
			}
		}else{
			if (Date.now() - this.destructionTimer < this.destructionDelay+4225)
			{this.deathBeam.scale.setX (this.deathBeam.scale.x - 1);
			this.deathBeam.position.x-= 0.5;}
			else this.deathBeam.visible = false;
		}
		this.earth.rotation.y += 0.001;
		
		if(this.onLevelInit) {
			var levelInitEnd = true;
			levelInitEnd = this.pad.animateReset();
			for(var j= 0; j < this.AlienGroup.getLength(); j++) {
				if(this.AlienGroup.get(j).mesh.position.z > 0) {
					this.AlienGroup.get(j).mesh.position.z -= 0.05;
					levelInitEnd = false;
				}
				else {
					this.AlienGroup.get(j).mesh.position.z = 0.0;
				}
			}
			for(var j= 0; j < this.blocks.length; j++) {
				if(this.blocks[j].mesh.position.z > 0) {
					this.blocks[j].mesh.position.z -= 0.05;
					levelInitEnd = false;
				}
				else {
					this.blocks[j].mesh.position.z = 0.0;
				}
			}
			if(levelInitEnd) {
				this.onLevelInit = false;
			}
		}
		else {
			var missilePadTouch = false;
			
			// animate pad
			if(Key.isDown(Key.LEFT)) {
				this.pad.left();
				updateCameraPad();
			}
			if(Key.isDown(Key.RIGHT)) {
				this.pad.right();
				updateCameraPad();
			}
			if(Key.isDown(Key.SPACE)) this.padFire();
			
			// animate pad
			this.pad.animate();
			
			// animate bunkers
			for(var i= 0; i < this.blocks.length; i++) {
				 this.blocks[i].animate();
			}
			
			// animate aliens
			if(this.invincible == true) {
				this.AlienGroup.animate(false);
			}
			else {
				this.AlienGroup.animate(true);
			}
			
			// alien fire
			if((Date.now() - this.LastFire) > 1000){    
				this.alienFire();
				this.LastFire = Date.now();
			}
			
			// alien bonus
			for(var i= 0; i < this.alienBonus.length; i++) {
				 if(this.alienBonus[i].animate() == false) {
					scene.remove(this.alienBonus[i].mesh);
					scene.remove(this.alienBonus[i].mesh2);
					this.alienBonus.splice(i, 1);
				 }
			}
			
			// animate missiles
			for(var i=0; i < this.missiles.length; i++) {
				 this.missiles[i].animate();
			}

			// missile lights
			/*for(var i=0; i<this.missiles.length; i++) {
				if(i < this.lights.length)
					this.lights[i].position.copy(this.missiles[i].mesh.position);
			}*/
			/*if (this.missiles.length > 0 && this.missiles.length < 2)
			{
				if(this.missiles[0].alien == true) missileLight1.color.copy(new THREE.Color(0xff0000));
				else missileLight1.color.copy(new THREE.Color(0x00ff00));
				missileLight1.position.copy(this.missiles[0].mesh.position);
				missileLight2.position.copy(this.place.position) ; missileLight3.position.copy(this.place.position) ; missileLight4.position.copy(this.place.position);
			}
			else if (this.missiles.length > 1 && this.missiles.length < 3)
			{
				if(this.missiles[0].alien == true) missileLight1.color.copy(new THREE.Color(0xff0000));
				else missileLight1.color.copy(new THREE.Color(0x00ff00));
				missileLight1.position.copy(this.missiles[0].mesh.position);
				if(this.missiles[1].alien == true) missileLight2.color.copy(new THREE.Color(0xff0000));
				else missileLight2.color.copy(new THREE.Color(0x00ff00));
				missileLight2.position.copy(this.missiles[1].mesh.position);
				missileLight3.position.copy(this.place.position) ; missileLight4.position.copy(this.place.position);
			}
			else if (this.missiles.length > 2 && this.missiles.length < 4)
			{
				if(this.missiles[0].alien == true) missileLight1.color.copy(new THREE.Color(0xff0000));
				else missileLight1.color.copy(new THREE.Color(0x00ff00));
				missileLight1.position.copy(this.missiles[0].mesh.position);
				if(this.missiles[1].alien == true) missileLight2.color.copy(new THREE.Color(0xff0000));
				else missileLight2.color.copy(new THREE.Color(0x00ff00));
				missileLight2.position.copy(this.missiles[1].mesh.position);
				if(this.missiles[2].alien == true) missileLight3.color.copy(new THREE.Color(0xff0000));
				else missileLight3.color.copy(new THREE.Color(0x00ff00));
				missileLight3.position.copy(this.missiles[2].mesh.position);
				missileLight4.position.copy(this.place.position);
			}
			else if (this.missiles.length > 3 && this.missiles.length < 5)
			{
				if(this.missiles[0].alien == true) missileLight1.color.copy(new THREE.Color(0xff0000));
				else missileLight1.color.copy(new THREE.Color(0x00ff00));
				missileLight1.position.copy(this.missiles[0].mesh.position);
				if(this.missiles[1].alien == true) missileLight2.color.copy(new THREE.Color(0xff0000));
				else missileLight2.color.copy(new THREE.Color(0x00ff00));
				missileLight2.position.copy(this.missiles[1].mesh.position);
				if(this.missiles[2].alien == true) missileLight3.color.copy(new THREE.Color(0xff0000));
				else missileLight3.color.copy(new THREE.Color(0x00ff00));
				if(this.missiles[3].alien == true) missileLight4.color.copy(new THREE.Color(0xff0000));
				else missileLight4.color.copy(new THREE.Color(0x00ff00));
				missileLight4.position.copy(this.missiles[3].mesh.position);
			}*/
			
			// check missile overflow
			for(var i= 0; i < this.missiles.length; i++) {
				 if(this.missiles[i].mesh.position.y > this.limitY || this.missiles[i].mesh.position.y < -3.0) {
					// kill missile
					scene.remove(this.missiles[i].mesh);
					this.missiles.splice(i, 1);
					i--;
				 }
			}
			
			// animate explosions
			for(var i= 0; i < this.explosions.length; i++) {
				 if(this.explosions[i].animate()) {
					// explosion end
					scene.remove(this.explosions[i].mesh);
					this.explosions.splice(i, 1);
					i--;
					break;
				 }
			}
			
			// animate scores
			for(var i= 0; i < this.scores.length; i++) {
				 if(this.scores[i].animate()) {
					// score end
					scene.remove(this.scores[i].mesh);
					this.scores.splice(i, 1);
					i--;
					break;
				 }
			}
			
			// animate bonus
			for(var i= 0; i < this.bonus.length; i++) {
				 if(this.bonus[i].animate()) {
					// bonus end
					scene.remove(this.bonus[i].mesh);
					this.bonus.splice(i, 1);
					i--;
					break;
				 }
			}
			
			// check missile collision with aliens
			for(var i= 0; i < this.missiles.length; i++) {
				for(var j= 0; j < this.AlienGroup.getLength(); j++) {
					if(!this.missiles[i].alien && boxCollision(this.AlienGroup.get(j),this.missiles[i])) {
						missilePadTouch = true;
						var alien = this.AlienGroup.get(j);
						//console.log('missile collision avec alien');
						// explosion
						soundAlienExplosion.play();
						var e = new Explosion({
							x : alien.mesh.position.x,
							y : alien.mesh.position.y,
							z : alien.mesh.position.z,
							size : 1.5,
							particleNb : 50,
							particleSize : 0.4,
							particleColor : alien.explosionColor,
						});
						this.explosions.push(e);
						// score
						updateScore(alien.getScore());
						var e = new ScoreAnimation({
							x : alien.mesh.position.x,
							y : alien.mesh.position.y,
							z : alien.mesh.position.z,
							text : '+' + alien.getScore(),
						});
						this.scores.push(e);
						// bonus
						if(Math.random() < BONUS_RATE) {
							var b = new Bonus({
								x : alien.mesh.position.x,
								y : alien.mesh.position.y,
								z : alien.mesh.position.z,
								type : Math.floor((Math.random()*2)+1),
							});
							this.bonus.push(b);
						}
						// kill alien
						this.removeAlien(j);
						// kill missile
						if(!this.missiles[i].isInvincible()) {
							this.removeMissile(i);
							i--;
							break;
						}
					}
				}
			}
			for(var i= 0; i < this.missiles.length; i++) {
				for(var j= 0; j < this.alienBonus.length; j++) {
					if(!this.missiles[i].alien && boxCollision(this.alienBonus[j],this.missiles[i])) {
						missilePadTouch = true;
						var alien = this.alienBonus[j];
						// explosion
						soundAlienExplosion.play();
						var e = new Explosion({
							x : alien.mesh.position.x,
							y : alien.mesh.position.y,
							z : alien.mesh.position.z,
							size : 1.5,
							particleNb : 50,
							particleSize : 0.4,
							particleColor : 0xff0000,
						});
						this.explosions.push(e);
						// score
						updateScore(alien.getScore());
						var e = new ScoreAnimation({
							x : alien.mesh.position.x,
							y : alien.mesh.position.y,
							z : alien.mesh.position.z,
							text : '+' + alien.getScore(),
						});
						this.scores.push(e);
						// kill alien
						scene.remove(alien.mesh);
						scene.remove(alien.mesh2);
						this.alienBonus.splice(j, 1);
						// kill missile
						if(!this.missiles[i].isInvincible()) {
							this.removeMissile(i);
							i--;
							break;
						}
					}
				}
			}
			
			// check collision of alien's missile with pad
			if(this.invincible == false) {
				for(var i= 0; i < this.missiles.length; i++) {
					if(boxCollision(this.missiles[i],this.pad)) {
						soundPadExplosion.play();
						updateLife(life-1);
						this.removeMissile(i);
						this.killPad();
						i--;
						if(life <= 0) {
							this.pad.mesh.visible = false;
							setTimeout(function () {
								lose();    
							}, 500);
						}
					}
				}
			}
			
			// check if aliens have reach the player
			if(this.AlienGroup.onBottom() > 0 && this.AlienGroup.onBottom() < 4.5) {
				lose();
			}

			// check block collision
			for(var i= 0; i < this.missiles.length; i++) {
				for(var j= 0; j < this.blocks.length; j++) {
					if(boxCollision(this.blocks[j],this.missiles[i])) {
						if(!this.missiles[i].alien) {
							missilePadTouch = true;
						}
						// explosion
						soundBlockExplosion.play();
						var e = new Explosion({
							x : this.blocks[j].mesh.position.x,
							y : this.blocks[j].mesh.position.y,
							z : this.blocks[j].mesh.position.z,
							size : 1.5,
							particleNb : 30,
							particleSize : 0.2,
							particleColor : 0x22dd33,
						});
						this.explosions.push(e);
						// kill block
						scene.remove(this.blocks[j].mesh);
						this.blocks.splice(j, 1);
						// kill missile
						if(!this.missiles[i].isInvincible()) {
							this.removeMissile(i);
							i--;
							break;
						}
					}
				}
			}
			
			// check bonus collision
			for(var i= 0; i < this.bonus.length; i++) {
				if(boxCollision(this.bonus[i],this.pad)) {
					soundBonus.play();
					// give bonus to pad
					this.pad.addBonus(this.bonus[i]);
					// explosion
					var e = new Explosion({
						x : this.pad.mesh.position.x,
						y : this.pad.mesh.position.y,
						z : this.pad.mesh.position.z,
						size : 1.5,
						particleNb : 30,
						particleSize : 0.2,
						particleColor : 0x22dd33,
					});
					this.explosions.push(e);
					// kill bonus
					scene.remove(this.bonus[i].mesh);
					this.bonus.splice(i, 1);
				}
			}
			
			// reset fire delay if a missile touch
			if(missilePadTouch) {
				this.pad.resetFireDelay();
			}
		}
	};
	
	this.getLevel = function() {
		return this.level;
	};
	this.getAliensLengh = function() {
		return this.AlienGroup.getLength();
	};
}
