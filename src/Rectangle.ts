import { Container as PixiContainer } from 'pixi.js';
import { Vec2, PolygonShape } from './Box2dAlias';
import { Box2dObject, IBox2dObjectData, IBox2dObjectOption } from './Box2dObject';
import * as Conf from './Conf';

namespace PIXI {
	export namespace box2d {
		/*
		export interface IRectangleData extends IBox2dObjectData {
			width: number,
			height: number
		};
		*/
		
		export class Rectangle extends Box2dObject {
			//protected _box2dData: IRectangleData;
			
			constructor(width: number, height: number, options: IBox2dObjectOption = {}) {
				super(options);
				
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
			}
			
			/**
			 * Create a "Rectangle" instance that circumscribes the shape of the "PIXI.Container" instance at that point.
			 * Note that if you change the shape of the "PIXI.Container" instance after creating this method, the appearance and collision detection will not match.
			 */
			static from(pixi: PixiContainer, options: IBox2dObjectOption = {}) {
				const b2d = new Rectangle(pixi.width, pixi.height, options);
				
				const c = b2d.addChild(new PixiContainer());
				c.addChild(pixi);
				
				const b = b2d.getLocalBounds();
				c.x = -b.x;
				c.y = -b.y;
				
				return b2d;
			}
		}
	}
}

/**
 * @ignore
 */
export import Rectangle = PIXI.box2d.Rectangle;

/**
 * @ignore
 */
//export import IRectangleData = PIXI.box2d.IRectangleData;