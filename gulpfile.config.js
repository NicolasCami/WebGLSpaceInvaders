'use strict';

var GulpConfig = (function () {
    function gulpConfig() {
        this.source = './src/';
        this.sourceApp = this.source + 'app/';

        this.tsOutputPath = this.source + 'js';
        this.allJavaScript = [this.source + 'js/**/*.js'];
        this.allTypeScript = this.sourceApp + '**/*.ts';

        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = './typings/index.d.ts';
    }
    return gulpConfig;
})();

module.exports = GulpConfig;