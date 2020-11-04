import { Vec2, PolygonShape } from './Box2dAlias';
import { Box2dObject, IBox2dObjectData, IBox2dObjectOption } from './Box2dObject';
import * as Conf from './Conf';

namespace PIXI {
	export namespace box2d {
		/*
		export interface IEdgeData extends IBox2dObjectData {
			vertices: Vec2[]
		};
		*/
		
		export class Edge extends Box2dObject {
			//protected _box2dData: IEdgeData;
			
			constructor(to: Vec2, options: IBox2dObjectOption = {}) {
				super(options);
				
				//this._box2dData.vertices = vertices;
				
				const fixtureDef = this.getFixtureDefs()[0];
				fixtureDef.shape = new PolygonShape();
				fixtureDef.shape.SetAsEdge({ x: 0, y: 0 }, { x: to.x * Conf.PixiToBox2d, y: to.y * Conf.PixiToBox2d });
			}
		}
	}
}

/**
 * @ignore
 */
export import Edge = PIXI.box2d.Edge;

/**
 * @ignore
 */
//export import IEdgeData = PIXI.box2d.IEdgeData;