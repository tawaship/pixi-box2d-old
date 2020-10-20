import { Container as PixiContainer } from 'pixi.js';
import { Vec2, PolygonShape } from './Box2dAlias';
import { Box2dObject, IBox2dObjectData, IBox2dObjectOption } from './Box2dObject';
import * as Conf from './Conf';

namespace Pixim {
	export namespace box2d {
		/*
		export interface IPolygonData extends IBox2dObjectData {
			vertices: Vec2[]
		};
		*/
		
		export class Polygon extends Box2dObject {
			//protected _box2dData: IPolygonData;
			
			constructor(vertices: Vec2[], pixi: PixiContainer, options: IBox2dObjectOption = {}) {
				super(options);
				
				//this._box2dData.vertices = vertices;
				
				const fixtureDef = this.getFixtureDefs()[0];
				fixtureDef.shape = new PolygonShape();
				fixtureDef.shape.SetAsArray(vertices);
			}
		}
	}
}

/**
 * @ignore
 */
export import Polygon = Pixim.box2d.Polygon;

/**
 * @ignore
 */
//export import IPolygonData = Pixim.box2d.IPolygonData;