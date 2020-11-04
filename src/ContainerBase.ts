import { Container as PixiContainer } from 'pixi.js';

namespace PIXI {
	export namespace box2d {
		/**
		 * @see http://pixijs.download/release/docs/PIXI.Container.html
		 */
		export class ContainerBase extends PixiContainer {}
	}
}

/**
 * @ignore
 */
export import ContainerBase = PIXI.box2d.ContainerBase;