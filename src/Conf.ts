import { Ticker } from 'pixi.js';

namespace PIXI {
	export namespace box2d {
		export interface IInitializeOption {
			/**
			 * Ticker that synchronizes the processing of box2dweb.
			 * 
			 * @see http://pixijs.download/v5.3.2/docs/PIXI.Ticker_.html
			 */
			ticker?: Ticker
		}
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
export import IInitializeOption = PIXI.box2d.IInitializeOption;

/**
 * @ignore
 */
export const initializeOption: PIXI.box2d.IInitializeOption = {
	ticker: null
};