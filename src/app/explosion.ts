class Explosion extends Game3dObject {

    static LIFE_TIME = 1000.0;

    particleCloudSize: number;
    particleNb: number;
    particleSize: number;
    particleColor: number;
    particles: THREE.Geometry;
    particlesVelocity: THREE.Vector3[];
    time: number;

    constructor(particleCloudSize: number = 1.0,
                particleNb : number = 10,
                particleSize : number = 0.1,
                particleColor : number = 0xff0000,
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0)) {

        super(new THREE.Vector3(0.0, 0.0, 0.0), position);
        
        this.particleCloudSize = particleCloudSize;
        this.particleNb = particleNb;
        this.particleSize = particleSize;
        this.particleColor = particleColor;
        this.particlesVelocity = [];

        this.init();

    }

    public initMesh() {
        this.particles = new THREE.Geometry;
        for (var p = 0; p < this.particleNb; p++) {
            var particle = new THREE.Vector3(Math.random() * this.particleCloudSize - (this.particleCloudSize/2.0), Math.random() * this.particleCloudSize - (this.particleCloudSize/2.0), Math.random() * this.particleCloudSize - (this.particleCloudSize/2.0));
            this.particles.vertices.push(particle);
            this.particlesVelocity.push(new THREE.Vector3(Math.random()*1-0.5, Math.random()*1-0.5, Math.random()*1-0.5));
        }
        var particleMaterial = new THREE.PointCloudMaterial({ color: this.particleColor, size: this.particleSize });
        this.mesh = new THREE.PointCloud(this.particles, particleMaterial);
    }

    public animate() : boolean {
        let geometry = <THREE.Geometry> this.mesh.geometry;
        for(var i= 0; i < geometry.vertices.length; i++) {
            var particle = geometry.vertices[i];
            particle.add(this.particlesVelocity[i]);
        }
        geometry.verticesNeedUpdate = true;
        
        if(this.time + Explosion.LIFE_TIME < Date.now()) {
            return true;
        }
        return false;
    }
}
