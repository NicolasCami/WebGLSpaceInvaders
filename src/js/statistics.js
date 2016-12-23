var Statistics = (function () {
    function Statistics() {
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        $('#Stats-output').append(this.stats.domElement);
    }
    Statistics.prototype.update = function () {
        this.stats.update();
    };
    return Statistics;
}());

//# sourceMappingURL=statistics.js.map
