import { Container } from 'pixi.js';
import { CircleShape } from './Box2dAlias';
import { Box2dObject, IBox2dObjectData, IBox2dObjectOption } from './Box2dObject';
import * as Conf from './Conf';

namespace Pixim {
	export namespace box2d {
		/*
		export interface ICircleData extends IBox2dObjectData {
			radius: number
		};
		*/
		
		export class Circle extends Box2dObject {
			//protected _box2dData: ICircleData;
			
			constructor(radius: number, options: IBox2dObjectOption = {}) {
				super(options);
				
				//this._box2dData.radius = radius;
				
				const fixtureDef = this.getFixtureDefs()[0];
				fixtureDef.shape = new CircleShape(radius * Conf.PixiToBox2d);
			}
			
			/**
			 * Create a "Circle" instance whose radius is the larger width or height of the "PIXI.Container" instance at that point.
			 * Note that if you change the shape of the "PIXI.Container" instance after creating this method, the appearance and collision detection will not match.
			 */
			static from(pixi: Container, options: IBox2dObjectOption = {}) {
				const b2d = new Circle(Math.max(pixi.width / 2, pixi.height/ 2), options);
				
				const c = b2d.addChild(new PIXI.Container());
				c.addChild(pixi);
				
				const b = b2d.getLocalBounds();
				c.x = -b.x - pixi.width / 2;
				c.y = -b.y - pixi.height / 2;
				
				return b2d;
			}
		}
	}
}

/**
 * @ignore
 */
export import Circle = Pixim.box2d.Circle;

/**
 * @ignore
 */
//export import ICircleData = Pixim.box2d.ICircleData;