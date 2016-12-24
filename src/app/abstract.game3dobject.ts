abstract class Game3dObject {

    static increment = 0.05;

    size: THREE.Vector3;
    velocity: THREE.Vector3;
    initialPosition: THREE.Vector3;
    mesh: THREE.Mesh | THREE.PointCloud;

    constructor(size: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0),
                velocity: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0),
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        this.size = size;
        this.velocity = velocity;
        this.initialPosition = position;

    }

    protected init() {
        this.initMesh();
        this.mesh.position.copy(this.initialPosition);

        Game.getInstance().scene.add(this.mesh);
    }

    abstract initMesh();

    public animate() {
        this.mesh.position.add(this.velocity);
    }

    public getX = function() : number {
        return this.mesh.position.x;
    }

    public getY = function() : number {
      return this.mesh.position.y;
    }

    public minX = function() : number {
      return this.mesh.position.x-(this.size.x/2);
    }

    public minY = function() : number {
      return this.mesh.position.y-(this.size.y/2);
    }

    public minZ = function() : number {
      return this.mesh.position.z-(this.size.z/2);
    }

    public maxX = function() : number {
      return this.mesh.position.x+(this.size.x/2);
    }

    public maxY = function() : number {
      return this.mesh.position.y+(this.size.y/2);
    }

    public maxZ = function() : number {
      return this.mesh.position.z+(this.size.z/2);
    }

}