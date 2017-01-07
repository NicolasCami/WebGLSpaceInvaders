import { Game } from "../core/game";
import { SoundService } from "../sound/soundservice";

export class Key {

    private static instance: Key;

    static keyCode = {
        escape: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        h: 72,
        i: 73,
        k: 75,
        m: 77
    };

    pressed: any;

    constructor() {

        if(Key.instance){
            throw new Error("Key is a singleton. Use Key.getInstance() instead.");
        }

        this.pressed = {};

        this.initListeners();
    }

    private initListeners() {
        window.addEventListener('keyup', function(event) { this.onKeyup(event); }.bind(this), false);
        window.addEventListener('keydown', function(event) { this.onKeydown(event); }.bind(this), false);
        window.addEventListener('click', function(event) { Game.getInstance().menu.mouseClick(event); }.bind(this), false);
        window.addEventListener('mousemove', function(event) { Game.getInstance().menu.mouseMove(event); }.bind(this), false);
    }

    static getInstance() {
        if (!Key.instance) {
            Key.instance = new Key();
        }
        return Key.instance;
    }

    public isDown(keyCode: number): boolean {
        return this.pressed[keyCode];
    }

    public onKeydown(event) {
        this.pressed[event.keyCode] = true;
        if(!Game.getInstance().pause) {
            if(event.key == "0") {
                Game.getInstance().currentCamera = 0;
            }
            if(event.key == "1") {
                Game.getInstance().currentCamera = 1;
            }
            if(event.keyCode == Key.keyCode.k) {
                Game.getInstance().world.killThemAll();
            }
            if(event.keyCode == Key.keyCode.i) {
                Game.getInstance().world.invinciblePad();
                Game.getInstance().invincibleGUI();
            }
            if(event.keyCode == Key.keyCode.h) {
                Game.getInstance().help();
            }
            if(event.keyCode == Key.keyCode.escape) {
                Game.getInstance().pauseOn();
            }
        }
        else {
            if(event.keyCode == Key.keyCode.escape) {
                Game.getInstance().pauseOff();
            }
        }

        if(event.keyCode == Key.keyCode.m) {
            SoundService.toggle();
        }
    }

    public onKeyup(event) {
        delete this.pressed[event.keyCode];
    }

}