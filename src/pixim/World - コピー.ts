import * as _PIXI from 'pixi.js';
import * as _Pixim from '@tawaship/pixim.js';
import { Dynamics } from 'box2dweb';

namespace Pixim {
	export namespace box2d {
		export interface A {
			body?: Dynamics.b2Body,
			bodyDef: Dynamics.b2BodyDef,
			fictureDefs: Dynamics.b2FixtureDef[]
		};
		
		/**
		 * @see http://pixijs.download/release/docs/PIXI.Container.html
		 */
		export class World extends _PIXI.Container {
			
		}
	}
}

/**
 * @ignore
 */
export import World = Pixim.box2d.World;