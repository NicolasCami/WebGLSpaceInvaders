import { Sound } from "./sound";

export class SoundService {

    private static sounds: any = {};
    private static mute: boolean = true;

    static getSoundByName(name: string): Sound {
        let result : Sound;

        if(name in SoundService.sounds) {
            result = SoundService.sounds[name];
        }
        else {
            throw new Error("SoundService: sound does not exists: " + name);
        }

        return result;
    }

    static loadSound(name: string, file: string, volume: number = 0.5, loop: boolean = false) : Sound {
        
        if(name in SoundService.sounds){
            throw new Error("SoundService: sound already exists: " + name);
        }

        SoundService.sounds[name] = new Sound( [ file ], volume, loop);

        return SoundService.sounds[name];
    }

    static muted() : boolean {
        return SoundService.mute;
    }

}
