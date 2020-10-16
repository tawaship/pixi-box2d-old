import * as _PIXI from 'pixi.js';
import * as _Pixim from '@tawaship/pixim.js';
import { BodyDef, FixtureDef, Body } from './Box2dAlias';
import { Box2dToPixi, PixiToBox2d } from './Conf';
import { events } from './events';

namespace Pixim {
	export namespace box2d {
		export interface IBox2dObjectOption {
			density?: number,
			friction?: number,
			restitution?: number,
			
			/**
			 * The logical sum of the bits representing the collision detection category to which it belongs.
			 */
			categoryBits?: number,
			
			/**
			 * The logical sum of the "categoryBits" for which collision detection with itself is performed.
			 */
			maskBits?: number,
			
			/**
			 * Whether it is a sensor that judges only the overlap of coordinates.
			 */
			isSensor?: boolean
		};
		
		/**
		 * @private
		 */
		type TBox2dObjectBody = Body | null;
		
		export interface IBox2dObjectData {
			id: number,
			body: TBox2dObjectBody,
			bodyDef: BodyDef,
			fixtureDefs: FixtureDef[]
		};
		
		/**
		 * @ignore
		 */
		function createBodyDef(isDynamic: boolean = false) {
			const bodyDef = new BodyDef();
			isDynamic ? bodyDef.type = Body.b2_dynamicBody : Body.b2_staticBody;
			
			return bodyDef;
		}
		
		/**
		 * @ignore
		 */
		const dynamicBodyDef: BodyDef = createBodyDef(true);
		
		/**
		 * @ignore
		 */
		const staticBodyDef: BodyDef = createBodyDef(false);
		
		/**
		 * @ignore
		 */
		function createFixtureDef(options: IBox2dObjectOption = {}, pixi: _PIXI.Container) {
			const fixtureDef = new FixtureDef();
			
			fixtureDef.density = typeof(options.density) === 'number' ? options.density : fixtureDef.density;
			fixtureDef.friction = typeof(options.friction) === 'number' ? options.friction : fixtureDef.friction;
			fixtureDef.restitution = typeof(options.restitution) === 'number' ? options.restitution : fixtureDef.restitution;
			fixtureDef.filter.categoryBits = typeof(options.categoryBits) === 'number' ? options.categoryBits : fixtureDef.filter.categoryBits;
			fixtureDef.filter.maskBits = typeof(options.maskBits) === 'number' ? options.maskBits : fixtureDef.filter.maskBits;
			fixtureDef.isSensor = !!options.isSensor;
			fixtureDef.userData = pixi;
			
			return fixtureDef;
		}
		
		/**
		 * @ignore
		 */
		const descriptors = {
			positionX: Object.getOwnPropertyDescriptor(_PIXI.ObservablePoint.prototype, 'x'),
			positionY: Object.getOwnPropertyDescriptor(_PIXI.ObservablePoint.prototype, 'y'),
			positionSet: _PIXI.ObservablePoint.prototype.set,
			rotation: Object.getOwnPropertyDescriptor(_PIXI.DisplayObject.prototype, 'rotation')
		};
		
		export type TContactDelegate = (opponent: Box2dObject) => void;
		
		export interface IBox2dObjectContact {
			on(event: typeof events.BeginContact, listener: TContactDelegate): this;
			on(event: typeof events.EndContact, listener: TContactDelegate): void;
			on(event: typeof events.PreSolve, listener: TContactDelegate): void;
			on(event: typeof events.PostSolve, listener: TContactDelegate): void;
		}
		
		/**
		 * @see http://pixijs.download/release/docs/PIXI.Container.html
		 */
		export class Box2dObject extends _PIXI.Container implements IBox2dObjectContact {
			protected _box2dData: IBox2dObjectData;
			private static _id: number = 0;
			
			constructor(isStatic: boolean = false, options: IBox2dObjectOption = {}) {
				super();
				
				this._box2dData = {
					id: Box2dObject._id++,
					body: null,
					bodyDef: isStatic ? staticBodyDef : dynamicBodyDef,
					fixtureDefs: [createFixtureDef(options, this)]
				};
			}
			
			getBodyDef() {
				return this._box2dData.bodyDef;
			}
			
			getFixtureDefs() {
				return this._box2dData.fixtureDefs;
			}
			
			get box2dID() {
				return this._box2dData.id;
			}
			
			get body() {
				return this._box2dData.body;
			}
			
			set body(body: TBox2dObjectBody) {
				this._box2dData.body = body;
			}
			
			get x() {
				return descriptors.positionX.get.call(this.position);
			}
			
			set x(x: number) {
				descriptors.positionX.set.call(this.position, x);
				
				const body = this._box2dData.body;
				if (!body) {
					return;
				}
				
				const p = body.GetPosition();
				p.x = x * PixiToBox2d;
				body.SetPosition(p);
			}
			
			get y() {
				return descriptors.positionY.get.call(this.position);
			}
			
			set y(y: number) {
				descriptors.positionY.set.call(this.position, y);
				
				const body = this._box2dData.body;
				if (!body) {
					return;
				}
				
				const p = body.GetPosition();
				p.y = y * PixiToBox2d;
				body.SetPosition(p);
			}
			
			get rotation() {
				return descriptors.rotation.get.call(this);
			}
			
			set rotation(rotation: number) {
				descriptors.rotation.set.call(this, rotation);
				
				const body = this._box2dData.body;
				if (!body) {
					return;
				}
				
				body.SetAngle(rotation);
			}
			
			/**
			 * Adds the object with the specified "category Bits" to collision detection.
			 */
			addMask(bits: number) {
				let list = this._box2dData.body.GetFixtureList();
				
				while (list) {
					const data = list.GetFilterData();
					data.maskBits |= bits;
					list.SetFilterData(data);
					
					list = list.GetNext();
				}
			}
			
			/**
			 * Set to perform collision detection with all objects.
			 */
			addAllMask() {
				let list = this._box2dData.body.GetFixtureList();
				
				while (list) {
					const data = list.GetFilterData();
					data.maskBits = 65535;
					list.SetFilterData(data);
					
					list = list.GetNext();
				}
			}
			
			/**
			 * Removes the object with the specified "category bit" from collision detection.
			 */
			removeMask(bits: number) {
				let list = this._box2dData.body.GetFixtureList();
				
				while (list) {
					const data = list.GetFilterData();
					data.maskBits ^= data.maskBits & bits;
					list.SetFilterData(data);
					
					list = list.GetNext();
				}
			}
			
			/**
			 * Set not to perform collision detection with any object.
			 */
			removeAllMask() {
				let list = this._box2dData.body.GetFixtureList();
				
				while (list) {
					const data = list.GetFilterData();
					data.maskBits = 0;
					list.SetFilterData(data);
					
					list = list.GetNext();
				}
			}
		}
	}
}

/**
 * @ignore
 */
export import Box2dObject = Pixim.box2d.Box2dObject;

/**
 * @ignore
 */
export import IBox2dObjectOption = Pixim.box2d.IBox2dObjectOption;

/**
 * @ignore
 */
export import IBox2dObjectData = Pixim.box2d.IBox2dObjectData;