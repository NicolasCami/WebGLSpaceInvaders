function Menu(params) {
	// const

	// attributes
	this.x = typeof params.x !== 'undefined' ? params.x : 0.0;
	this.y = typeof params.y !== 'undefined' ? params.y : 0.0;
	this.z = typeof params.z !== 'undefined' ? params.z : 0.0;
	this.width = typeof params.width !== 'undefined' ? params.width : 10.0;
	this.height = typeof params.height !== 'undefined' ? params.height : 10.0;
	this.play = null;
	this.caster = new THREE.Raycaster();
	this.playMaterialOver = new THREE.MeshBasicMaterial({
		color:0x2FA1D6,
		side:THREE.DoubleSide
	});
	this.playMaterialNotOver = new THREE.MeshBasicMaterial({
		color:0xFF0000,
		side:THREE.DoubleSide
	});
	this.aliens = [];
	this.scores = [];

	// methods
	this.init = function() {
		soundMenu.play();
		
		this.play = new THREE.Mesh(new THREE.BoxGeometry(this.width/2, this.height/2, 1), this.playMaterialNotOver);
		this.play.position.set(this.x, this.y+5, this.z);
		scene.add(this.play);
		
		this.textPlay = textMesh({
			text:'PLAY !',
			color:'rgba(255,255,255,1)',
			font:'Bold 50px Arial',
			width: this.width/3,
			height: this.height/3,
		});
		this.textPlay.position.set(this.x, this.y+7, this.z-1);
		this.textPlay.rotation.x = Math.PI;
		scene.add(this.textPlay);
		
		this.textTitle = textMesh({
			text:'SPACE INVADERS',
			color:'rgba(255,255,255,1)',
			font:'Bold 35px Arial',
			width: this.width*2,
			height: this.height*2,
		});
		this.textTitle.position.set(this.x, this.y-10, this.z);
		this.textTitle.rotation.x = Math.PI;
		scene.add(this.textTitle);
		
		this.aliens.push(alienData.type[2].modelMenu.clone());
		this.aliens.push(alienData.type[1].modelMenu.clone());
		this.aliens.push(alienData.type[0].modelMenu.clone());
		this.aliens.push(alienData.type[3].modelMenu.clone());
		for(var i=0; i<this.aliens.length; i++) {
			this.aliens[i].position.set(-5 + (i*3), -9, 10.5);
			this.aliens[i].rotation.x = Math.PI;
			scene.add(this.aliens[i]);
		};
		
		this.scores.push(textMesh({
			text:'+100',
			color:'rgba(255,255,255,1)',
			font:'Bold 50px Arial',
			width: 3,
			height: 1,
		}));
		this.scores.push(textMesh({
			text:'+150',
			color:'rgba(255,255,255,1)',
			font:'Bold 50px Arial',
			width: 3,
			height: 1,
		}));
		this.scores.push(textMesh({
			text:'+200',
			color:'rgba(255,255,255,1)',
			font:'Bold 50px Arial',
			width: 3,
			height: 1,
		}));
		this.scores.push(textMesh({
			text:'+500',
			color:'rgba(255,255,255,1)',
			font:'Bold 50px Arial',
			width: 3,
			height: 1,
		}));
		for(var i=0; i<this.scores.length; i++) {
			this.scores[i].position.set(-6 + (i*3.7), -9, 11.2);
			this.scores[i].rotation.x = Math.PI+(Math.PI/2);
			scene.add(this.scores[i]);
		};
		
		// set camera focus on menu
		currentCamera = 0;
		camera.rotation.x = Math.PI+Math.PI/3;
	};
	this.mouseMove = function(event) {
		var mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.caster.setFromCamera( mouse, camera );
		var intersects = this.caster.intersectObject(this.play);
        if(intersects.length > 0) {
            this.play.material = this.playMaterialOver;
			this.play.material.needsUpdate = true;
        }
        else {
			this.play.material = this.playMaterialNotOver;
			this.play.material.needsUpdate = true;
		}
	};
	this.mouseClick = function(event) {
		var mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		this.caster.setFromCamera( mouse, camera );
		var intersects = this.caster.intersectObject(this.play);
        if(intersects.length > 0) {
            newGame();
        }
	};
	
}
