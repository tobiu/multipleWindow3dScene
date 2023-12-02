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
                'updateDimensions',
                'updateNumberOfCubes'
            ]
        },
        /**
         * @member {Boolean} singleton=true
         * @protected
         */
        singleton: true
    }

    cameras           = {}
    components        = {}
    cubes             = {}
    renderers         = {}
    sceneOffset       = {}
    sceneOffsetTarget = {}
    scenes            = {}
    worlds            = {}

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
            component         = me.components[canvasId],
            cubes             = me.cubes[canvasId],
            renderer          = me.renderers[canvasId],
            scene             = me.scenes[canvasId],
            sceneOffset       = me.sceneOffset[canvasId],
            sceneOffsetTarget = me.sceneOffsetTarget[canvasId],
            time              = me.getTime(),
            world             = me.worlds[canvasId];

        // calculate the new position based on the delta between current offset and new offset times a falloff value
        // (to create the nice smoothing effect)
        let falloff = .05;
        sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
        sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);

        // set the world position to the offset
        world.position.x = sceneOffset.x;
        world.position.y = sceneOffset.y;

        // loop through all our cubes and update their positions based on current window positions
        for (let i = 0; i < cubes.length; i++) {
            let cube = cubes[i];

            let posTarget = {x: component.screenLeft + (component.width * .5), y: component.screenTop + (component.height * .5)}

            cube.position.x = cube.position.x + (posTarget.x - cube.position.x) * falloff;
            cube.position.y = cube.position.y + (posTarget.y - cube.position.y) * falloff;
            cube.rotation.x = time * .5;
            cube.rotation.y = time * .3;

            // console.log(world.position, cube.position);
        }

        renderer.render(scene, camera);

        setTimeout(me.render.bind(me, canvasId), 10) // requestAnimationFrame is not supported inside shared workers
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async setupScene(canvasId) {
        let me              = this,
            component       = me.components[canvasId],
            {height, width} = component,
            camera          = me.cameras[canvasId]   = new Three.OrthographicCamera(0, width, 0, height, -10000, 10000),
            canvas          = Neo.currentWorker.map[canvasId],
            renderer        = me.renderers[canvasId] = new Three.WebGLRenderer({antialias: true, canvas, depthBuffer: true}),
            scene           = me.scenes[canvasId]    = new Three.Scene();

        me.sceneOffset[canvasId]       = {x: 0, y: 0};
        me.sceneOffsetTarget[canvasId] = {x: -component.screenLeft, y: -component.screenTop};

        canvas.style = {}; // ThreeJS breaks otherwise
        camera.position.z = 2.5;

        scene.background = new Three.Color(0.0);
        scene.add(camera);

        renderer.setPixelRatio(2);

        me.worlds[canvasId] = new Three.Object3D();
        scene.add(me.worlds[canvasId]);

        renderer.setSize(width, height);
        camera.updateProjectionMatrix();

        console.log(canvas)
    }

    /**
     * @param {Object} data
     */
    updateDimensions(data) {
        let me = this,
            id = data.id;

        delete data.id;

        if (!me.components[id]) {
            me.components[id] = data
        } else {
            Object.assign(me.components[id], data);

            if (data.height) { // resize
                let {height, width} = data,
                    camera = me.cameras[id];

                camera.bottom = height;
                camera.right  = width;

                camera.updateProjectionMatrix();
                me.renderers[id].setSize( width, height )
            }

            if (data.screenLeft) { // window movement
                me.sceneOffsetTarget[id] = {x: -data.screenLeft, y: -data.screenTop}
            }
        }
    }

    /**
     * @param {String} canvasId
     * @returns {Promise<void>}
     */
    async updateNumberOfCubes(canvasId) {
        let me        = this,
            component = me.components[canvasId],
            cubes     = me.cubes[canvasId],
            i         = 0,
            world     = me.worlds[canvasId];

        // remove all cubes
        cubes?.forEach(cube => {
            world.remove(cube)
        })

        me.cubes[canvasId] = [];

        // add new cubes based on the current window setup
        for (; i < Object.keys(me.components).length; i++) {
            let color = new Three.Color();
            color.setHSL(i * .1, 1.0, .5);

            let s = 100 + i * 50;
            let cube = new Three.Mesh(
                new Three.BoxGeometry(s, s, s),
                new Three.MeshBasicMaterial({color, wireframe: true})
            );

            cube.position.x = component.screenLeft + (component.width  * .5);
            cube.position.y = component.screenTop  + (component.height * .5);

            world.add(cube);
            me.cubes[canvasId].push(cube);
        }
    }
}

let instance = Neo.applyClassConfig(Helper);

export default instance;
