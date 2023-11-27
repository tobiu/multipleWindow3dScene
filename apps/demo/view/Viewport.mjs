import BaseViewport from '../../../node_modules/neo.mjs/src/container/Viewport.mjs';

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
         * @member {Object[]} items
         */
        items: [],
        /*
         * @member {Object} layout={ntype:'fit'}
         */
        layout: {ntype: 'fit'}
    }
}

Neo.applyClassConfig(Viewport);

export default Viewport;
