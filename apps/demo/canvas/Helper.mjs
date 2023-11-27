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
                'setupScene',
                'updateNumberOfCubes'
            ]
        },
        /**
         * @member {Boolean} singleton=true
         * @protected
         */
        singleton: true
    }

    /**
     * @member {Object} cubes={}
     */
    cubes = []
    /**
     * @member {Object} worlds={}
     */
    worlds = {}

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async setupScene(canvasId) {
        let camera = new Three.OrthographicCamera(0, 0, 900, 600, -10000, 10000),
            canvas = Neo.currentWorker.map[canvasId],
            renderer, scene;

        camera.position.z = 2.5;

        scene = new Three.Scene();
        scene.background = new Three.Color(0.0);
        scene.add(camera);

        renderer = new Three.WebGLRenderer({antialias: true, canvas, depthBuffer: true});
        renderer.setPixelRatio(1);

        this.worlds[canvasId] = new Three.Object3D();
        scene.add(this.worlds[canvasId])
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async updateNumberOfCubes(canvasId) {
        let me    = this,
            i     = 0,
            //wins  = windowManager.getWindows(),
            wins  = [{shape: {x: 900, y: 600, w: 300, h: 300}}, {shape: {x: 500, y: 300, w: 200, h:200}}],
            world = me.worlds[canvasId];

        // remove all cubes
        me.cubes.forEach(cube => {
            world.remove(cube)
        })

        me.cubes = [];

        // add new cubes based on the current window setup
        for (; i < wins.length; i++) {
            let win = wins[i];

            let color = new Three.Color();
            color.setHSL(i * .1, 1.0, .5);

            let s = 100 + i * 50;
            let cube = new Three.Mesh(
                new Three.BoxGeometry(s, s, s),
                new Three.MeshBasicMaterial({color, wireframe: true})
            );

            cube.position.x = win.shape.x + (win.shape.w * .5);
            cube.position.y = win.shape.y + (win.shape.h * .5);

            cube.position.x = 200 + i*100;
            cube.position.y = 200 + i*100;

            world.add(cube);
            me.cubes.push(cube);
        }
    }
}

let instance = Neo.applyClassConfig(Helper);

export default instance;
