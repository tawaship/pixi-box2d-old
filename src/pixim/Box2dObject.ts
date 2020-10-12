import * as _PIXI from 'pixi.js';
import * as _Pixim from '@tawaship/pixim.js';
import { BodyDef, FixtureDef, Body } from './Box2dAlias';
import * as Conf from './Conf';

namespace Pixim {
	export namespace box2d {
		export interface IBox2dObjectOption {
			density?: number,
			friction?: number,
			restitution?: number,
			categoryBits?: number,
			maskBits?: number,
			isSensor?: number,
			userData?: _PIXI.Container
		};
		
		/**
		 * @private
		 */
		type TBox2dObjectBody = Body | null;
		
		export interface IBox2dObjectData {
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
		function createFixtureDef(options: IBox2dObjectOption = {}) {
			const fixtureDef = new FixtureDef();
			
			fixtureDef.density = typeof(options.density) === 'number' ? options.density : fixtureDef.density;
			fixtureDef.friction = typeof(options.friction) === 'number' ? options.friction : fixtureDef.friction;
			fixtureDef.restitution = typeof(options.restitution) === 'number' ? options.restitution : fixtureDef.restitution;
			fixtureDef.filter.categoryBits = typeof(options.categoryBits) === 'number' ? options.categoryBits : fixtureDef.filter.categoryBits;
			fixtureDef.filter.maskBits = typeof(options.maskBits) === 'number' ? options.maskBits : fixtureDef.filter.maskBits;
			fixtureDef.isSensor = options.isSensor || fixtureDef.isSensor;
			fixtureDef.userData = options.userData || fixtureDef.userData;
			
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
		
		/**
		 * @see http://pixijs.download/release/docs/PIXI.Container.html
		 */
		export class Box2dObject extends _PIXI.Container {
			protected _box2dData: IBox2dObjectData;
			
			constructor(isStatic: boolean = false, options: IBox2dObjectOption = {}) {
				super();
				
				options.userData = options.userData || this;
				
				this._box2dData = {
					body: null,
					bodyDef: isStatic ? staticBodyDef : dynamicBodyDef,
					fixtureDefs: [createFixtureDef(options)]
				};
			}
			
			getBodyDef() {
				return this._box2dData.bodyDef;
			}
			
			getFixtureDefs() {
				return this._box2dData.fixtureDefs;
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
				p.x = x / Conf.Box2dToPixi;
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
				p.y = y / Conf.Box2dToPixi;
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