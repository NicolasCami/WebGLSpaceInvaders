define(["require", "exports", "./statistics", "./world", "./menu", "./soundservice", "./materialservice", "./meshservice"], function (require, exports, statistics_1, world_1, menu_1, soundservice_1, materialservice_1, meshservice_1) {
    "use strict";
    var Game = (function () {
        function Game() {
            var _this = this;
            this.pause = true;
            this.currentCamera = 0;
            this.newGameTransition = false;
            this.menuTransition = false;
            this.score = 0;
            this.life = 3;
            this.onRenderFcts = [];
            this.lastTimeMsec = null;
            this.messageButtonAction = function () { };
            this.render = function () {
                _this.stats.update();
                if (!_this.pause && !_this.menuTransition) {
                    _this.world.randomAlienBonus();
                    _this.world.animate();
                    _this.particleSystem.rotation.y += _this.particleSystem.particleSpeed;
                    if (_this.world.getAliensLengh() == 0) {
                        soundservice_1.SoundService.getSoundByName('win').play();
                        if (_this.world.getLevel() < 3) {
                            _this.messageOn({
                                title: 'Congratulation',
                                text: 'You complete the level ' + _this.world.getLevel() + ' !',
                                button: {
                                    text: 'Next level',
                                    click: _this.nextLevel,
                                },
                            });
                        }
                        else {
                            _this.messageOn({
                                title: 'Congratulation',
                                text: 'You won !!!<br/>Score : ' + String(_this.score),
                                button: {
                                    text: 'Back to title',
                                    click: _this.backToMenu,
                                },
                            });
                        }
                    }
                }
                if (_this.newGameTransition) {
                    _this.camera.rotation.x -= 0.05;
                    if (_this.camera.rotation.x < Math.PI / 4.0) {
                        _this.newGameReady();
                    }
                }
                if (_this.menuTransition) {
                    _this.camera.rotation.x += 0.05;
                    if (_this.camera.rotation.x > Math.PI + Math.PI / 3) {
                        _this.menuReady();
                    }
                }
                requestAnimationFrame(_this.render);
                _this.renderer.render(_this.scene, _this.cameras[_this.currentCamera]);
            };
            this.nextLevel = function () {
                soundservice_1.SoundService.getSoundByName('playing').play();
                _this.world.nextLevel();
                _this.messageOff();
                _this.updateLevel();
            };
            this.pauseOn = function () {
                soundservice_1.SoundService.getSoundByName('playing').pause();
                soundservice_1.SoundService.getSoundByName('click-pause').play();
                _this.pause = true;
                $('.pause').show();
            };
            this.pauseOff = function () {
                soundservice_1.SoundService.getSoundByName('click-pause').play();
                if (!$('.pause').is(":hidden")) {
                    soundservice_1.SoundService.getSoundByName('playing').resume();
                    _this.pause = false;
                    $('.pause').hide();
                }
            };
            this.messageOn = function (params) {
                soundservice_1.SoundService.getSoundByName('playing').pause();
                var title = typeof params.title !== 'undefined' ? params.title : '';
                var text = typeof params.text !== 'undefined' ? params.text : '';
                var button = typeof params.button !== 'undefined' ? params.button : null;
                _this.pause = true;
                $('.message h2').html(title);
                $('.message .text').html(text);
                $('.message .button').html(button.text + ' <i class="fa fa-angle-right"></i>');
                $('.message .button').off();
                $('.message .button').click(button.click);
                $(window).unbind("keydown", _this.messageButtonAction);
                _this.messageButtonAction = button.click;
                $(window).bind("keydown", _this.messageButtonAction);
                $('.message').show();
            };
            this.messageOff = function () {
                soundservice_1.SoundService.getSoundByName('win').off();
                _this.pause = false;
                $('.message').hide();
                $(window).unbind("keydown", _this.messageButtonAction);
                console.log('off');
            };
            this.lose = function () {
                soundservice_1.SoundService.getSoundByName('playing').pause();
                soundservice_1.SoundService.getSoundByName('lost').play();
                var html = '';
                html += '<p>You lost...</p>';
                _this.messageOn({
                    title: 'Game Over',
                    text: html,
                    button: {
                        text: 'Back to title',
                        click: _this.backToMenu,
                    },
                });
            };
            this.backToMenu = function () {
                soundservice_1.SoundService.getSoundByName('click').play();
                soundservice_1.SoundService.getSoundByName('playing').pause();
                soundservice_1.SoundService.getSoundByName('menu').resume();
                _this.currentCamera = 0;
                _this.menuTransition = true;
                _this.messageOff();
                _this.world.clear();
                $('.score').hide();
                $('.life').hide();
                $('.level').hide();
                $('.shortcuts').hide();
                $('.invincible').hide();
            };
            if (Game.instance) {
                throw new Error("Game is a singleton. Use Game.getInstance() instead.");
            }
            Game.instance = this;
            materialservice_1.MaterialService.init();
            meshservice_1.MeshService.init();
            this.initSound();
            this.stats = new statistics_1.Statistics();
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.cameraPad = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.initCameras();
            this.cameras = [];
            this.cameras.push(this.camera);
            this.cameras.push(this.cameraPad);
            this.renderer = new THREE.WebGLRenderer({ antialias: false });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            this.initScene();
            this.world = new world_1.World({
                x: 0.0,
                y: 6.0,
                z: -1.0,
                width: 20.0,
                height: 30.0,
            });
            this.menu = new menu_1.Menu({
                x: 0.0,
                y: -20.0,
                z: 20.0,
                width: 30.0,
                height: 30.0,
            });
            /**
            PAUSE EVENTS
            **/
            jQuery('.resume').click(function () {
                soundservice_1.SoundService.getSoundByName('click').play();
                this.pauseOff();
            }.bind(this));
            jQuery('.menu').click(function () {
                soundservice_1.SoundService.getSoundByName('click').play();
                this.pauseOff();
                this.backToMenu();
            }.bind(this));
            /**
            INVINCIBLE GUI
            **/
            var invincibleGUIEffect = function () {
                $(".invincible div").fadeOut(500).delay(100).fadeIn(500);
            };
            setInterval(invincibleGUIEffect, 1300);
            this.render();
        }
        Game.getInstance = function () {
            if (!Game.instance) {
                Game.instance = new Game();
            }
            return Game.instance;
        };
        Game.prototype.initCameras = function () {
            this.camera.position.x = 0.0;
            this.camera.position.y = -2.0;
            this.camera.position.z = 10.0;
            this.camera.rotation.x = Math.PI / 4.0;
            this.cameraPad.position.y = -2.0;
            this.cameraPad.position.z = 2.0;
            this.cameraPad.rotation.x = 1.25;
        };
        Game.prototype.initScene = function () {
            var ambientLight = new THREE.AmbientLight(0x404040);
            this.scene.add(ambientLight);
            this.renderer.shadowMapEnabled = true;
            var spotlight = new THREE.SpotLight(0xffffff);
            spotlight.position.set(0, -40, 100);
            spotlight.shadowDarkness = 1;
            spotlight.intensity = 0.9;
            spotlight.angle = 0.2;
            spotlight.exponent = 0;
            spotlight.castShadow = true;
            this.scene.add(spotlight);
            var particles = new THREE.Geometry;
            for (var p = 0; p < 1000; p++) {
                var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
                particles.vertices.push(particle);
            }
            var particleMaterial = new THREE.PointCloudMaterial({ color: 0xeeeeee, size: 2 });
            this.particleSystem = new THREE.PointCloud(particles, particleMaterial);
            this.particleSystem.particleSpeed = 0.0001;
            this.scene.add(this.particleSystem);
        };
        Game.prototype.initSound = function () {
            soundservice_1.SoundService.loadSound('playing', 'src/medias/sounds/music_playing.ogg', 0.4, true);
            soundservice_1.SoundService.loadSound('menu', 'src/medias/sounds/alt/music_menu.ogg', 0.6, true);
            soundservice_1.SoundService.loadSound('lost', 'src/medias/sounds/music_lost.ogg', 0.6, false);
            soundservice_1.SoundService.loadSound('alien-fire', 'src/medias/sounds/pad_fire.ogg', 0.1, false);
            soundservice_1.SoundService.loadSound('pad-fire', 'src/medias/sounds/pad_fire.ogg', 0.1, false);
            soundservice_1.SoundService.loadSound('alien-explosion', 'src/medias/sounds/alien_explosion.ogg', 0.8, false);
            soundservice_1.SoundService.loadSound('block-explosion', 'src/medias/sounds/block_explosion.ogg', 0.5, false);
            soundservice_1.SoundService.loadSound('pad-explosion', 'src/medias/sounds/pad_explosion.ogg', 0.5, false);
            soundservice_1.SoundService.loadSound('click', 'src/medias/sounds/click.ogg', 1, false);
            soundservice_1.SoundService.loadSound('click-start', 'src/medias/sounds/click_start.ogg', 0.8, false);
            soundservice_1.SoundService.loadSound('click-pause', 'src/medias/sounds/click_pause.ogg', 0.6, false);
            soundservice_1.SoundService.loadSound('bonus', 'src/medias/sounds/bonus.ogg', 0.6, false);
            soundservice_1.SoundService.loadSound('win', 'src/medias/sounds/victory.ogg', 0.6, false);
        };
        Game.prototype.newGame = function () {
            this.newGameTransition = true;
            soundservice_1.SoundService.getSoundByName('menu').pause();
            soundservice_1.SoundService.getSoundByName('click-start').play();
        };
        Game.prototype.newGameReady = function () {
            soundservice_1.SoundService.getSoundByName('playing').play();
            this.camera.rotation.x = Math.PI / 4.0;
            this.newGameTransition = false;
            this.pause = false;
            this.world.initLevel(0);
            this.updateScore(-this.score);
            this.updateLevel();
            this.updateLife(3);
            $('.score').show();
            $('.life').show();
            $('.level').show();
            $('.shortcuts').show();
            if (this.world.invincible) {
                $('.invincible').show();
            }
        };
        Game.prototype.help = function () {
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
            this.messageOn({
                title: 'Shortcuts',
                text: html,
                button: {
                    text: 'Resume',
                    click: this.messageOff,
                },
            });
        };
        Game.prototype.menuReady = function () {
            this.camera.rotation.x = Math.PI + Math.PI / 3;
            this.menuTransition = false;
            this.pause = true;
        };
        Game.prototype.updateCameraPad = function () {
            this.cameraPad.position.x = this.world.pad.mesh.position.x;
        };
        Game.prototype.updateScore = function (n) {
            this.score += n;
            $('.scorePoints').html(String(this.score));
        };
        Game.prototype.updateLevel = function () {
            $('.levelNo').html(String(this.world.getLevel()));
        };
        Game.prototype.updateLife = function (n) {
            this.life = n;
            var htmlString = '';
            for (var i = 0; i < this.life; i++) {
                htmlString += '<i class="fa fa-rocket"></i> ';
            }
            $('.life').html(htmlString);
        };
        Game.prototype.invincibleGUI = function () {
            if (this.world.invincible) {
                $('.invincible').show();
            }
            else {
                $('.invincible').hide();
            }
        };
        return Game;
    }());
    exports.Game = Game;
});

//# sourceMappingURL=game.js.map
