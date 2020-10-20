import { Ticker } from 'pixi.js';
import { Container as PiximContainer } from '@tawaship/pixim.js';

namespace Pixim {
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
export import IInitializeOption = Pixim.box2d.IInitializeOption;

/**
 * @ignore
 */
export const initializeOption: Pixim.box2d.IInitializeOption = {
	ticker: null
};