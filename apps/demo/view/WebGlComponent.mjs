import Canvas from '../../../node_modules/neo.mjs/src/component/Canvas.mjs';

/**
 * @class Demo.view.WebGlComponent
 * @extends Neo.component.Canvas
 */
class WebGlComponent extends Canvas {
    static config = {
        /**
         * @member {String} className='Demo.view.WebGlComponent'
         * @protected
         */
        className: 'Demo.view.WebGlComponent',
        style: {overflow: 'auto'}
    }

    /**
     * @param {Object} config
     */
    construct(config) {
        super.construct(config);

        let me = this;

        me.addDomListeners({
            resize: me.onResize,
            scope : me
        })
    }

    /**
     * Triggered after the offscreenRegistered config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    async afterSetOffscreenRegistered(value, oldValue) {
        if (value) {
            let canvasId = this.getCanvasId(),
                winData  = await Neo.Main.getWindowData();

            console.log(winData);

            await Demo.canvas.Helper.setupScene(canvasId)
            await Demo.canvas.Helper.updateNumberOfCubes(canvasId)
            await Demo.canvas.Helper.render(canvasId)
        }
    }

    /**
     * @param {Object} data
     */
    onResize(data) {
        let id              = this.getCanvasId(),
            {height, width} = data.contentRect;

        Demo.canvas.Helper.updateDimensions({id, height, width})
    }
}

Neo.applyClassConfig(WebGlComponent);

export {WebGlComponent as default};
