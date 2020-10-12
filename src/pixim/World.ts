import * as _PIXI from 'pixi.js';
import * as _Pixim from '@tawaship/pixim.js';
import { Vec2, DebugDraw, World as _World, Contact, ContactListener } from './Box2dAlias';
import { Box2dObject } from './Box2dObject';
import * as Conf from './Conf';

namespace Pixim {
	export namespace box2d {
		export interface IBox2dWorldData {
			world: _World,
			listener: ContactListener,
			enabled: boolean,
			speed: number
		};
		
		export interface IBox2dWorldOption {
			gravityX?: number,
			gravityY?: number,
			allowSleep?: boolean,
			useHandler?: IBox2dWorldHandlers
		};
		
		export interface IBox2dWorldHandlers {
			beginContact?: boolean,
			endContact?: boolean,
			preSolve?: boolean,
			postSolve?: boolean
		};
		
		/**
		 * @ignore
		 */
		function beginContactHandler(contact: Contact) {
			const dataA = contact.GetFixtureA().GetUserData();
			const dataB = contact.GetFixtureB().GetUserData();
			
			dataA && dataA.emit && dataA.emit('BeginContact', dataB);
			dataB && dataB.emit && dataB.emit('BeginContact', dataA);
		}
		
		/**
		 * @ignore
		 */
		function endContactHandler(contact: Contact) {
			const dataA = contact.GetFixtureA().GetUserData();
			const dataB = contact.GetFixtureB().GetUserData();
			
			dataA && dataA.emit && dataA.emit('EndContact', dataB);
			dataB && dataB.emit && dataB.emit('EndContact', dataA);
		}
		
		/**
		 * @ignore
		 */
		function preSolveHandler(contact: Contact) {
			const dataA = contact.GetFixtureA().GetUserData();
			const dataB = contact.GetFixtureB().GetUserData();
			
			dataA && dataA.emit && dataA.emit('PreSolve', dataB);
			dataB && dataB.emit && dataB.emit('PreSolve', dataA);
		}
		
		/**
		 * @ignore
		 */
		function postSolveHandler(contact: Contact) {
			const dataA = contact.GetFixtureA().GetUserData();
			const dataB = contact.GetFixtureB().GetUserData();
			
			dataA && dataA.emit && dataA.emit('PostSolve', dataB);
			dataB && dataB.emit && dataB.emit('PostSolve', dataA);
		}
		
		/**
		 * @see http://pixijs.download/release/docs/PIXI.Container.html
		 */
		export class World extends _Pixim.Container {
			private _box2dData: IBox2dWorldData;
			
			constructor(options: IBox2dWorldOption = {}) {
				super();
				
				const gravityX = typeof(options.gravityX) === 'number' ? options.gravityX : 0;
				const gravityY = typeof(options.gravityY) === 'number' ? options.gravityY : 9.8;
				const allowSleep = !!options.allowSleep;
				
				const useHandler = options.useHandler || {};
				const beginContact = !!useHandler.beginContact;
				const endContact = !!useHandler.endContact;
				const preSolve = !!useHandler.preSolve;
				const postSolve = !!useHandler.postSolve;
				
				this._box2dData = {
					world: new _World(new Vec2(gravityX, gravityY), allowSleep),
					listener: new ContactListener(),
					enabled: true,
					speed: 1
				};
				
				const listener = this._box2dData.listener;
				if (beginContact) {
					listener.BeginContact = beginContactHandler;
				}
				
				if (endContact) {
					listener.EndContact = endContactHandler;
				}
				
				if (preSolve) {
					listener.PreSolve = preSolveHandler;
				}
				
				if (postSolve) {
					listener.PostSolve = postSolveHandler;
				}
				
				this.box2dEnabled = true
			}
			
			get speed() {
				return this._box2dData.speed;
			}
			
			set speed(speed: number) {
				this._box2dData.speed = speed;
			}
			
			get box2dEnabled() {
				return this._box2dData.enabled;
			}
			
			set box2dEnabled(flag: boolean) {
				this._box2dData.enabled = flag;
				
				this.task.clear('box2dUpdate');
				if (flag) {
					this.task.on('box2dUpdate', (e: _Pixim.ITickerData) => {
						const world = this._box2dData.world;
						
						world.Step(e.delta * this._box2dData.speed / 60, 10, 10);
						world.ClearForces();
						world.DrawDebugData();
						
						const d = this.children;
						for (var i = 0; i < d.length; i++) {
							if (!(d[i] instanceof Box2dObject)) {
								continue;
							}
							
							const r = d[i] as Box2dObject;
							const position = r.body.GetPosition();
							
							r.x = position.x * Conf.Box2dToPixi;
							r.y = position.y * Conf.Box2dToPixi;
							r.rotation = r.body.GetAngle();
						}
					});
				}
			}
			
			addDebugView(app: _PIXI.Application) {
				const canvas = document.body.appendChild(document.createElement('canvas'));
				canvas.width = app.view.width;
				canvas.height = app.view.height;
				canvas.style.width = app.view.style.width;
				canvas.style.height = app.view.style.height;
				canvas.style.top = app.view.style.top;
				canvas.style.left = app.view.style.left;
				canvas.style.position = 'absolute';
				canvas.style.pointerEvents = 'none';
				
				const debugDraw = new DebugDraw();
				debugDraw.SetSprite(canvas.getContext('2d'));
				debugDraw.SetDrawScale(Conf.Box2dToPixi);
				debugDraw.SetFillAlpha(0.5);
				debugDraw.SetLineThickness(1);
				debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
				
				this._box2dData.world.SetDebugDraw(debugDraw);
				
				return canvas;
			}
			
			addBox2d(child: Box2dObject) {
				this.addChild(child);
				
				const body = this._box2dData.world.CreateBody(child.getBodyDef());
				var fixtureDefs = child.getFixtureDefs();
				
				for (let i = 0; i < fixtureDefs.length; i++) {
					body.CreateFixture(fixtureDefs[i]);
				}
				
				child.body = body;
				
				return child;
			}
			
			removeBox2d(child: Box2dObject) {
				this.removeChild(child);
				
				this._box2dData.world.DestroyBody(child.body);
				
				child.body = null;
				
				return child;
			}
		}
	}
}

/**
 * @ignore
 */
export import World = Pixim.box2d.World;