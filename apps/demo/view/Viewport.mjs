import BaseViewport   from '../../../node_modules/neo.mjs/src/container/Viewport.mjs';
import WebGlComponent from './WebGlComponent.mjs';

/**
 * @class Demo.view.Viewport
 * @extends Neo.container.Viewport
 */
class Viewport extends BaseViewport {
    static config = {
        /**
         * @member {String} className='Demo.view.Viewport'
         * @protected
         */
        className: 'Demo.view.Viewport',
        /**
         * @member {Object[]|Neo.component.Base[]} items=[WebGlComponent]
         */
        items: [WebGlComponent],
        /*
         * @member {Object} layout={ntype:'fit'}
         */
        layout: {ntype: 'fit'}
    }

    /**
     * @param {Object} config
     */
    construct(config) {
        super.construct(config);

        let me = this;

        me.on('windowPositionChange', me.onWindowPositionChange, me);

        Neo.main.addon.WindowPosition.registerWindow({
            appName: me.appName
        })
    }

    /**
     * @param {Object} data
     */
    onWindowPositionChange(data) {
        console.log('onWindowPositionChange', data)
    }
}

Neo.applyClassConfig(Viewport);

export default Viewport;
