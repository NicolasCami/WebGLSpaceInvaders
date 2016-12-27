var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ScoreAnimation = (function (_super) {
    __extends(ScoreAnimation, _super);
    function ScoreAnimation(text, position, width) {
        if (text === void 0) { text = ''; }
        if (position === void 0) { position = new THREE.Vector3(0.0, 0.0, 0.0); }
        if (width === void 0) { width = 5; }
        _super.call(this, new THREE.Vector3(1.0, 1.0, 1.0), new THREE.Vector3(0.0, 0.0, ScoreAnimation.INCREMENT), position);
        this.time = Date.now();
        this.text = text;
        this.width = width;
        this.init();
    }
    ScoreAnimation.prototype.initMesh = function () {
        if (this.text in textData) {
            this.mesh = textData[this.text].clone();
        }
        else {
            textData[this.text] = textMesh({
                text: this.text,
                color: 'rgba(255,255,255,1)',
                font: 'Bold 50px Arial',
                width: this.width,
                height: 3,
            });
            this.mesh = textData[this.text].clone();
        }
        this.mesh.rotation.x = Math.PI / 2;
    };
    ScoreAnimation.prototype.animate = function () {
        this.mesh.position.add(this.velocity);
        this.mesh.rotation.z += 0.1;
        if (this.time + ScoreAnimation.LIFE_TIME < Date.now()) {
            return true;
        }
        return false;
    };
    ScoreAnimation.prototype.getDirection = function () {
        return this.velocity;
    };
    ScoreAnimation.INCREMENT = 0.05;
    ScoreAnimation.LIFE_TIME = 2000.0;
    return ScoreAnimation;
}(Game3dObject));

//# sourceMappingURL=scoreanimation.js.map
