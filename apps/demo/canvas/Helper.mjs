import Base       from '../../../node_modules/neo.mjs/src/core/Base.mjs';
import * as Three from '../../../node_modules/three/src/Three.js';

/**
 * @class Demo.canvas.Helper
 * @extends Neo.core.Base
 * @singleton
 */
class Helper extends Base {
    static config = {
        /**
         * @member {String} className='Demo.canvas.Helper'
         * @protected
         */
        className: 'Demo.canvas.Helper',
        /**
         * Remote method access for other workers
         * @member {Object} remote
         * @protected
         */
        remote: {
            app: [
                'setupScene'
            ]
        },
        /**
         * @member {Boolean} singleton=true
         * @protected
         */
        singleton: true
    }

    /**
     * @param {Object} config
     */
    construct(config) {
        super.construct(config);

        console.log(Three);
        console.log(Three.WebGLRenderer.prototype);
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async setupScene(canvasId) {
        let camera = new Three.OrthographicCamera(0, 0, 900, 600, -10000, 10000),
            canvas = Neo.currentWorker.map[canvasId],
            renderer, scene, world;

        camera.position.z = 2.5;

        scene = new Three.Scene();
        scene.background = new Three.Color(0.0);
        scene.add(camera);

        console.log(Neo.currentWorker.map[canvasId]);

        renderer = new Three.WebGLRenderer({antialias: true, canvas, depthBuffer: true});
        renderer.setPixelRatio(1);

        world = new Three.Object3D();
        scene.add(world);

        console.log(scene)
    }
}

let instance = Neo.applyClassConfig(Helper);

export default instance;
