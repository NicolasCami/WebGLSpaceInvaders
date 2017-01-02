class ScoreAnimation extends Game3dObject {

    static INCREMENT = 0.05;
    static LIFE_TIME = 2000.0;

    time: number;
    text: string;
    width: number;
    mesh: THREE.Mesh;

    constructor(text: string = '',
                position: THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0),
                width: number = 5) {

        super(new THREE.Vector3(0.0, 0.0, ScoreAnimation.INCREMENT), position);
        
        this.time = Date.now();
        this.text = text;
        this.width = width;

        this.init();

    }

    public initMesh() {
        if(this.text in textData) {
            this.mesh = textData[this.text].clone();
        }
        else {
            textData[this.text] = textMesh({
                text:this.text,
                color:'rgba(255,255,255,1)',
                font:'Bold 50px Arial',
                width: this.width,
                height: 3,
            });
            this.mesh = textData[this.text].clone();
        }

        this.mesh.rotation.x = Math.PI / 2;
    }

    public animate() : boolean {
        this.mesh.position.add(this.velocity);
        this.mesh.rotation.z += 0.1;
        
        if(this.time + ScoreAnimation.LIFE_TIME < Date.now()) {
            return true;
        }
        return false;
    }

    public getDirection() : THREE.Vector3 {
        return this.velocity;
    }
}
