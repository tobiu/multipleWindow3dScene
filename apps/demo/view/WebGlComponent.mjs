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
        className: 'Demo.view.WebGlComponent'
    }

    /**
     * Triggered after the offscreenRegistered config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    async afterSetOffscreenRegistered(value, oldValue) {
        if (value) {
            await Demo.canvas.Helper.setupScene(this.getCanvasId())
        }
    }
}

Neo.applyClassConfig(WebGlComponent);

export {WebGlComponent as default};
