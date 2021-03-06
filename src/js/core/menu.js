define(["require", "exports", "../core/game", "../sound/soundservice", "../3dobject/meshservice"], function (require, exports, game_1, soundservice_1, meshservice_1) {
    "use strict";
    var Menu = (function () {
        function Menu(params) {
            this.x = typeof params.x !== 'undefined' ? params.x : 0.0;
            this.y = typeof params.y !== 'undefined' ? params.y : 0.0;
            this.z = typeof params.z !== 'undefined' ? params.z : 0.0;
            this.width = typeof params.width !== 'undefined' ? params.width : 10.0;
            this.height = typeof params.height !== 'undefined' ? params.height : 10.0;
            this.play = null;
            this.caster = new THREE.Raycaster();
            this.aliens = [];
            this.scores = [];
            this.init();
        }
        Menu.prototype.init = function () {
            soundservice_1.SoundService.getSoundByName('menu').play();
            this.play = new THREE.Mesh(new THREE.BoxGeometry(this.width / 2, this.height / 2, 1), Menu.playMaterialNotOver);
            this.play.position.set(this.x, this.y + 5, this.z);
            game_1.Game.getInstance().scene.add(this.play);
            var textPlay = meshservice_1.MeshService.createTextMesh({
                text: 'PLAY !',
                color: 'rgba(255,255,255,1)',
                font: 'Bold 50px Arial',
                width: this.width / 3,
                height: this.height / 3,
            });
            textPlay.position.set(this.x, this.y + 7, this.z - 1);
            textPlay.rotation.x = Math.PI;
            game_1.Game.getInstance().scene.add(textPlay);
            var textTitle = meshservice_1.MeshService.createTextMesh({
                text: 'SPACE INVADERS',
                color: 'rgba(255,255,255,1)',
                font: 'Bold 35px Arial',
                width: this.width * 2,
                height: this.height * 2,
            });
            textTitle.position.set(this.x, this.y - 10, this.z);
            textTitle.rotation.x = Math.PI;
            game_1.Game.getInstance().scene.add(textTitle);
            var alienMenu = meshservice_1.MeshService.getByName('menu');
            this.aliens.push(alienMenu[0]);
            this.aliens.push(alienMenu[1]);
            this.aliens.push(alienMenu[2]);
            this.aliens.push(alienMenu[3]);
            for (var i = 0; i < this.aliens.length; i++) {
                this.aliens[i].position.set(-5 + (i * 3), -9, 10.5);
                this.aliens[i].rotation.x = Math.PI;
                game_1.Game.getInstance().scene.add(this.aliens[i]);
            }
            ;
            this.scores.push(meshservice_1.MeshService.createTextMesh({
                text: '+100',
                color: 'rgba(255,255,255,1)',
                font: 'Bold 50px Arial',
                width: 3,
                height: 1,
            }));
            this.scores.push(meshservice_1.MeshService.createTextMesh({
                text: '+150',
                color: 'rgba(255,255,255,1)',
                font: 'Bold 50px Arial',
                width: 3,
                height: 1,
            }));
            this.scores.push(meshservice_1.MeshService.createTextMesh({
                text: '+200',
                color: 'rgba(255,255,255,1)',
                font: 'Bold 50px Arial',
                width: 3,
                height: 1,
            }));
            this.scores.push(meshservice_1.MeshService.createTextMesh({
                text: '+500',
                color: 'rgba(255,255,255,1)',
                font: 'Bold 50px Arial',
                width: 3,
                height: 1,
            }));
            for (var i = 0; i < this.scores.length; i++) {
                this.scores[i].position.set(-6 + (i * 3.7), -9, 11.2);
                this.scores[i].rotation.x = Math.PI + (Math.PI / 2);
                game_1.Game.getInstance().scene.add(this.scores[i]);
            }
            ;
            // set camera focus on menu
            game_1.Game.getInstance().currentCamera = 0;
            game_1.Game.getInstance().camera.rotation.x = Math.PI + Math.PI / 3;
        };
        Menu.prototype.mouseMove = function (event) {
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.caster.setFromCamera(mouse, game_1.Game.getInstance().camera);
            var intersects = this.caster.intersectObject(this.play);
            if (intersects.length > 0) {
                this.play.material = Menu.playMaterialOver;
                this.play.material.needsUpdate = true;
            }
            else {
                this.play.material = Menu.playMaterialNotOver;
                this.play.material.needsUpdate = true;
            }
        };
        Menu.prototype.mouseClick = function (event) {
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.caster.setFromCamera(mouse, game_1.Game.getInstance().camera);
            var intersects = this.caster.intersectObject(this.play);
            if (intersects.length > 0) {
                game_1.Game.getInstance().newGame();
            }
        };
        Menu.playMaterialOver = new THREE.MeshBasicMaterial({
            color: 0x2FA1D6,
            side: THREE.DoubleSide
        });
        Menu.playMaterialNotOver = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            side: THREE.DoubleSide
        });
        return Menu;
    }());
    exports.Menu = Menu;
});

//# sourceMappingURL=menu.js.map
