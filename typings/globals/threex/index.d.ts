// Generated by typings
// Source: typings/custom/threex.d.ts
declare namespace THREEx {

    export class WindowResize {
        constructor( renderer: THREE.Renderer, camera: THREE.Camera );

        static bind( renderer: THREE.Renderer, camera: THREE.Camera ): WindowResize;

        public stop();
    }

    export class Screenshot {

        static toDataURL( renderer: THREE.Renderer, mimetype?: string ): string;

        static bindKey( renderer: THREE.Renderer, opts?: any ): any;

    }

    export class FullScreen {

        static available(): boolean;

        static activated(): boolean;

        static request( element: HTMLElement );

        static cancel();

        static bindKey( opts?: any ): any;

    }

}
