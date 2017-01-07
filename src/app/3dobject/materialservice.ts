export class MaterialService {

    private static material: any;
    private static materials: any;

    static init() {

        MaterialService.material = {};
        MaterialService.materials = {};

        let groundTexture = THREE.ImageUtils.loadTexture('src/medias/images/pad.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 4, 4 );

        MaterialService.material = {
            pad: new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('src/medias/images/pad.png')
                }),
            block: new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('src/medias/images/block.jpg')
                }),
            padMissile: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
            alienMissile: new THREE.MeshLambertMaterial({ color: 0xff0000 }),
            ground: new THREE.MeshPhongMaterial({
                    map: groundTexture,
                    side: THREE.DoubleSide, 
                    specular: 0xffffff, 
                    shininess: 200
                })
        };

        MaterialService.materials.pad = [
            MaterialService.material.pad
        ];

        MaterialService.materials.block = [
            new THREE.MeshPhongMaterial({ color: 0xff6400, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0xff8b40, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0xffaa73, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0xa64100, specular: 0xffffff, shininess: 200 }),
        ];

        MaterialService.materials['alien-bottom'] = [
            new THREE.MeshPhongMaterial({ color: 0x87b073, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0x85b66c, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0x689d4e, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0x658954, specular: 0xffffff, shininess: 200 }),
        ];
        MaterialService.materials['alien-middle'] = [
            new THREE.MeshPhongMaterial({ color: 0x547289, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0x5789b0, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0x3d6686, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0x7093ae, specular: 0xffffff, shininess: 200 }),
        ];
        MaterialService.materials['alien-top'] = [
            new THREE.MeshPhongMaterial({ color: 0x9d70ae, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0xc096d0, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0xaf72c5, specular: 0xffffff, shininess: 200 }),
            new THREE.MeshPhongMaterial({ color: 0xb08bbd, specular: 0xffffff, shininess: 200 }),
        ];
        MaterialService.materials['alien-bonus'] = [
            new THREE.MeshLambertMaterial({ color: 0xb83535 }),
            new THREE.MeshLambertMaterial({ color: 0xdb4f4f }),
            new THREE.MeshLambertMaterial({ color: 0xb12727 }),
            new THREE.MeshLambertMaterial({ color: 0xdd1919 }),
        ];

    }

    static getSingleByName(name: string) {

        let result;

        if(name in MaterialService.material) {
            result = MaterialService.material[name];
        }
        else {
            throw new Error("MaterialService: material does not exists: " + name);
        }

        return result;

    }

    static getByName(name: string) {

        let result;

        if(name in MaterialService.materials) {
            result = MaterialService.materials[name];
        }
        else {
            throw new Error("MaterialService: material does not exists: " + name);
        }

        return result;

    }

}
