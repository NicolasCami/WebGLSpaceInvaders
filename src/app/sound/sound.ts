export class Sound {
  
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
        this.audio.load();
        this.audio.play();
    }

    public pause() {
        this.audio.pause();
    }

    public resume() {
        this.audio.play();     
    }

    public load() {
        this.audio.load();
    }

    public off() {
        this.audio.pause();
        this.audio.load();
    }
    
    public resetVolume() {
        this.audio.volume = this.initialVolume;
    }

};