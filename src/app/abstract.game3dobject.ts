abstract class Game3dObject {

    static increment = 0.05;

    size: THREE.Vector3;
    velocity: THREE.Vector3;
    initialPosition: THREE.Vector3;
    mesh: THREE.Mesh | THREE.PointCloud;
    bb: THREE.Box3;

    constructor(velocity: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0),
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        this.velocity = velocity;
        this.initialPosition = position;

    }

    protected init() {
        this.initMesh();

        if(this.mesh) {
            this.mesh.position.copy(this.initialPosition);
            this.bb = new THREE.Box3().setFromObject(this.mesh);
            this.size = (this.bb.size()) ? this.bb.size() : new THREE.Vector3(0,0,0);
        }

        Game.getInstance().scene.add(this.mesh);
    }

    abstract initMesh();

    public animate() {
        this.mesh.position.add(this.velocity);
    }

    public getX() : number {
        return this.mesh.position.x;
    }

    public getY() : number {
      return this.mesh.position.y;
    }

    public getSize() : THREE.Vector3 {
      return this.size;
    }

    public minX() : number {
      return this.mesh.position.x-(this.size.x/2);
    }

    public minY() : number {
      return this.mesh.position.y-(this.size.y/2);
    }

    public minZ() : number {
      return this.mesh.position.z-(this.size.z/2);
    }

    public maxX() : number {
      return this.mesh.position.x+(this.size.x/2);
    }

    public maxY() : number {
      return this.mesh.position.y+(this.size.y/2);
    }

    public maxZ() : number {
      return this.mesh.position.z+(this.size.z/2);
    }

    public collision(obj: Game3dObject) : boolean {
        let result : boolean = false;
        result = (obj.maxX() >= this.minX() && obj.minX() <= this.maxX())
                 && (obj.maxY() >= this.minY() && obj.minY() <= this.maxY())
                 && (obj.maxZ() >= this.minZ() && obj.minZ() <= this.maxZ());

        if(this.bb && obj.bb) {
            // console.log(this.bb.size(),'/',this.size);
            // result = this.bb.intersect(obj.bb);
        }

        return result;
    }

}