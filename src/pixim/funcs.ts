import { IPrepareOption, options as _options } from './Conf';

namespace PIXI {
	export namespace box2d {
		export function setConfig(options: IPrepareOption = {}) {
			_options.useDebugDraw = options.useDebugDraw;
		}
	}
}

/**
 * @ignore
 */
export { IPrepareOption };

/**
 * @ignore
 */
export import setConfig = PIXI.box2d.setConfig;