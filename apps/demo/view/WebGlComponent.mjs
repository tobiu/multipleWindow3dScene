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
        /**
         * @member {Object} style={overflow:'auto'}
         */
        style: {overflow: 'auto'}
    }

    /**
     *
     */
    async onConstructed() {
        super.onConstructed();

        let me = this;

        me.addDomListeners({
            resize: me.onResize,
            scope : me
        });

        // ensure the viewport instance got created
        await me.timeout(1);

        me.app.mainView.on('windowPositionChange', me.onWindowPositionChange, me)
    }

    /**
     * Triggered after the offscreenRegistered config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    async afterSetOffscreenRegistered(value, oldValue) {
        if (value) {
            let me                      = this,
                canvasId                = me.getCanvasId(),
                {height, width}         = await me.getDomRect(),
                {screenLeft, screenTop} = await Neo.Main.getWindowData();

            await Demo.canvas.Helper.updateDimensions({id: canvasId, height, width, screenLeft, screenTop});
            await Demo.canvas.Helper.setupScene(canvasId);
            await Demo.canvas.Helper.updateNumberOfCubes(canvasId);
            await Demo.canvas.Helper.render(canvasId)
        }
    }

    /**
     * @param {Object} data
     * @returns {Promise<void>}
     */
    onWindowPositionChange(data) {
        let id                      = this.getCanvasId(),
            {screenLeft, screenTop} = data;

        Demo.canvas.Helper.updateDimensions({id, screenLeft, screenTop})
    }

    /**
     * @param {Object} data
     * @returns {Promise<void>}
     */
    onResize(data) {
        let id              = this.getCanvasId(),
            {height, width} = data.contentRect;

        Demo.canvas.Helper.updateDimensions({id, height, width})
    }
}

Neo.applyClassConfig(WebGlComponent);

export {WebGlComponent as default};
