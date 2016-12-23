class Explosion {

    static LIFE_TIME = 1000.0;

    particleNb: number;
    particleSize: number;
    particleColor: number;
    particles: THREE.Geometry;
    time: number;
    mesh: THREE.PointCloud;
    size: any;
    game: Game;

    constructor(params: any, game: Game) {
        this.time = Date.now();
        
        if(typeof params.mesh !== 'undefined') {
            this.mesh = params.mesh.clone();
        }
        else {
            this.size = typeof params.size !== 'undefined' ? params.size : 1.0;
            this.particleNb = typeof params.particleNb !== 'undefined' ? params.particleNb : 10;
            this.particleSize = typeof params.particleSize !== 'undefined' ? params.particleSize : 0.1;
            this.particleColor = typeof params.particleColor !== 'undefined' ? params.particleColor : 0xff0000;
            this.particles = new THREE.Geometry;
            for (var p = 0; p < this.particleNb; p++) {
                var particle = new THREE.Vector3(Math.random() * this.size - (this.size/2.0), Math.random() * this.size - (this.size/2.0), Math.random() * this.size - (this.size/2.0));
                particle.velocity = new THREE.Vector3(Math.random()*1-0.5, Math.random()*1-0.5, Math.random()*1-0.5);
                this.particles.vertices.push(particle);
            }
            var particleMaterial = new THREE.PointCloudMaterial({ color: this.particleColor, size: this.particleSize });
            this.mesh = new THREE.PointCloud(this.particles, particleMaterial);
        }
        
        this.mesh.position.x = typeof params.x !== 'undefined' ? params.x : 0.0;
        this.mesh.position.y = typeof params.y !== 'undefined' ? params.y : 0.0;
        this.mesh.position.z = typeof params.z !== 'undefined' ? params.z : 0.0;

        this.game = game;
        this.game.scene.add(this.mesh);
    }

    public animate = function() {
        for(var i= 0; i < this.mesh.geometry.vertices.length; i++) {
            var particle = this.mesh.geometry.vertices[i];
            particle.add(particle.velocity);
        }
        this.mesh.geometry.verticesNeedUpdate = true;
        
        if(this.time + Explosion.LIFE_TIME < Date.now()) {
            return true;
        }
        return false;
    };
}
