import * as _PIXI from 'pixi.js';
import { CircleShape } from './Box2dAlias';
import { World } from './World';
import { Box2dObject, IBox2dObjectData, IBox2dObjectOption } from './Box2dObject';
import * as Conf from './Conf';

namespace Pixim {
	export namespace box2d {
		export interface ICircleData extends IBox2dObjectData {
			radius: number
		};
		
		export class Circle extends Box2dObject {
			protected _box2dData: ICircleData;
			
			constructor(radius: number, isStatic: boolean, pixi: _PIXI.Container, options: IBox2dObjectOption = {}) {
				super(isStatic, options);
				
				this._box2dData.radius = radius;
				
				const fixtureDef = this.getFixtureDefs()[0];
				
				fixtureDef.shape = new CircleShape(radius * Conf.PixiToBox2d);
				this.addChild(pixi);
			}
			
			get radius() {
				return this._box2dData.radius;
			}
		}
	}
}

/**
 * @ignore
 */
export import Circle = Pixim.box2d.Circle;