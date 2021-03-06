define(["require", "exports", "./sound"], function (require, exports, sound_1) {
    "use strict";
    var SoundService = (function () {
        function SoundService() {
        }
        SoundService.getSoundByName = function (name) {
            var result;
            if (name in SoundService.sounds) {
                result = SoundService.sounds[name];
            }
            else {
                throw new Error("SoundService: sound does not exists: " + name);
            }
            return result;
        };
        SoundService.loadSound = function (name, file, volume, loop) {
            if (volume === void 0) { volume = 0.5; }
            if (loop === void 0) { loop = false; }
            if (name in SoundService.sounds) {
                throw new Error("SoundService: sound already exists: " + name);
            }
            SoundService.sounds[name] = new sound_1.Sound([file], volume, loop);
            if (SoundService.mute) {
                SoundService.sounds[name].audio.volume = 0;
            }
            else {
                SoundService.sounds[name].resetVolume();
            }
            return SoundService.sounds[name];
        };
        SoundService.muted = function () {
            return SoundService.mute;
        };
        SoundService.toggle = function () {
            var name;
            SoundService.mute = !SoundService.mute;
            if (SoundService.mute) {
                for (var name_1 in SoundService.sounds) {
                    SoundService.sounds[name_1].audio.volume = 0;
                }
            }
            else {
                for (var name_2 in SoundService.sounds) {
                    SoundService.sounds[name_2].resetVolume();
                }
            }
            return SoundService.mute;
        };
        SoundService.sounds = {};
        SoundService.mute = true;
        return SoundService;
    }());
    exports.SoundService = SoundService;
});

//# sourceMappingURL=soundservice.js.map
