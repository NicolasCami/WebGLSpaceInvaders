define(["require", "exports", "../core/game", "../sound/soundservice", "../3dobject/block", "../3dobject/missile", "../3dobject/bonus", "../3dobject/aliengroup", "../3dobject/alienbonus", "../3dobject/pad", "../3dobject/explosion", "../3dobject/scoreanimation", "../control/key", "../3dobject/materialservice", "../3dobject/meshservice"], function (require, exports, game_1, soundservice_1, block_1, missile_1, bonus_1, aliengroup_1, alienbonus_1, pad_1, explosion_1, scoreanimation_1, key_1, materialservice_1, meshservice_1) {
    "use strict";
    var World = (function () {
        function World(params) {
            this.missiles = [];
            this.explosions = [];
            this.scores = [];
            this.bonus = [];
            this.alienBonus = [];
            this.missiles = [];
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
            this.alienGroup = new aliengroup_1.AlienGroup();
            this.LastFire = 0;
            this.lastAlienBonus = 0;
            this.alienBonusDelay = 2000;
            this.invincible = false;
            this.earth = new THREE.Mesh(new THREE.SphereGeometry(30, 30, 30), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('src/medias/images/earth.jpg')
            }));
            this.deathStar = new THREE.Mesh(new THREE.SphereGeometry(25, 30, 30), new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('src/medias/images/deathStar.jpg')
            }));
            this.place = new THREE.Mesh(new THREE.SphereGeometry(30, 30, 30));
            this.destructionTimer = Date.now();
            this.destructionDelay = 40000;
            this.earthDestroyed = false;
            this.init();
        }
        World.prototype.init = function () {
            this.destructionTimer = Date.now();
            this.place.position.set(this.x, this.y - 200, this.z + 0.1);
            var squareMaterial = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF,
                side: THREE.DoubleSide,
                opacity: 0.5,
                specular: 0xffffff,
                shininess: 200,
                transparent: true,
            });
            var ground = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.height, 0.1), materialservice_1.MaterialService.getSingleByName('ground'));
            ground.position.set(this.x, this.y + 2, this.z);
            ground.receiveShadow = true;
            game_1.Game.getInstance().scene.add(ground);
            var sphere = new THREE.SphereGeometry(0.2, 16, 8);
            // plots de signalisation : limite alien
            for (var i = 0; i < 8; i++) {
                var tmp = meshservice_1.MeshService.getRandomByName('alien-limit');
                tmp.position.set(this.x - (this.width / 2) + 0.5 + i * 2.7, this.y - 2, this.z + 0.2);
                game_1.Game.getInstance().scene.add(tmp);
            }
            this.deathBeamLoad = new THREE.PointLight(0x00ff00, 2, 20);
            this.deathBeamLoad.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
            this.deathBeamLoad.position.set(114, 255, -80);
            game_1.Game.getInstance().scene.add(this.deathBeamLoad);
            this.deathBeam = new THREE.PointLight(0x00ff00, 2, 20);
            this.deathBeam.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 5, 5), new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
            this.deathBeam.position.set(114, 255, -80);
            game_1.Game.getInstance().scene.add(this.deathBeam);
            this.earth.position.set(-140, 255, -80);
            this.deathStar.position.set(140, 255, -80);
            this.deathStar.rotation.x -= 49;
            this.earth.rotation.x += 1.2;
            game_1.Game.getInstance().scene.add(this.earth);
            game_1.Game.getInstance().scene.add(this.deathStar);
            this.pad = new pad_1.Pad({ min: this.x - this.width / 2.0, max: this.x + this.width / 2.0 });
            game_1.Game.getInstance().scene.add(this.pad.mesh);
        };
        World.prototype.addBlock = function (block) {
            this.blocks.push(block);
        };
        World.prototype.addAlienBonus = function () {
            var a = new alienbonus_1.AlienBonus();
            this.alienBonus.push(a);
        };
        World.prototype.randomAlienBonus = function () {
            if (this.alienBonus.length == 0) {
                if (Date.now() - this.lastAlienBonus > this.alienBonusDelay) {
                    this.addAlienBonus();
                    this.lastAlienBonus = Date.now();
                }
            }
        };
        World.prototype.buildBunker = function (x, y) {
            var size = 0.6;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < (3 - this.level); j++) {
                    var b = new block_1.Block(new THREE.Vector3(x + (size - 0.01) * i, y + (size - 0.01) * j, Math.random() * 6.0));
                    this.addBlock(b);
                }
            }
        };
        World.prototype.initLevel = function (level) {
            this.level = level;
            this.onLevelInit = true;
            this.pad.mesh.visible = true;
            this.pad.animateResetInit();
            this.clear();
            switch (this.level) {
                case 0:
                    this.alienGroup.init(5, 5, level);
                    for (var i = 0; i < this.alienGroup.getLength(); i++) {
                        this.alienGroup.get(i).mesh.position.z = Math.random() * 6.0;
                        game_1.Game.getInstance().scene.add(this.alienGroup.get(i).mesh);
                        game_1.Game.getInstance().scene.add(this.alienGroup.get(i).mesh2);
                    }
                    this.initBunkers();
                    break;
                default:
                    this.alienGroup.init(5, 5, level);
                    for (var i = 0; i < this.alienGroup.getLength(); i++) {
                        this.alienGroup.get(i).mesh.position.z = Math.random() * 6.0;
                        game_1.Game.getInstance().scene.add(this.alienGroup.get(i).mesh);
                        game_1.Game.getInstance().scene.add(this.alienGroup.get(i).mesh2);
                    }
                    this.initBunkers();
                    break;
            }
            return this.level;
        };
        World.prototype.nextLevel = function () {
            return this.initLevel(this.level + 1);
        };
        World.prototype.initBunkers = function () {
            this.buildBunker(-7.0, 1.7);
            this.buildBunker(-3.0, 1.7);
            this.buildBunker(1.0, 1.7);
            this.buildBunker(5.0, 1.7);
        };
        World.prototype.clear = function () {
            for (var j = 0; j < this.blocks.length; j++) {
                game_1.Game.getInstance().scene.remove(this.blocks[j].mesh);
            }
            this.blocks = [];
            for (var j = 0; j < this.alienGroup.aliens.length; j++) {
                game_1.Game.getInstance().scene.remove(this.alienGroup.aliens[j].mesh);
                game_1.Game.getInstance().scene.remove(this.alienGroup.aliens[j].mesh2);
            }
            this.alienGroup.aliens = [];
            for (var j = 0; j < this.alienBonus.length; j++) {
                game_1.Game.getInstance().scene.remove(this.alienBonus[j].mesh);
                game_1.Game.getInstance().scene.remove(this.alienBonus[j].mesh2);
            }
            this.alienBonus = [];
            for (var j = 0; j < this.bonus.length; j++) {
                game_1.Game.getInstance().scene.remove(this.bonus[j].mesh);
            }
            this.bonus = [];
            for (var j = 0; j < this.missiles.length; j++) {
                game_1.Game.getInstance().scene.remove(this.missiles[j].mesh);
            }
            this.missiles = [];
            for (var j = 0; j < this.explosions.length; j++) {
                game_1.Game.getInstance().scene.remove(this.explosions[j].mesh);
            }
            this.explosions = [];
            for (var j = 0; j < this.scores.length; j++) {
                game_1.Game.getInstance().scene.remove(this.scores[j].mesh);
            }
            this.scores = [];
            this.lastAlienBonus = Date.now();
            this.pad.resetPosition();
        };
        World.prototype.killThemAll = function () {
            for (var j = 0; j < this.alienGroup.getLength(); j++) {
                soundservice_1.SoundService.getSoundByName('alien-explosion').play();
                var e = new explosion_1.Explosion(1.5, 50, 0.4, 0xff0000, this.alienGroup.get(j).mesh.position.clone());
                this.explosions.push(e);
                game_1.Game.getInstance().scene.remove(this.alienGroup.get(j).mesh);
                game_1.Game.getInstance().scene.remove(this.alienGroup.get(j).mesh2);
            }
            this.alienGroup.aliens = [];
        };
        World.prototype.invinciblePad = function () {
            if (this.invincible == false)
                this.invincible = true;
            else
                this.invincible = false;
        };
        World.prototype.killPad = function () {
            var e = new explosion_1.Explosion(1.5, 100, 0.5, 0x2FA1D6, this.pad.mesh.position.clone());
            this.explosions.push(e);
        };
        World.prototype.padFire = function () {
            var m = this.pad.fire();
            if (m instanceof missile_1.Missile) {
                this.missiles.push(m);
            }
        };
        World.prototype.alienFire = function () {
            var m = this.alienGroup.fire();
            if (m instanceof missile_1.Missile) {
                this.missiles.push(m);
                game_1.Game.getInstance().scene.add(m.mesh);
                this.updateMissileLights();
            }
        };
        World.prototype.removeMissile = function (i) {
            game_1.Game.getInstance().scene.remove(this.missiles[i].mesh);
            this.missiles.splice(i, 1);
            this.updateMissileLights();
        };
        World.prototype.removeAlien = function (i) {
            game_1.Game.getInstance().scene.remove(this.alienGroup.get(i).mesh);
            game_1.Game.getInstance().scene.remove(this.alienGroup.get(i).mesh2);
            this.alienGroup.remove(i);
        };
        World.prototype.updateMissileLights = function () {
            // empty
        };
        World.prototype.animate = function () {
            var e;
            if (this.earthDestroyed == false) {
                if (Date.now() - this.destructionTimer < this.destructionDelay - 4225) {
                    this.deathBeamLoad.scale.setX(this.deathBeamLoad.scale.x + 0.01);
                    this.deathBeamLoad.scale.setY(this.deathBeamLoad.scale.y + 0.01);
                    this.deathBeamLoad.scale.setZ(this.deathBeamLoad.scale.z + 0.01);
                }
                else {
                    this.deathBeamLoad.scale.setX(this.deathBeamLoad.scale.x - 0.05);
                    this.deathBeamLoad.scale.setY(this.deathBeamLoad.scale.y - 0.05);
                    this.deathBeamLoad.scale.setZ(this.deathBeamLoad.scale.z - 0.05);
                    this.deathBeam.scale.setX(this.deathBeam.scale.x + 1);
                    this.deathBeam.position.x -= 0.4;
                }
                if (Date.now() - this.destructionTimer > this.destructionDelay) {
                    console.log("DESTROY EARTH");
                    this.earth.visible = false;
                    this.earthDestroyed = true;
                    this.deathBeamLoad.visible = false;
                    var e_1 = new explosion_1.Explosion(100, 200, 10, 0x354696, this.earth.position.clone());
                    this.explosions.push(e_1);
                }
            }
            else {
                if (Date.now() - this.destructionTimer < this.destructionDelay + 4225) {
                    this.deathBeam.scale.setX(this.deathBeam.scale.x - 1);
                    this.deathBeam.position.x -= 0.5;
                }
                else
                    this.deathBeam.visible = false;
            }
            this.earth.rotation.y += 0.001;
            if (this.onLevelInit) {
                var levelInitEnd = true;
                levelInitEnd = this.pad.animateReset();
                for (var j = 0; j < this.alienGroup.getLength(); j++) {
                    if (this.alienGroup.get(j).mesh.position.z > 0) {
                        this.alienGroup.get(j).mesh.position.z -= 0.05;
                        levelInitEnd = false;
                    }
                    else {
                        this.alienGroup.get(j).mesh.position.z = 0.0;
                    }
                }
                for (var j = 0; j < this.blocks.length; j++) {
                    if (this.blocks[j].mesh.position.z > 0) {
                        this.blocks[j].mesh.position.z -= 0.05;
                        levelInitEnd = false;
                    }
                    else {
                        this.blocks[j].mesh.position.z = 0.0;
                    }
                }
                if (levelInitEnd) {
                    this.onLevelInit = false;
                }
            }
            else {
                var missilePadTouch = false;
                // animate pad
                if (key_1.Key.getInstance().isDown(key_1.Key.keyCode.left)) {
                    this.pad.left();
                    game_1.Game.getInstance().updateCameraPad();
                }
                if (key_1.Key.getInstance().isDown(key_1.Key.keyCode.right)) {
                    this.pad.right();
                    game_1.Game.getInstance().updateCameraPad();
                }
                if (key_1.Key.getInstance().isDown(key_1.Key.keyCode.space))
                    this.padFire();
                // animate pad
                this.pad.animate();
                // animate bunkers
                for (var i = 0; i < this.blocks.length; i++) {
                    this.blocks[i].animate();
                }
                // animate aliens
                if (this.invincible == true) {
                    this.alienGroup.animate(false);
                }
                else {
                    this.alienGroup.animate(true);
                }
                // alien fire
                if ((Date.now() - this.LastFire) > 1000) {
                    this.alienFire();
                    this.LastFire = Date.now();
                }
                // alien bonus
                for (var i = 0; i < this.alienBonus.length; i++) {
                    if (this.alienBonus[i].animate() == false) {
                        game_1.Game.getInstance().scene.remove(this.alienBonus[i].mesh);
                        game_1.Game.getInstance().scene.remove(this.alienBonus[i].mesh2);
                        this.alienBonus.splice(i, 1);
                    }
                }
                // animate missiles
                for (var i = 0; i < this.missiles.length; i++) {
                    this.missiles[i].animate();
                }
                // check missile overflow
                for (var i = 0; i < this.missiles.length; i++) {
                    if (this.missiles[i].mesh.position.y > this.limitY || this.missiles[i].mesh.position.y < -3.0) {
                        // kill missile
                        game_1.Game.getInstance().scene.remove(this.missiles[i].mesh);
                        this.missiles.splice(i, 1);
                        i--;
                    }
                }
                // animate explosions
                for (var i = 0; i < this.explosions.length; i++) {
                    if (this.explosions[i].animate()) {
                        // explosion end
                        game_1.Game.getInstance().scene.remove(this.explosions[i].mesh);
                        this.explosions.splice(i, 1);
                        i--;
                        break;
                    }
                }
                // animate scores
                for (var i = 0; i < this.scores.length; i++) {
                    if (this.scores[i].animate()) {
                        // score end
                        game_1.Game.getInstance().scene.remove(this.scores[i].mesh);
                        this.scores.splice(i, 1);
                        i--;
                        break;
                    }
                }
                // animate bonus
                for (var i = 0; i < this.bonus.length; i++) {
                    if (this.bonus[i].animate()) {
                        // bonus end
                        game_1.Game.getInstance().scene.remove(this.bonus[i].mesh);
                        this.bonus.splice(i, 1);
                        i--;
                        break;
                    }
                }
                // check missile collision with aliens
                for (var i = 0; i < this.missiles.length; i++) {
                    for (var j = 0; j < this.alienGroup.getLength(); j++) {
                        if (!this.missiles[i].alien && this.alienGroup.get(j).collision(this.missiles[i])) {
                            missilePadTouch = true;
                            var alien = this.alienGroup.get(j);
                            //console.log('missile collision avec alien');
                            // explosion
                            soundservice_1.SoundService.getSoundByName('alien-explosion').play();
                            e = new explosion_1.Explosion(1.5, 50, 0.4, alien.explosionColor, alien.mesh.position.clone());
                            this.explosions.push(e);
                            // score
                            game_1.Game.getInstance().updateScore(alien.getScore());
                            var s = new scoreanimation_1.ScoreAnimation('+' + alien.getScore(), alien.mesh.position.clone());
                            this.scores.push(s);
                            // bonus
                            if (Math.random() < World.bonusRate) {
                                var b = new bonus_1.Bonus(Math.floor((Math.random() * 2) + 1), new THREE.Vector3(alien.mesh.position.x, alien.mesh.position.y, alien.mesh.position.z));
                                this.bonus.push(b);
                            }
                            // kill alien
                            this.removeAlien(j);
                            // kill missile
                            if (!this.missiles[i].isInvincible()) {
                                this.removeMissile(i);
                                i--;
                                break;
                            }
                        }
                    }
                }
                for (var i = 0; i < this.missiles.length; i++) {
                    for (var j = 0; j < this.alienBonus.length; j++) {
                        if (!this.missiles[i].alien && this.alienBonus[j].collision(this.missiles[i])) {
                            missilePadTouch = true;
                            var alien = this.alienBonus[j];
                            // explosion
                            soundservice_1.SoundService.getSoundByName('alien-explosion').play();
                            e = new explosion_1.Explosion(1.5, 50, 0.4, 0xff0000, alien.mesh.position.clone());
                            this.explosions.push(e);
                            // score
                            game_1.Game.getInstance().updateScore(alien.getScore());
                            var s = new scoreanimation_1.ScoreAnimation('+' + alien.getScore(), alien.mesh.position.clone());
                            this.scores.push(s);
                            // kill alien
                            game_1.Game.getInstance().scene.remove(alien.mesh);
                            game_1.Game.getInstance().scene.remove(alien.mesh2);
                            this.alienBonus.splice(j, 1);
                            // kill missile
                            if (!this.missiles[i].isInvincible()) {
                                this.removeMissile(i);
                                i--;
                                break;
                            }
                        }
                    }
                }
                // check collision of alien's missile with pad
                if (this.invincible == false) {
                    for (var i = 0; i < this.missiles.length; i++) {
                        if (this.missiles[i].collision(this.pad)) {
                            soundservice_1.SoundService.getSoundByName('pad-explosion').play();
                            game_1.Game.getInstance().updateLife(game_1.Game.getInstance().life - 1);
                            this.removeMissile(i);
                            this.killPad();
                            i--;
                            if (game_1.Game.getInstance().life <= 0) {
                                this.pad.mesh.visible = false;
                                setTimeout(function () {
                                    game_1.Game.getInstance().lose();
                                }.bind(this), 500);
                            }
                        }
                    }
                }
                // check if aliens have reach the player
                if (this.alienGroup.onBottom() < 4.5) {
                    game_1.Game.getInstance().lose();
                }
                // check block collision
                for (var i = 0; i < this.missiles.length; i++) {
                    for (var j = 0; j < this.blocks.length; j++) {
                        if (this.blocks[j].collision(this.missiles[i])) {
                            if (!this.missiles[i].alien) {
                                missilePadTouch = true;
                            }
                            // explosion
                            soundservice_1.SoundService.getSoundByName('block-explosion').play();
                            e = new explosion_1.Explosion(1.5, 30, 0.2, 0x22dd33, this.blocks[j].mesh.position.clone());
                            this.explosions.push(e);
                            // kill block
                            game_1.Game.getInstance().scene.remove(this.blocks[j].mesh);
                            this.blocks.splice(j, 1);
                            // kill missile
                            if (!this.missiles[i].isInvincible()) {
                                this.removeMissile(i);
                                i--;
                                break;
                            }
                        }
                    }
                }
                // check bonus collision
                for (var i = 0; i < this.bonus.length; i++) {
                    if (this.bonus[i].collision(this.pad)) {
                        soundservice_1.SoundService.getSoundByName('bonus').play();
                        // give bonus to pad
                        this.pad.addBonus(this.bonus[i]);
                        // explosion
                        e = new explosion_1.Explosion(1.5, 30, 0.2, 0x22dd33, this.pad.mesh.position.clone());
                        this.explosions.push(e);
                        // kill bonus
                        game_1.Game.getInstance().scene.remove(this.bonus[i].mesh);
                        this.bonus.splice(i, 1);
                    }
                }
                // reset fire delay if a missile touch
                if (missilePadTouch) {
                    this.pad.resetFireDelay();
                }
            }
        };
        World.prototype.getLevel = function () {
            return this.level;
        };
        World.prototype.getAliensLengh = function () {
            return this.alienGroup.getLength();
        };
        World.bonusRate = 0.1;
        return World;
    }());
    exports.World = World;
});

//# sourceMappingURL=world.js.map
