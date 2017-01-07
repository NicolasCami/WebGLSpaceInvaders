define(["require", "exports"], function (require, exports) {
    "use strict";
    var Sound = (function () {
        function Sound(sources, volume, loop) {
            this.audio = document.createElement('audio');
            this.initialVolume = volume;
            for (var i = 0; i < sources.length; i++) {
                var source = document.createElement('source');
                source.src = sources[i];
                this.audio.appendChild(source);
            }
            if (loop == true)
                this.audio.loop = true;
            this.audio.volume = volume;
        }
        Sound.prototype.play = function () {
            this.audio.load();
            this.audio.play();
        };
        Sound.prototype.pause = function () {
            this.audio.pause();
        };
        Sound.prototype.resume = function () {
            this.audio.play();
        };
        Sound.prototype.load = function () {
            this.audio.load();
        };
        Sound.prototype.off = function () {
            this.audio.pause();
            this.audio.load();
        };
        Sound.prototype.resetVolume = function () {
            this.audio.volume = this.initialVolume;
        };
        return Sound;
    }());
    exports.Sound = Sound;
    ;
});

//# sourceMappingURL=sound.js.map
