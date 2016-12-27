class Game {

    private static instance: Game;

    // Stats
    stats: Statistics;

    // THREEjs
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    cameraPad: THREE.PerspectiveCamera;
    cameras: THREE.Camera[];
    renderer: THREE.WebGLRenderer;
    particleSystem: THREE.PointCloud;

    pause = true;
    music = true;
    currentCamera = 0;
    newGameTransition = false;
    menuTransition = false;
    score = 0;
    life = 3;
    onRenderFcts = [];
    lastTimeMsec = null;
    messageButtonAction = function() {};

    world: World;
    menu: Menu;

    constructor() {

        if(Game.instance){
            throw new Error("Game is a singleton. Use Game.getInstance() instead.");
        }
        Game.instance = this;

        this.stats = new Statistics();

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.cameraPad = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.initCameras();
        this.cameras = [];
        this.cameras.push(this.camera);
        this.cameras.push(this.cameraPad);

        this.renderer = new THREE.WebGLRenderer({antialias: false});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        this.initScene();

        this.world = new World({
            x : 0.0,
            y : 6.0,
            z : -1.0,
            width : 20.0,
            height : 30.0,
        });

        this.menu = new Menu({
            x : 0.0,
            y : -20.0,
            z : 20.0,
            width : 30.0,
            height : 30.0,
        });
        
        /**
        PAUSE EVENTS
        **/
        jQuery('.resume').click(function() {
            soundClick.play();
            this.pauseOff();
        }.bind(this));
        jQuery('.menu').click(function() {
            soundClick.play();
            this.pauseOff();
            this.backToMenu();
        }.bind(this));
        
        /**
        INVINCIBLE GUI
        **/
        /*function invincibleGUIEffect(){
           $(".invincible div").fadeOut(500).delay(100).fadeIn(500); 
        } 
        setInterval('invincibleGUIEffect()',1300);*/      

        this.render();
    }

    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    private initCameras() {
        this.camera.position.x = 0.0;
        this.camera.position.y = -2.0;
        this.camera.position.z = 10.0;
        this.camera.rotation.x = Math.PI/4.0;

        this.cameraPad.position.y = -2.0;
        this.cameraPad.position.z = 2.0;
        this.cameraPad.rotation.x = 1.25;
    }

    private initScene() {
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
    }

    public render = () => {
        this.stats.update();
        
        if(!this.pause && !this.menuTransition) {
            this.world.randomAlienBonus();
            this.world.animate();
            this.particleSystem.rotation.y += this.particleSystem.particleSpeed;
            
            if(this.world.getAliensLengh() == 0) {
                soundVictory.play();
                
                if(this.world.getLevel() < 3) {
                    this.messageOn({
                        title:'Congratulation',
                        text:'You complete the level ' + this.world.getLevel() + ' !',
                        button:{
                            text: 'Next level',
                            click: this.nextLevel,
                        },
                    });
                }
                else {
                    this.messageOn({
                        title:'Congratulation',
                        text:'You won !!!<br/>Score : ' + String(this.score),
                        button:{
                            text: 'Back to title',
                            click: this.backToMenu,
                        },
                    });
                }
            }
        }
        
        if(this.newGameTransition) {
            this.camera.rotation.x -= 0.05;
            if(this.camera.rotation.x < Math.PI/4.0) {
                this.newGameReady();
            }
        }
        
        if(this.menuTransition) {
            this.camera.rotation.x += 0.05;
            if(this.camera.rotation.x > Math.PI+Math.PI/3) {
                this.menuReady();
            }
        }
        
        requestAnimationFrame(this.render);
        
        this.renderer.render(this.scene, this.cameras[this.currentCamera]);
    }

    public newGame() {
        this.newGameTransition = true;
        soundMenu.pause();
        soundClickStart.play();
    }

    private newGameReady() {
        soundPlaying.play();
        this.camera.rotation.x = Math.PI/4.0;
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
        if(this.world.invincible) {
            $('.invincible').show();
        }
    }

    private nextLevel = () => {
        soundPlaying.play();
        this.world.nextLevel();
        this.messageOff();
        this.updateLevel();
    }

    public musicOnOff = () => {
        this.music = (this.music) ? false : true;
        if(this.music) {
            soundPlaying.resetVolume();
            soundMenu.resetVolume();
        }
        else {
            soundPlaying.audio.volume = 0;
            soundMenu.audio.volume = 0;
        }
    }

    public pauseOn = () => {
        soundPlaying.pause();
        soundClickPause.play();
        this.pause = true;
        $('.pause').show();
    }

    public pauseOff = () => {
        soundClickPause.play();
        if(!$('.pause').is(":hidden")) {
            soundPlaying.resume();
            this.pause = false;
            $('.pause').hide();
        }
    }

    private messageOn = (params: any) => {
        soundPlaying.pause();
        var title = typeof params.title !== 'undefined' ? params.title : '';
        var text = typeof params.text !== 'undefined' ? params.text : '';
        var button = typeof params.button !== 'undefined' ? params.button : null;
        this.pause = true;
        
        $('.message h2').html(title);
        $('.message .text').html(text);
        $('.message .button').html(button.text + ' <i class="fa fa-angle-right"></i>');
        $('.message .button').off();
        $('.message .button').click(button.click);
        $(window).unbind("keydown", this.messageButtonAction);
        this.messageButtonAction = button.click;
        $(window).bind("keydown", this.messageButtonAction);
        $('.message').show();
    }

    private messageOff = () => {
        soundVictory.off();
        this.pause = false;
        $('.message').hide();
        $(window).unbind("keydown", this.messageButtonAction);
        console.log('off');
    }

    public help() {
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
            title:'Shortcuts',
            text:html,
            button:{
                text: 'Resume',
                click: this.messageOff,
            },
        });
    }

    public lose = () => {
        soundPlaying.pause();
        soundLost.play();
        var html = '';
        html += '<p>You lost...</p>';
        this.messageOn({
            title:'Game Over',
            text:html,
            button:{
                text: 'Back to title',
                click: this.backToMenu,
            },
        });
    }

    public backToMenu = () => {
        soundClick.play();
        soundPlaying.pause();
        soundMenu.resume();
        this.currentCamera = 0;
        this.menuTransition = true;
        this.messageOff();
        this.world.clear();
        $('.score').hide();
        $('.life').hide();
        $('.level').hide();
        $('.shortcuts').hide();
        $('.invincible').hide();
    }

    private menuReady() {
        this.camera.rotation.x = Math.PI+Math.PI/3;
        this.menuTransition = false;
        this.pause = true;
    }

    public updateCameraPad() {
        this.cameraPad.position.x = this.world.pad.mesh.position.x;
    }

    public updateScore(n: number) {
        this.score += n;
        $('.scorePoints').html(String(this.score));
    }

    public updateLevel() {
        $('.levelNo').html(String(this.world.getLevel()));
    }

    public updateLife(n: number) {
        this.life = n;
        var htmlString = '';
        for(var i=0; i<this.life; i++) {
            htmlString += '<i class="fa fa-rocket"></i> ';
        }
        $('.life').html(htmlString);
    }

}

$(new Function('var game = Game.getInstance();'));