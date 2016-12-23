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
        if (sound) {
            this.audio.load();
            this.audio.play();
        }
    };
    Sound.prototype.pause = function () {
        this.audio.pause();
    };
    Sound.prototype.resume = function () {
        if (sound) {
            this.audio.play();
        }
    };
    Sound.prototype.load = function () {
        this.audio.load();
    };
    Sound.prototype.off = function () {
        this.audio.pause();
        this.audio.load();
    };
    Sound.prototype.resetVolume = function () {
        console.log(this.initialVolume);
        this.audio.volume = this.initialVolume;
    };
    return Sound;
}());
;
var soundPlaying = new Sound(['src/medias/sounds/music_playing.ogg'], 0.4, true);
var soundMenu = new Sound(['src/medias/sounds/alt/music_menu.ogg'], 0.6, true);
var soundLost = new Sound(['src/medias/sounds/music_lost.ogg'], 0.6, false);
var soundAlienFire = new Sound(['src/medias/sounds/pad_fire.ogg'], 0.1, false);
var soundPadFire = new Sound(['src/medias/sounds/pad_fire.ogg'], 0.1, false);
var soundAlienExplosion = new Sound(['src/medias/sounds/alien_explosion.ogg'], 0.8, false);
var soundBlockExplosion = new Sound(['src/medias/sounds/block_explosion.ogg'], 0.5, false);
var soundPadExplosion = new Sound(['src/medias/sounds/pad_explosion.ogg'], 0.5, false);
var soundClick = new Sound(['src/medias/sounds/click.ogg'], 1, false);
var soundClickStart = new Sound(['src/medias/sounds/click_start.ogg'], 0.8, false);
var soundClickPause = new Sound(['src/medias/sounds/click_pause.ogg'], 0.6, false);
var soundBonus = new Sound(['src/medias/sounds/bonus.ogg'], 0.6, false);
var soundVictory = new Sound(['src/medias/sounds/victory.ogg'], 0.6, false);
var sound = false;

//# sourceMappingURL=soundplayer.js.map
