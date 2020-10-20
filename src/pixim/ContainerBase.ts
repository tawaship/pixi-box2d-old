import { Container as PiximContainer } from '@tawaship/pixim.js';

namespace Pixim {
	export namespace box2d {
		/**
		 * @see https://tawaship.github.io/Pixim.js/classes/pixim.container.html
		 */
		export class ContainerBase extends PiximContainer {}
	}
}

/**
 * @ignore
 */
export import ContainerBase = Pixim.box2d.ContainerBase;