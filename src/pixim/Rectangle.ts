import * as _PIXI from 'pixi.js';
import { Vec2, PolygonShape } from './Box2dAlias';
import { World } from './World';
import { Box2dObject, IBox2dObjectData, IBox2dObjectOption } from './Box2dObject';
import * as Conf from './Conf';

/**
 * @ignore
 */


namespace Pixim {
	export namespace box2d {
		export interface IRectangleData extends IBox2dObjectData {
			width: number,
			height: number
		};
		
		export class Rectangle extends Box2dObject {
			protected _box2dData: IRectangleData;
			
			constructor(width: number, height: number, isStatic: boolean, pixi: _PIXI.Container, options: IBox2dObjectOption = {}) {
				super(isStatic, options);
				
				this._box2dData.width = width;
				this._box2dData.height = height;
				
				width *= Conf.PixiToBox2d;
				height *= Conf.PixiToBox2d;
				
				const fixtureDef = this.getFixtureDefs()[0];
				fixtureDef.shape = new PolygonShape();
				fixtureDef.shape.SetAsArray([
					new Vec2(0, 0),
					new Vec2(width, 0),
					new Vec2(width, height),
					new Vec2(0, height)
				]);
				
				this.addChild(pixi);
			}
		}
	}
}

/**
 * @ignore
 */
export import Rectangle = Pixim.box2d.Rectangle;