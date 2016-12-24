function boxCollision(a, b) {
    return (a.maxX() >= b.minX() && a.minX() <= b.maxX())
        && (a.maxY() >= b.minY() && a.minY() <= b.maxY())
        && (a.maxZ() >= b.minZ() && a.minZ() <= b.maxZ());
}
function loadModel(params) {
    var filePath = typeof params.filePath !== 'undefined' ? params.filePath : '';
    var encoding = typeof params.encoding !== 'undefined' ? params.encoding : 'UTF-8';
    var content = typeof params.content !== 'undefined' ? params.content : '';
    var charEmpty = typeof params.charEmpty !== 'undefined' ? params.charEmpty : ' ';
    var charFull = typeof params.charFull !== 'undefined' ? params.charFull : '*';
    var separatorY = typeof params.separatorY !== 'undefined' ? params.separatorY : ',';
    var separatorZ = typeof params.separatorZ !== 'undefined' ? params.separatorZ : '/';
    var blockSize = typeof params.blockSize !== 'undefined' ? params.blockSize : 0.1;
    var modelSize = typeof params.modelSize !== 'undefined' ? params.modelSize : { x: 1.2, y: 1.2, z: 0.2 };
    var material = typeof params.material !== 'undefined' ? params.material : padMaterials;
    var geometry = typeof params.geometry !== 'undefined' ? params.geometry : modelBlockGeometry;
    var axe = typeof params.axe !== 'undefined' ? params.axe : 'z';
    var group = new THREE.Geometry();
    //var materials = [];
    var x = -modelSize.x / 2.0;
    var y = -modelSize.y / 2.0;
    var z = -modelSize.z / 2.0;
    switch (axe) {
        case 'y':
            for (var i = 0; i < content.length; i++) {
                if (content.charAt(i) == charFull) {
                    var m = new THREE.Mesh(geometry);
                    m.position.x = x;
                    m.position.y = y;
                    m.position.z = z;
                    m.updateMatrix();
                    group.merge(m.geometry, m.matrix);
                }
                x += blockSize;
                if (content.charAt(i) == separatorY) {
                    x = -modelSize.x / 2.0;
                    z += blockSize;
                }
                else if (content.charAt(i) == separatorZ) {
                    x = -modelSize.x / 2.0;
                    z = -modelSize.z / 2.0;
                    y += blockSize;
                }
            }
            var mesh = new THREE.Mesh(group, material[Math.floor((Math.random() * material.length))]);
            mesh.castShadow = true;
            return mesh;
        case 'z':
            for (var i = 0; i < content.length; i++) {
                if (content.charAt(i) == charFull) {
                    var m = new THREE.Mesh(geometry);
                    m.position.x = x;
                    m.position.y = y;
                    m.position.z = z;
                    m.updateMatrix();
                    group.merge(m.geometry, m.matrix);
                }
                x += blockSize;
                if (content.charAt(i) == separatorY) {
                    x = -modelSize.x / 2.0;
                    y += blockSize;
                }
                else if (content.charAt(i) == separatorZ) {
                    x = -modelSize.x / 2.0;
                    y = -modelSize.y / 2.0;
                    z += blockSize;
                }
            }
            var mesh = new THREE.Mesh(group, material[Math.floor((Math.random() * material.length))]);
            mesh.castShadow = true;
            return mesh;
    }
    var mesh = new THREE.Mesh(group, material[Math.floor((Math.random() * material.length))]);
    return mesh;
}
function textMesh(params) {
    var width = typeof params.width !== 'undefined' ? params.width : 10;
    var height = typeof params.height !== 'undefined' ? params.height : 10;
    var font = typeof params.font !== 'undefined' ? params.font : "Bold 20px Arial";
    var align = typeof params.align !== 'undefined' ? params.align : 'center';
    var color = typeof params.color !== 'undefined' ? params.color : 'rgba(255,0,0,1)';
    var text = typeof params.text !== 'undefined' ? params.text : "";
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = font;
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false }));
    return mesh;
}
function randFromArray(a) {
    return a[Math.floor((Math.random() * a.length))];
}
;
/**************************
 * CONSTANTS
 ***************************/
/**
 * PAD
 **/
var padMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('src/medias/images/pad.png')
});
var padMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x333333, specular: 0xffffff, shininess: 500 }),
];
var padGeometry = new THREE.BoxGeometry(1, 1, 1);
var modelBlockGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
var padBlockGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
/**
 * BUNKER
 **/
var blockMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('src/medias/images/block.jpg')
});
var blockGeometries = [
    new THREE.BoxGeometry(0.6, 0.6, 0.5),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.BoxGeometry(0.6, 0.6, 0.7),
    new THREE.BoxGeometry(0.6, 0.6, 0.8),
    new THREE.BoxGeometry(0.6, 0.6, 0.9),
    new THREE.BoxGeometry(0.6, 0.6, 1.0),
];
var blockMaterials = [
    new THREE.MeshPhongMaterial({ color: 0xff6400, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0xff8b40, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0xffaa73, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0xa64100, specular: 0xffffff, shininess: 200 }),
];
var blockData = {
    model: [],
};
blockGeometries.forEach(function (geometry) {
    blockMaterials.forEach(function (material) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        blockData.model.push(mesh);
    });
});
/**
 * LIGHTS
 **/
var missileLight1 = new THREE.PointLight(0xffffff, 1.0, 10);
var missileLight2 = new THREE.PointLight(0xffffff, 1.0, 10);
var missileLight3 = new THREE.PointLight(0xffffff, 1.0, 10);
var missileLight4 = new THREE.PointLight(0xffffff, 1.0, 10);
/**
 * ALIEN
 **/
var alienMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('src/medias/images/water_0.jpg')
});
var aliensMaterialsType1 = [
    new THREE.MeshPhongMaterial({ color: 0x87b073, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0x85b66c, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0x689d4e, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0x658954, specular: 0xffffff, shininess: 200 }),
];
var aliensMaterialsType2 = [
    new THREE.MeshPhongMaterial({ color: 0x547289, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0x5789b0, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0x3d6686, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0x7093ae, specular: 0xffffff, shininess: 200 }),
];
var aliensMaterialsType3 = [
    new THREE.MeshPhongMaterial({ color: 0x9d70ae, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0xc096d0, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0xaf72c5, specular: 0xffffff, shininess: 200 }),
    new THREE.MeshPhongMaterial({ color: 0xb08bbd, specular: 0xffffff, shininess: 200 }),
];
var aliensMaterialsBonus = [
    new THREE.MeshLambertMaterial({ color: 0xb83535 }),
    new THREE.MeshLambertMaterial({ color: 0xdb4f4f }),
    new THREE.MeshLambertMaterial({ color: 0xb12727 }),
    new THREE.MeshLambertMaterial({ color: 0xdd1919 }),
];
var alienGeometry = new THREE.BoxGeometry(1, 1, 1);
var alienData = {
    type: [
        { model1: [], model2: [], modelMenu: null },
        { model1: [], model2: [], modelMenu: null },
        { model1: [], model2: [], modelMenu: null },
        { model1: [], model2: [], modelMenu: null },
    ]
};
// mesh in game
aliensMaterialsType1.forEach(function (material) {
    alienData.type[0].model1.push(loadModel({
        content: '*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
    alienData.type[0].model2.push(loadModel({
        content: '  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
});
aliensMaterialsType2.forEach(function (material) {
    alienData.type[1].model1.push(loadModel({
        content: '**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
    alienData.type[1].model2.push(loadModel({
        content: '   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****/   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
});
aliensMaterialsType3.forEach(function (material) {
    alienData.type[2].model1.push(loadModel({
        content: '   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     *',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
    alienData.type[2].model2.push(loadModel({
        content: ' **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     */ **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     */ **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     */ **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     *',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
});
aliensMaterialsBonus.forEach(function (material) {
    alienData.type[3].model1.push(loadModel({
        content: '   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
    alienData.type[3].model2.push(loadModel({
        content: '   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******',
        modelSize: { x: 0.8, y: 2, z: 0.4 },
        material: [material],
        axe: 'y',
    }));
});
// mesh for menu
alienData.type[0].modelMenu = loadModel({
    content: '*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **',
    modelSize: { x: 0.8, y: 2, z: 0.4 },
    material: [new THREE.MeshBasicMaterial({
            color: 0x87b073,
            side: THREE.DoubleSide
        })],
    axe: 'y',
});
alienData.type[1].modelMenu = loadModel({
    content: '**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,',
    modelSize: { x: 0.8, y: 2, z: 0.4 },
    material: [new THREE.MeshBasicMaterial({
            color: 0x547289,
            side: THREE.DoubleSide
        })],
    axe: 'y',
});
alienData.type[2].modelMenu = loadModel({
    content: '   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     *',
    modelSize: { x: 0.8, y: 2, z: 0.4 },
    material: [new THREE.MeshBasicMaterial({
            color: 0x9d70ae,
            side: THREE.DoubleSide
        })],
    axe: 'y',
});
alienData.type[3].modelMenu = loadModel({
    content: '   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******',
    modelSize: { x: 0.8, y: 2, z: 0.4 },
    material: [new THREE.MeshBasicMaterial({
            color: 0xb83535,
            side: THREE.DoubleSide
        })],
    axe: 'y',
});
/**
 * MISSILE
 **/
var padMissileMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var alienMissileMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var padMissileGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
var padBigMissileGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
var missileData = {
    type: [
        { model: new THREE.Mesh(padMissileGeometry, alienMissileMaterial) },
        { model: new THREE.Mesh(padMissileGeometry, padMissileMaterial) },
        { model: new THREE.Mesh(padBigMissileGeometry, padMissileMaterial) },
    ]
};
/**
 * WORLD
 **/
var groundTexture = THREE.ImageUtils.loadTexture('src/medias/images/pad.jpg');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(4, 4);
var groundMaterial = new THREE.MeshPhongMaterial({
    map: groundTexture,
    side: THREE.DoubleSide,
    specular: 0xffffff,
    shininess: 200
});
var earthMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('src/medias/images/earth.jpg')
});
var earthMesh = new THREE.Mesh(new THREE.SphereGeometry(30, 30, 30), earthMaterial);
var deathStarMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('src/medias/images/deathStar.jpg')
});
var deathStarMesh = new THREE.Mesh(new THREE.SphereGeometry(25, 30, 30), deathStarMaterial);
var worldData = {
    limit: null,
};
worldData.limit = loadModel({
    content: '  ****, ******,********,********,********,********, ******,  ****/   **,  ****, ******,********,********, ******,  ****,   **/,   **,  ****, ******, ******,  ****,   **/',
    modelSize: { x: 0.45, y: 0.45, z: 0.15 },
    material: [new THREE.MeshPhongMaterial({ color: 0xff0040, specular: 0xffffff, shininess: 200 })],
    geometry: padBlockGeometry,
    blockSize: 0.05,
    axe: 'z',
});
/**
 * BONUS
 **/
var bonusData = {
    type: [
        { model: null },
        { model: null },
    ]
};
bonusData.type[0].model = loadModel({
    content: ',   **,  ****, ******, ******,  ****,   **/   **,  ****, ******,********,********, ******,  ****,   **/  ****, ******,********,********,********,********, ******,  ****/  ****, ******,********,********,********,********, ******,  ****/   **,  ****, ******,********,********, ******,  ****,   **/,   **,  ****, ******, ******,  ****,   **/',
    modelSize: { x: 0.8, y: 0.8, z: 1.0 },
    material: [new THREE.MeshPhongMaterial({ color: 0x2bb121, specular: 0xffffff, shininess: 200 })],
    axe: 'z',
});
bonusData.type[1].model = loadModel({
    content: ',   **,  ****, ******, ******,  ****,   **/   **,  ****, ******,********,********, ******,  ****,   **/  ****, ******,********,********,********,********, ******,  ****/  ****, ******,********,********,********,********, ******,  ****/   **,  ****, ******,********,********, ******,  ****,   **/,   **,  ****, ******, ******,  ****,   **/',
    modelSize: { x: 0.8, y: 0.8, z: 1.0 },
    material: [new THREE.MeshPhongMaterial({ color: 0xf1eb42, specular: 0xffffff, shininess: 200 })],
    axe: 'z',
});
/**
 * OTHERS
 **/
var textData = {};
var textArray = ['+150', '+200', '+100', '+500', 'MEGA SHOT', '+1 LIFE'];
textArray.forEach(function (text) {
    textData[text] = textMesh({
        text: text,
        color: 'rgba(255,255,255,1)',
        font: 'Bold 50px Arial',
        width: 5,
        height: 3,
    });
});
// polyfill
if (!Date.now) {
    Date.now = function () { return new Date().getTime(); };
}

//# sourceMappingURL=functions.js.map
