class Sound {
  
    audio: HTMLAudioElement;
    initialVolume: number;

    constructor(sources: string[], volume: number, loop: boolean) {
        this.audio = document.createElement( 'audio' );
        this.initialVolume = volume;
        for ( let i = 0; i < sources.length; i ++ ) {

          let source = document.createElement( 'source' );
          source.src = sources[ i ];

          this.audio.appendChild( source );
        }
        if (loop == true) this.audio.loop = true;
        this.audio.volume = volume;
    }

    public play() {
      if(sound){
        this.audio.load();
        this.audio.play();
      }
    }

    public pause() {

      this.audio.pause();

    }

    public resume() {
      if (sound){
        this.audio.play();
      }        
    }

    public load() {
      this.audio.load();
    }

    public off() {
      this.audio.pause();
      this.audio.load();
    }
    
    public resetVolume() {console.log(this.initialVolume);
      this.audio.volume = this.initialVolume;
    }
};

let soundPlaying = new Sound( [ 'src/medias/sounds/music_playing.ogg'], 0.4, true);
let soundMenu = new Sound( [ 'src/medias/sounds/alt/music_menu.ogg'],0.6,true);
let soundLost = new Sound( [ 'src/medias/sounds/music_lost.ogg'],0.6,false);
let soundAlienFire = new Sound ( ['src/medias/sounds/pad_fire.ogg'],0.1,false);
let soundPadFire = new Sound ( ['src/medias/sounds/pad_fire.ogg'],0.1,false);
let soundAlienExplosion = new Sound ( ['src/medias/sounds/alien_explosion.ogg'],0.8,false);
let soundBlockExplosion = new Sound ( ['src/medias/sounds/block_explosion.ogg'],0.5,false);
let soundPadExplosion = new Sound ( ['src/medias/sounds/pad_explosion.ogg'],0.5,false);
let soundClick = new Sound ( ['src/medias/sounds/click.ogg'],1,false);
let soundClickStart = new Sound ( ['src/medias/sounds/click_start.ogg'],0.8,false);
let soundClickPause = new Sound ( ['src/medias/sounds/click_pause.ogg'],0.6,false);
let soundBonus = new Sound ( ['src/medias/sounds/bonus.ogg'],0.6,false);
let soundVictory = new Sound ( ['src/medias/sounds/victory.ogg'],0.6,false);
var sound = false;