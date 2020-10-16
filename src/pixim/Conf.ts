import { Ticker } from 'pixi.js';

namespace Pixim {
	export namespace box2d {
		export interface IInitOption {
			/**
			 * Ticker that synchronizes the processing of box2dweb.
			 * 
			 * @see http://pixijs.download/v5.3.2/docs/PIXI.Ticker_.html
			 */
			ticker?: Ticker
		};
	}
}

/**
 * @ignore
 */
export const Box2dToPixi = 30;

/**
 * @ignore
 */
export const PixiToBox2d = 1 / Box2dToPixi;

/**
 * @ignore
 */
export import IInitOption = Pixim.box2d.IInitOption;

/**
 * @ignore
 */
export const initOption: Pixim.box2d.IInitOption = {
	ticker: null
};