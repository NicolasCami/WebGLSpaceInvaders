define(["require", "exports", "./materialservice"], function (require, exports, materialservice_1) {
    "use strict";
    var MeshService = (function () {
        function MeshService() {
        }
        MeshService.init = function () {
            MeshService.meshes = {};
            // block
            MeshService.meshes.block = [];
            MeshService.meshes.block.push();
            var blockGeometries = [
                new THREE.BoxGeometry(0.6, 0.6, 0.5),
                new THREE.BoxGeometry(0.6, 0.6, 0.6),
                new THREE.BoxGeometry(0.6, 0.6, 0.7),
                new THREE.BoxGeometry(0.6, 0.6, 0.8),
                new THREE.BoxGeometry(0.6, 0.6, 0.9),
                new THREE.BoxGeometry(0.6, 0.6, 1.0),
            ];
            blockGeometries.forEach(function (geometry) {
                materialservice_1.MaterialService.getByName('block').forEach(function (material) {
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.castShadow = true;
                    MeshService.meshes.block.push(mesh);
                });
            });
            // pad
            MeshService.meshes['pad'] = [MeshService.createMesh({
                    content: ',          **      **,         *  *    *  *,         *  *    *  *,          **      **,          **      **,         *  *    *  *,         *  *    *  *,          **      **/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/***                        ***,   **     **      **     **,     **  ************  **,       ****************,         ************,         ************,       ****************,     **  ************  **,   **     **      **     **,***                        ***/*                            *,          **      **,         **** ** ****,         ************,         ************,         ************,         ************,         ************,          **      **,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */*                            *,,              **,            ******,            ******,            ******,            ******,              **,,*                            */,,              **,            ******,            ******,            ******,            ******,              **/,,              **,            ******,            ******,            ******,            ******,              **/,,,             ****,            ******,            ******,             ****,/,,,             ****,            ******,            ******,             ****,/,,,              **,             ****,             ****,              **/',
                    modelSize: { x: 1.5, y: 0.75, z: 1.0 },
                    material: materialservice_1.MaterialService.getByName('pad'),
                    blockSize: 0.05,
                    axe: 'y',
                })];
            // alien
            MeshService.meshes['alien-bottom-1'] = [];
            MeshService.meshes['alien-bottom-2'] = [];
            MeshService.meshes['alien-middle-1'] = [];
            MeshService.meshes['alien-middle-2'] = [];
            MeshService.meshes['alien-top-1'] = [];
            MeshService.meshes['alien-top-2'] = [];
            MeshService.meshes['alien-bonus-1'] = [];
            MeshService.meshes['alien-bonus-2'] = [];
            materialservice_1.MaterialService.getByName('alien-bottom').forEach(function (material) {
                MeshService.meshes['alien-bottom-1'].push(MeshService.createMesh({
                    content: '*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
                MeshService.meshes['alien-bottom-2'].push(MeshService.createMesh({
                    content: '  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/  *    * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
            });
            materialservice_1.MaterialService.getByName('alien-middle').forEach(function (material) {
                MeshService.meshes['alien-middle-1'].push(MeshService.createMesh({
                    content: '**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
                MeshService.meshes['alien-middle-2'].push(MeshService.createMesh({
                    content: '   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****/   **  **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
            });
            materialservice_1.MaterialService.getByName('alien-top').forEach(function (material) {
                MeshService.meshes['alien-top-1'].push(MeshService.createMesh({
                    content: '   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     *',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
                MeshService.meshes['alien-top-2'].push(MeshService.createMesh({
                    content: ' **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     */ **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     */ **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     */ **     **,  *     *,  *******,***********,*** *** ***,* ******* *,*  *   *  *,  *     *',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
            });
            materialservice_1.MaterialService.getByName('alien-bonus').forEach(function (material) {
                MeshService.meshes['alien-bonus-1'].push(MeshService.createMesh({
                    content: '   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
                MeshService.meshes['alien-bonus-2'].push(MeshService.createMesh({
                    content: '   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******',
                    modelSize: { x: 0.8, y: 2, z: 0.4 },
                    material: [material],
                    axe: 'y',
                }));
            });
            // menu
            MeshService.meshes['menu'] = [];
            MeshService.meshes['menu'].push(MeshService.createMesh({
                content: '*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **/*        * , *      *,  * ** * , ********, ** ** **,  ******,   ****,    **',
                modelSize: { x: 0.8, y: 2, z: 0.4 },
                material: [new THREE.MeshBasicMaterial({
                        color: 0x87b073,
                        side: THREE.DoubleSide
                    })],
                axe: 'y',
            }));
            MeshService.meshes['menu'].push(MeshService.createMesh({
                content: '**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,/**        **,  ** ** **,   **  **,************,***  **  ***,************, **********,    ****,',
                modelSize: { x: 0.8, y: 2, z: 0.4 },
                material: [new THREE.MeshBasicMaterial({
                        color: 0x547289,
                        side: THREE.DoubleSide
                    })],
                axe: 'y',
            }));
            MeshService.meshes['menu'].push(MeshService.createMesh({
                content: '   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     */   ** **   ,* *     * *,* ******* *,***********, ** *** **,  *******,   *   *,  *     *',
                modelSize: { x: 0.8, y: 2, z: 0.4 },
                material: [new THREE.MeshBasicMaterial({
                        color: 0x9d70ae,
                        side: THREE.DoubleSide
                    })],
                axe: 'y',
            }));
            MeshService.meshes['menu'].push(MeshService.createMesh({
                content: '   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******/   *        *,  ***  **  ***,****************, ** ** ** ** **,  ************,   **********,     ******',
                modelSize: { x: 0.8, y: 2, z: 0.4 },
                material: [new THREE.MeshBasicMaterial({
                        color: 0xb83535,
                        side: THREE.DoubleSide
                    })],
                axe: 'y',
            }));
            // missile
            var padMissileGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
            var padBigMissileGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            MeshService.meshes['missile-alien'] = [new THREE.Mesh(padMissileGeometry, materialservice_1.MaterialService.getSingleByName('alienMissile'))];
            MeshService.meshes['missile-pad'] = [new THREE.Mesh(padMissileGeometry, materialservice_1.MaterialService.getSingleByName('padMissile'))];
            MeshService.meshes['missile-pad-big'] = [new THREE.Mesh(padBigMissileGeometry, materialservice_1.MaterialService.getSingleByName('padMissile'))];
            // bonus
            MeshService.meshes['bonus-missile'] = [MeshService.createMesh({
                    content: ',   **,  ****, ******, ******,  ****,   **/   **,  ****, ******,********,********, ******,  ****,   **/  ****, ******,********,********,********,********, ******,  ****/  ****, ******,********,********,********,********, ******,  ****/   **,  ****, ******,********,********, ******,  ****,   **/,   **,  ****, ******, ******,  ****,   **/',
                    modelSize: { x: 0.8, y: 0.8, z: 1.0 },
                    material: [new THREE.MeshPhongMaterial({ color: 0x2bb121, specular: 0xffffff, shininess: 200 })],
                    axe: 'z',
                })];
            MeshService.meshes['bonus-life'] = [MeshService.createMesh({
                    content: ',   **,  ****, ******, ******,  ****,   **/   **,  ****, ******,********,********, ******,  ****,   **/  ****, ******,********,********,********,********, ******,  ****/  ****, ******,********,********,********,********, ******,  ****/   **,  ****, ******,********,********, ******,  ****,   **/,   **,  ****, ******, ******,  ****,   **/',
                    modelSize: { x: 0.8, y: 0.8, z: 1.0 },
                    material: [new THREE.MeshPhongMaterial({ color: 0xf1eb42, specular: 0xffffff, shininess: 200 })],
                    axe: 'z',
                })];
            // world objects
            MeshService.meshes['alien-limit'] = [MeshService.createMesh({
                    content: '  ****, ******,********,********,********,********, ******,  ****/   **,  ****, ******,********,********, ******,  ****,   **/,   **,  ****, ******, ******,  ****,   **/',
                    modelSize: { x: 0.45, y: 0.45, z: 0.15 },
                    material: [new THREE.MeshPhongMaterial({ color: 0xff0040, specular: 0xffffff, shininess: 200 })],
                    blockSize: 0.05,
                    axe: 'z',
                })];
        };
        MeshService.getByName = function (name) {
            var result;
            if (name in MeshService.meshes) {
                result = MeshService.meshes[name];
            }
            else {
                throw new Error("MeshService: mesh does not exists: " + name);
            }
            return result;
        };
        MeshService.getRandomByName = function (name) {
            return randFromArray(MeshService.getByName(name)).clone();
        };
        MeshService.createMesh = function (params) {
            var filePath = typeof params.filePath !== 'undefined' ? params.filePath : '';
            var encoding = typeof params.encoding !== 'undefined' ? params.encoding : 'UTF-8';
            var content = typeof params.content !== 'undefined' ? params.content : '';
            var charEmpty = typeof params.charEmpty !== 'undefined' ? params.charEmpty : ' ';
            var charFull = typeof params.charFull !== 'undefined' ? params.charFull : '*';
            var separatorY = typeof params.separatorY !== 'undefined' ? params.separatorY : ',';
            var separatorZ = typeof params.separatorZ !== 'undefined' ? params.separatorZ : '/';
            var blockSize = typeof params.blockSize !== 'undefined' ? params.blockSize : 0.1;
            var modelSize = typeof params.modelSize !== 'undefined' ? params.modelSize : { x: 1.2, y: 1.2, z: 0.2 };
            var material = typeof params.material !== 'undefined' ? params.material : [materialservice_1.MaterialService.getSingleByName('pad')];
            var geometry = typeof params.geometry !== 'undefined' ? params.geometry : new THREE.BoxGeometry(0.1, 0.1, 0.1);
            var axe = typeof params.axe !== 'undefined' ? params.axe : 'z';
            var group = new THREE.Geometry();
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
        };
        MeshService.createTextMesh = function (params) {
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
        };
        return MeshService;
    }());
    exports.MeshService = MeshService;
});

//# sourceMappingURL=meshservice.js.map
