import Base       from '../../../node_modules/neo.mjs/src/core/Base.mjs';
import * as Three from '../../../node_modules/three/src/Three.js';

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

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
                'render',
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
     * @member {Object} cameras={}
     */
    cameras = {}
    /**
     * @member {Object} cubes={}
     */
    cubes = {}
    /**
     * @member {Object} renderers={}
     */
    renderers = {}
    /**
     * @member {Object} scenes={}
     */
    scenes = {}
    /**
     * @member {Object} worlds={}
     */
    worlds = {}

    /**
     * @returns {Number}
     */
    getTime() {
        return (new Date().getTime() - today) / 1000.0;
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async render(canvasId) {
        let me                = this,
            camera            = me.cameras[canvasId],
            cubes             = me.cubes[canvasId],
            renderer          = me.renderers[canvasId],
            scene             = me.scenes[canvasId],
            sceneOffset       = {x: 0, y: 0},
            sceneOffsetTarget = {x: 1000, y: 1000},
            time              = me.getTime(),
            wins              = [{shape: {x: 344, y: 25, w: 1063, h: 1271}}],
            world             = me.worlds[canvasId];

        //windowManager.update();

        // calculate the new position based on the delta between current offset and new offset times a falloff value
        // (to create the nice smoothing effect)
        let falloff = .05;
        sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
        sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);

        // set the world position to the offset
        world.position.x = sceneOffset.x;
        world.position.y = sceneOffset.y;

        //let wins = windowManager.getWindows();


        // loop through all our cubes and update their positions based on current window positions
        for (let i = 0; i < cubes.length; i++) {
            let cube = cubes[i];
            let win = wins[i];

            let posTarget = {x: win.shape.x + (win.shape.w * .5), y: win.shape.y + (win.shape.h * .5)}

            cube.position.x = cube.position.x + (posTarget.x - cube.position.x) * falloff;
            cube.position.y = cube.position.y + (posTarget.y - cube.position.y) * falloff;
            cube.rotation.x = time * .5;
            cube.rotation.y = time * .3;
        }

        renderer.render(scene, camera);

        setTimeout(me.render.bind(me, canvasId), 300) // requestAnimationFrame is not supported in shared workers
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async setupScene(canvasId) {
        let me       = this,
            camera   = me.cameras[canvasId] = new Three.OrthographicCamera(0, 0, 900, 600, -10000, 10000),
            canvas   = Neo.currentWorker.map[canvasId],
            renderer = me.renderers[canvasId] = new Three.WebGLRenderer({antialias: true, canvas, depthBuffer: true}),
            scene    = me.scenes[canvasId] = new Three.Scene();

        camera.position.z = 2.5;

        scene.background = new Three.Color(0.0);
        scene.add(camera);

        renderer.setPixelRatio(1);

        me.worlds[canvasId] = new Three.Object3D();
        scene.add(me.worlds[canvasId]);
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async updateNumberOfCubes(canvasId) {
        let me    = this,
            i     = 0,
            //wins  = windowManager.getWindows(),
            wins  = [{shape: {x: 344, y: 25, w: 1063, h: 1271}}],
            world = me.worlds[canvasId];

        // remove all cubes
        me.cubes[canvasId]?.forEach(cube => {
            world.remove(cube)
        })

        me.cubes[canvasId] = [];

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

            world.add(cube);
            me.cubes[canvasId].push(cube);
        }
    }
}

let instance = Neo.applyClassConfig(Helper);

export default instance;
