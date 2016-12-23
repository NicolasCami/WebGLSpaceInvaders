/**************************
FUNCTIONS
***************************/

function newGame() {
	newGameTransition = true;
	soundMenu.pause();
	soundClickStart.play();
}
function newGameReady() {
	soundPlaying.play();
	camera.rotation.x = Math.PI/4.0;
	newGameTransition = false;
	pause = false;
	world.initLevel(0);
	updateScore(-score);
	updateLevel();
	updateLife(3);
	$('.score').show();
	$('.life').show();
	$('.level').show();
	$('.shortcuts').show();
	if(world.invincible) {
		$('.invincible').show();
	}
}
function invincibleGUI() {
	if(world.invincible) {
		$('.invincible').show();
	}
	else {
		$('.invincible').hide();
	}
}
function nextLevel() {
	soundPlaying.play();
	world.nextLevel();
	messageOff();
	updateLevel();
}
function musicOnOff() {
	music = (music) ? false : true;
	if(music) {
		soundPlaying.resetVolume();
		soundMenu.resetVolume();
	}
	else {
		soundPlaying.audio.volume = 0;
		soundMenu.audio.volume = 0;
	}
}
function pauseOn() {
	soundPlaying.pause();
	soundClickPause.play();
	pause = true;
	$('.pause').show();
}
function pauseOff() {
	soundClickPause.play();
	if(!$('.pause').is(":hidden")) {
		soundPlaying.resume();
		pause = false;
		$('.pause').hide();
	}
}
var messageButtonAction = function() {};
function messageOn(params) {
	soundPlaying.pause();
	var title = typeof params.title !== 'undefined' ? params.title : '';
	var text = typeof params.text !== 'undefined' ? params.text : '';
	var button = typeof params.button !== 'undefined' ? params.button : null;
	pause = true;
	
	$('.message h2').html(title);
	$('.message .text').html(text);
	$('.message .button').html(button.text + ' <i class="fa fa-angle-right"></i>');
	$('.message .button').off();
	$('.message .button').click(button.click);
	$(window).unbind("keydown", messageButtonAction);
	messageButtonAction = button.click;
	$(window).bind("keydown", messageButtonAction);
	$('.message').show();
}
function messageOff() {
	soundVictory.off();
	pause = false;
	$('.message').hide();
	$(window).unbind("keydown", messageButtonAction);
	console.log('off');
}
function help() {
	var html = '';
	html += '<ul class="help">';
	html += '<li><strong>LEFT / RIGHT</strong> move</li>';
	html += '<li><strong>SPACE</strong> fire</li>';
	html += '<li><strong>ESCAPE</strong> pause</li>';
	html += '<li><strong>P</strong> screenshot</li>';
	html += '<li><strong>F</strong> fullscreen</li>';
	html += '<li><strong>M</strong> enable/disable music</li>';
	html += '<li><strong>K</strong> cheat code : kill them all</li>';
	html += '<li><strong>I</strong> cheat code : invincible</li>';
	html += '</ul>';
	messageOn({
		title:'Shortcuts',
		text:html,
		button:{
			text:'Resume',
			click:messageOff,
		},
	});
}
function lose() {
	soundPlaying.pause();
	soundLost.play();
	var html = '';
	html += '<p>You lost...</p>';
	messageOn({
		title:'Game Over',
		text:html,
		button:{
			text:'Back to title',
			click:backToMenu,
		},
	});
}
function backToMenu() {
	soundClick.play();
	soundPlaying.pause();
	soundMenu.resume();
	currentCamera = 0;
	menuTransition = true;
	messageOff();
	world.clear();
	$('.score').hide();
	$('.life').hide();
	$('.level').hide();
	$('.shortcuts').hide();
	$('.invincible').hide();
}
function menuReady() {
	camera.rotation.x = Math.PI+Math.PI/3;
	menuTransition = false;
	pause = true;
}
function updateCameraPad() {
	cameraPad.position.x = world.pad.mesh.position.x;
}
function updateScore(n) {
	score += n;
	$('.scorePoints').html(score);
}
function updateLevel() {
	$('.levelNo').html(world.getLevel());
}
function updateLife(n) {
	life = n;
	var htmlString = '';
	for(var i=0; i<life; i++) {
		htmlString += '<i class="fa fa-rocket"></i> ';
	}
	$('.life').html(htmlString);
}
function boxCollision(a, b) {
	return (a.maxX() >= b.minX() && a.minX() <= b.maxX())
		&& (a.maxY() >= b.minY() && a.minY() <= b.maxY())
		&& (a.maxZ() >= b.minZ() && a.minZ() <= b.maxZ());
}
function loadModel(params) {
	var filePath = typeof params.filePath !== 'undefined' ? params.filePath : '';
	var encoding = typeof params.encoding !== 'undefined' ? params.encoding : 'UTF-8';
	var content = typeof params.content !== 'undefined' ? params.content : '';
	var charEmpty = typeof params.charEmpty !== 'undefined' ? params.charEmpty : ' ';
	var charFull = typeof params.charFull !== 'undefined' ? params.charFull : '*';
	var separatorY = typeof params.separatorY !== 'undefined' ? params.separatorY : ',';
	var separatorZ = typeof params.separatorZ !== 'undefined' ? params.separatorZ : '/';
	var blockSize = typeof params.blockSize !== 'undefined' ? params.blockSize : 0.1;
	var modelSize = typeof params.modelSize !== 'undefined' ? params.modelSize : {x:1.2,y:1.2,z:0.2};
	var material = typeof params.material !== 'undefined' ? params.material : padMaterials;
	var geometry = typeof params.geometry !== 'undefined' ? params.geometry : modelBlockGeometry;
	var axe = typeof params.axe !== 'undefined' ? params.axe : 'z';
	
	var group = new THREE.Geometry();
	//var materials = [];
	var x = -modelSize.x/2.0;
	var y = -modelSize.y/2.0;
	var z = -modelSize.z/2.0;
	switch(axe) {
		case 'y':
			for(i=0; i<content.length; i++) {
				if(content.charAt(i) == charFull) {
					var m = new THREE.Mesh(geometry);
					m.position.x = x;
					m.position.y = y;
					m.position.z = z;
					m.updateMatrix();
					group.merge( m.geometry, m.matrix );
				}
				x += blockSize;
				if(content.charAt(i) == separatorY) {
					x = -modelSize.x/2.0;
					z += blockSize;
				}
				else if(content.charAt(i) == separatorZ) {
					x = -modelSize.x/2.0;
					z = -modelSize.z/2.0;
					y += blockSize;
				}
			}
			var mesh =  new THREE.Mesh(group, material[Math.floor((Math.random()*material.length))]);
			mesh.castShadow = true;
			return mesh;
			break;
			
		case 'z':
			for(i=0; i<content.length; i++) {
				if(content.charAt(i) == charFull) {
					/*for ( var j = 0; j < padBlockGeometry.faces.length; j ++ ) {
						padBlockGeometry.faces[ j ].materialIndex = i;
					}*/
					var m = new THREE.Mesh(geometry);
					m.position.x = x;
					m.position.y = y;
					m.position.z = z;
					m.updateMatrix();
					//THREE.GeometryUtils.setMaterialIndex(m.geometry, i);
					/*for ( var j = 0; j < m.geometry.faces.length; j ++ ) {
						m.geometry.faces[ j ].materialIndex = i;
					}*/
					group.merge( m.geometry, m.matrix );
					//materials.push(blockMaterials[Math.floor((Math.random()*blockMaterials.length))]);
				}
				x += blockSize;
				if(content.charAt(i) == separatorY) {
					x = -modelSize.x/2.0;
					y += blockSize;
				}
				else if(content.charAt(i) == separatorZ) {
					x = -modelSize.x/2.0;
					y = -modelSize.y/2.0;
					z += blockSize;
				}
			}
			//var mesh = new THREE.Mesh( group, new THREE.MeshFaceMaterial(materials));
			var mesh = new THREE.Mesh(group, material[Math.floor((Math.random()*material.length))]);
			mesh.castShadow = true;
			/*mesh.geometry.computeFaceNormals();
			mesh.geometry.computeVertexNormals();*/
			return mesh;
			break;
	}
	
	return group;
}
function textMesh(params) {
	var width = typeof params.width !== 'undefined' ? params.width : 10;
	var height = typeof params.height !== 'undefined' ? params.height : 10;
	var font = typeof params.font !== 'undefined' ? params.font : "Bold 20px Arial";
	var align = typeof params.align !== 'undefined' ? params.align : 'center';
	var color = typeof params.color !== 'undefined' ? params.color : 'rgba(255,0,0,1)';
	var text = typeof params.text !== 'undefined' ? params.text : "";
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	
	context.font = font;
	context.fillStyle = color;
	context.textAlign = align;
	context.fillText(text, canvas.width/2, canvas.height/2);

	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var mesh = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(width, height),
		new THREE.MeshBasicMaterial( { map: texture, transparent:true, depthWrite: false, depthTest: false } )
	);
	
	return mesh;
}
function initStats() {

	var stats = new Stats();

	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	$("#Stats-output").append( stats.domElement );

	return stats;
}

function randFromArray(a) {
	return a[Math.floor((Math.random()*a.length))];
};
