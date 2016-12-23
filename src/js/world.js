var World = (function () {
    function World(params, game) {
        this.missiles = [];
        this.lights = [];
        this.explosions = [];
        this.scores = [];
        this.bonus = [];
        this.alienBonus = [];
        this.destructionTimer = Date.now();
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
        this.AlienGroup = new AlienGroup(game);
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
        this.game = game;
        this.init();
    }
    World.prototype.init = function () {
        this.destructionTimer = Date.now();
        this.place.position.set(this.x, this.y - 200, this.z + 0.1);
        var squareMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            opacity: 0.5,
            specular: 0xffffff,
            shininess: 200,
            transparent: true,
        });
        var ground = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.height, 0.1), groundMaterial);
        ground.position.set(this.x, this.y + 2, this.z);
        ground.receiveShadow = true;
        this.game.scene.add(ground);
        var sphere = new THREE.SphereGeometry(0.2, 16, 8);
        // plots de signalisation : limite alien
        for (var i = 0; i < 8; i++) {
            var tmp = worldData.limit.clone();
            tmp.position.set(this.x - (this.width / 2) + 0.5 + i * 2.7, this.y - 2, this.z + 0.2);
            this.game.scene.add(tmp);
        }
        missileLight1.position.copy(this.place.position);
        missileLight2.position.copy(this.place.position);
        missileLight3.position.copy(this.place.position);
        missileLight4.position.copy(this.place.position);
        this.lights.push(missileLight1);
        this.lights.push(missileLight2);
        this.lights.push(missileLight3);
        this.lights.push(missileLight4);
        this.deathBeamLoad = new THREE.PointLight(0x00ff00, 2, 20);
        this.deathBeamLoad.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
        this.deathBeamLoad.position.set(114, 255, -80);
        this.game.scene.add(this.deathBeamLoad);
        this.deathBeam = new THREE.PointLight(0x00ff00, 2, 20);
        this.deathBeam.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 5, 5), new THREE.MeshBasicMaterial({ color: 0x00ff00 })));
        this.deathBeam.position.set(114, 255, -80);
        this.game.scene.add(this.deathBeam);
        this.earth.position.set(-140, 255, -80);
        this.deathStar.position.set(140, 255, -80);
        this.deathStar.rotation.x -= 49;
        this.earth.rotation.x += 1.2;
        this.game.scene.add(this.earth);
        this.game.scene.add(this.deathStar);
        this.pad = new Pad({
            minx: this.x - this.width / 2.0,
            maxx: this.x + this.width / 2.0,
            x: 0.0,
            y: 0.0,
            z: 0.0,
        }, this.game);
        this.game.scene.add(this.pad.mesh);
    };
    World.prototype.addBlock = function (block) {
        this.blocks.push(block);
    };
    World.prototype.addAlienBonus = function () {
        var a = new AlienBonus({
            missileVelocity: -0.1,
        }, this.game);
        this.alienBonus.push(a);
        this.game.scene.add(a.mesh);
        this.game.scene.add(a.mesh2);
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
                var b = new Block({
                    x: x + (size - 0.01) * i,
                    y: y + (size - 0.01) * j,
                    z: Math.random() * 6.0,
                });
                this.addBlock(b);
                this.game.scene.add(b.mesh);
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
                this.AlienGroup.init(5, 5, level);
                for (var i = 0; i < this.AlienGroup.getLength(); i++) {
                    this.AlienGroup.get(i).mesh.position.z = Math.random() * 6.0;
                    this.game.scene.add(this.AlienGroup.get(i).mesh);
                    this.game.scene.add(this.AlienGroup.get(i).mesh2);
                }
                this.initBunkers();
                break;
            default:
                this.AlienGroup.init(5, 5, level);
                for (var i = 0; i < this.AlienGroup.getLength(); i++) {
                    this.AlienGroup.get(i).mesh.position.z = Math.random() * 6.0;
                    this.game.scene.add(this.AlienGroup.get(i).mesh);
                    this.game.scene.add(this.AlienGroup.get(i).mesh2);
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
            this.game.scene.remove(this.blocks[j].mesh);
        }
        this.blocks = [];
        for (var j = 0; j < this.AlienGroup.aliens.length; j++) {
            this.game.scene.remove(this.AlienGroup.aliens[j].mesh);
            this.game.scene.remove(this.AlienGroup.aliens[j].mesh2);
        }
        this.AlienGroup.aliens = [];
        for (var j = 0; j < this.alienBonus.length; j++) {
            this.game.scene.remove(this.alienBonus[j].mesh);
            this.game.scene.remove(this.alienBonus[j].mesh2);
        }
        this.alienBonus = [];
        for (var j = 0; j < this.bonus.length; j++) {
            this.game.scene.remove(this.bonus[j].mesh);
        }
        this.bonus = [];
        for (var j = 0; j < this.missiles.length; j++) {
            this.game.scene.remove(this.missiles[j].mesh);
        }
        this.missiles = [];
        for (var j = 0; j < this.explosions.length; j++) {
            this.game.scene.remove(this.explosions[j].mesh);
        }
        this.explosions = [];
        for (var j = 0; j < this.scores.length; j++) {
            this.game.scene.remove(this.scores[j].mesh);
        }
        this.scores = [];
        this.lastAlienBonus = Date.now();
        this.pad.resetPosition();
    };
    World.prototype.killThemAll = function () {
        for (var j = 0; j < this.AlienGroup.getLength(); j++) {
            soundAlienExplosion.play();
            var e = new Explosion({
                x: this.AlienGroup.get(j).mesh.position.x,
                y: this.AlienGroup.get(j).mesh.position.y,
                z: this.AlienGroup.get(j).mesh.position.z,
                size: 1.5,
                particleNb: 50,
                particleSize: 0.4,
                particleColor: 0xff0000,
            }, this.game);
            this.explosions.push(e);
            this.game.scene.remove(this.AlienGroup.get(j).mesh);
            this.game.scene.remove(this.AlienGroup.get(j).mesh2);
        }
        this.AlienGroup.aliens = [];
    };
    World.prototype.invinciblePad = function () {
        if (this.invincible == false)
            this.invincible = true;
        else
            this.invincible = false;
    };
    World.prototype.killPad = function () {
        var e = new Explosion({
            x: this.pad.mesh.position.x,
            y: this.pad.mesh.position.y,
            z: this.pad.mesh.position.z,
            size: 1.5,
            particleNb: 100,
            particleSize: 0.5,
            particleColor: 0x2FA1D6,
        }, this.game);
        this.explosions.push(e);
    };
    World.prototype.padFire = function () {
        console.log('pad fire');
        var m = this.pad.fire();
        if (m) {
            this.missiles.push(m);
            this.game.scene.add(m.mesh);
        }
    };
    World.prototype.alienFire = function () {
        // console.log('alien fire');
        var AlienGroupSize = this.AlienGroup.getLength();
        if (AlienGroupSize > 0) {
            var m = this.AlienGroup.fire(AlienGroupSize);
            if (m instanceof Missile) {
                this.missiles.push(m);
                this.game.scene.add(m.mesh);
                this.updateMissileLights();
            }
        }
    };
    World.prototype.removeMissile = function (i) {
        this.game.scene.remove(this.missiles[i].mesh);
        this.missiles.splice(i, 1);
        this.updateMissileLights();
    };
    World.prototype.removeAlien = function (i) {
        this.game.scene.remove(this.AlienGroup.get(i).mesh);
        this.game.scene.remove(this.AlienGroup.get(i).mesh2);
        this.AlienGroup.remove(i);
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
                var e_1 = new Explosion({
                    x: this.earth.position.x,
                    y: this.earth.position.y,
                    z: this.earth.position.z,
                    size: 100,
                    particleNb: 200,
                    particleSize: 10,
                    particleColor: 0x354696,
                }, this.game);
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
            for (var j = 0; j < this.AlienGroup.getLength(); j++) {
                if (this.AlienGroup.get(j).mesh.position.z > 0) {
                    this.AlienGroup.get(j).mesh.position.z -= 0.05;
                    levelInitEnd = false;
                }
                else {
                    this.AlienGroup.get(j).mesh.position.z = 0.0;
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
            if (this.game.Key.isDown(Key.LEFT)) {
                this.pad.left();
                this.game.updateCameraPad();
            }
            if (this.game.Key.isDown(Key.RIGHT)) {
                this.pad.right();
                this.game.updateCameraPad();
            }
            if (this.game.Key.isDown(Key.SPACE))
                this.padFire();
            // animate pad
            this.pad.animate();
            // animate bunkers
            for (var i = 0; i < this.blocks.length; i++) {
                this.blocks[i].animate();
            }
            // animate aliens
            if (this.invincible == true) {
                this.AlienGroup.animate(false);
            }
            else {
                this.AlienGroup.animate(true);
            }
            // alien fire
            if ((Date.now() - this.LastFire) > 1000) {
                this.alienFire();
                this.LastFire = Date.now();
            }
            // alien bonus
            for (var i = 0; i < this.alienBonus.length; i++) {
                if (this.alienBonus[i].animate() == false) {
                    this.game.scene.remove(this.alienBonus[i].mesh);
                    this.game.scene.remove(this.alienBonus[i].mesh2);
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
                    this.game.scene.remove(this.missiles[i].mesh);
                    this.missiles.splice(i, 1);
                    i--;
                }
            }
            // animate explosions
            for (var i = 0; i < this.explosions.length; i++) {
                if (this.explosions[i].animate()) {
                    // explosion end
                    this.game.scene.remove(this.explosions[i].mesh);
                    this.explosions.splice(i, 1);
                    i--;
                    break;
                }
            }
            // animate scores
            for (var i = 0; i < this.scores.length; i++) {
                if (this.scores[i].animate()) {
                    // score end
                    this.game.scene.remove(this.scores[i].mesh);
                    this.scores.splice(i, 1);
                    i--;
                    break;
                }
            }
            // animate bonus
            for (var i = 0; i < this.bonus.length; i++) {
                if (this.bonus[i].animate()) {
                    // bonus end
                    this.game.scene.remove(this.bonus[i].mesh);
                    this.bonus.splice(i, 1);
                    i--;
                    break;
                }
            }
            // check missile collision with aliens
            for (var i = 0; i < this.missiles.length; i++) {
                for (var j = 0; j < this.AlienGroup.getLength(); j++) {
                    if (!this.missiles[i].alien && boxCollision(this.AlienGroup.get(j), this.missiles[i])) {
                        missilePadTouch = true;
                        var alien = this.AlienGroup.get(j);
                        //console.log('missile collision avec alien');
                        // explosion
                        soundAlienExplosion.play();
                        e = new Explosion({
                            x: alien.mesh.position.x,
                            y: alien.mesh.position.y,
                            z: alien.mesh.position.z,
                            size: 1.5,
                            particleNb: 50,
                            particleSize: 0.4,
                            particleColor: alien.explosionColor,
                        }, this.game);
                        this.explosions.push(e);
                        // score
                        this.game.updateScore(alien.getScore());
                        var s = new ScoreAnimation({
                            x: alien.mesh.position.x,
                            y: alien.mesh.position.y,
                            z: alien.mesh.position.z,
                            text: '+' + alien.getScore(),
                        }, this.game);
                        this.scores.push(s);
                        // bonus
                        if (Math.random() < BONUS_RATE) {
                            var b = new Bonus({
                                x: alien.mesh.position.x,
                                y: alien.mesh.position.y,
                                z: alien.mesh.position.z,
                                type: Math.floor((Math.random() * 2) + 1),
                            }, this.game);
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
                    if (!this.missiles[i].alien && boxCollision(this.alienBonus[j], this.missiles[i])) {
                        missilePadTouch = true;
                        var alien = this.alienBonus[j];
                        // explosion
                        soundAlienExplosion.play();
                        e = new Explosion({
                            x: alien.mesh.position.x,
                            y: alien.mesh.position.y,
                            z: alien.mesh.position.z,
                            size: 1.5,
                            particleNb: 50,
                            particleSize: 0.4,
                            particleColor: 0xff0000,
                        }, this.game);
                        this.explosions.push(e);
                        // score
                        this.game.updateScore(alien.getScore());
                        var s = new ScoreAnimation({
                            x: alien.mesh.position.x,
                            y: alien.mesh.position.y,
                            z: alien.mesh.position.z,
                            text: '+' + alien.getScore(),
                        }, this.game);
                        this.scores.push(s);
                        // kill alien
                        this.game.scene.remove(alien.mesh);
                        this.game.scene.remove(alien.mesh2);
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
                    if (boxCollision(this.missiles[i], this.pad)) {
                        soundPadExplosion.play();
                        this.game.updateLife(this.game.life - 1);
                        this.removeMissile(i);
                        this.killPad();
                        i--;
                        if (this.game.life <= 0) {
                            this.pad.mesh.visible = false;
                            setTimeout(function () {
                                this.game.lose();
                            }.bind(this), 500);
                        }
                    }
                }
            }
            // check if aliens have reach the player
            if (this.AlienGroup.onBottom() > 0 && this.AlienGroup.onBottom() < 4.5) {
                this.game.lose();
            }
            // check block collision
            for (var i = 0; i < this.missiles.length; i++) {
                for (var j = 0; j < this.blocks.length; j++) {
                    if (boxCollision(this.blocks[j], this.missiles[i])) {
                        if (!this.missiles[i].alien) {
                            missilePadTouch = true;
                        }
                        // explosion
                        soundBlockExplosion.play();
                        e = new Explosion({
                            x: this.blocks[j].mesh.position.x,
                            y: this.blocks[j].mesh.position.y,
                            z: this.blocks[j].mesh.position.z,
                            size: 1.5,
                            particleNb: 30,
                            particleSize: 0.2,
                            particleColor: 0x22dd33,
                        }, this.game);
                        this.explosions.push(e);
                        // kill block
                        this.game.scene.remove(this.blocks[j].mesh);
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
                if (boxCollision(this.bonus[i], this.pad)) {
                    soundBonus.play();
                    // give bonus to pad
                    this.pad.addBonus(this.bonus[i]);
                    // explosion
                    e = new Explosion({
                        x: this.pad.mesh.position.x,
                        y: this.pad.mesh.position.y,
                        z: this.pad.mesh.position.z,
                        size: 1.5,
                        particleNb: 30,
                        particleSize: 0.2,
                        particleColor: 0x22dd33,
                    }, this.game);
                    this.explosions.push(e);
                    // kill bonus
                    this.game.scene.remove(this.bonus[i].mesh);
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
        return this.AlienGroup.getLength();
    };
    return World;
}());

//# sourceMappingURL=world.js.map
