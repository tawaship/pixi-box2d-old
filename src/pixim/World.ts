import { Application, Ticker } from 'pixi.js';
import * as _Pixim from '@tawaship/pixim.js';
import { Vec2, World as _World, Contact, ContactListener } from './Box2dAlias';
import { Box2dObject } from './Box2dObject';
import { initOption, Box2dToPixi, PixiToBox2d } from './Conf';

namespace Pixim {
	export namespace box2d {
		export interface IBox2dWorldData {
			world: _World,
			listener: ContactListener,
			enabled: boolean,
			speed: number,
			targets: { [id: number]: Box2dObject },
			deletes: { [id: number]: Box2dObject },
			ticker?: Ticker
		};
		
		export interface IBox2dWorldOption {
			gravityX?: number,
			gravityY?: number,
			allowSleep?: boolean,
			listenBeginContact?: boolean,
			listenEndContact?: boolean,
			listenPreSolve?: boolean,
			listenPostSolve?: boolean,
			ticker?: Ticker
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
		 * @see https://tawaship.github.io/Pixim.js/classes/pixim.container.html
		 */
		export class World extends _Pixim.Container {
			private _box2dData: IBox2dWorldData;
			
			constructor(options: IBox2dWorldOption = {}) {
				super();
				
				const gravityX = typeof(options.gravityX) === 'number' ? options.gravityX : 0;
				const gravityY = typeof(options.gravityY) === 'number' ? options.gravityY : 9.8;
				const allowSleep = !!options.allowSleep;
				
				const world = new _World(new Vec2(gravityX, gravityY), allowSleep);
				
				this._box2dData = {
					world,
					listener: new ContactListener(),
					enabled: true,
					speed: 1,
					targets: {},
					deletes: {},
					ticker: options.ticker
				};
				
				this.on('added', () => {
					this._box2dData.ticker = this._box2dData.ticker || initOption.ticker;
					this._box2dData.ticker.add(this._handleTick, this);
				});
				
				this.on('removed', () => {
					this._box2dData.ticker.remove(this._handleTick, this);
				});
				
				const listener = this._box2dData.listener;
				if (options.listenBeginContact) {
					listener.BeginContact = beginContactHandler;
				}
				
				if (options.listenEndContact) {
					listener.EndContact = endContactHandler;
				}
				
				if (options.listenPreSolve) {
					listener.PreSolve = preSolveHandler;
				}
				
				if (options.listenPostSolve) {
					listener.PostSolve = postSolveHandler;
				}
				
				world.SetContactListener(listener);
				
				this.box2dEnabled = true
			}
			
			private _handleTick(delta: number) {
				if (!this._box2dData.enabled) {
					return;
				}
				
				const world = this._box2dData.world;
				
				world.Step(delta * this._box2dData.speed / 30, 10, 10);
				world.ClearForces();
				world.DrawDebugData();
				
				const targets = this._box2dData.targets;
				
				for (let i in this._box2dData.deletes) {
					const b2d = this._box2dData.deletes[i];
					delete(targets[i]);
					world.DestroyBody(b2d.body);
					b2d.body = null;
				}
				this._box2dData.deletes = [];
				
				for (let i in targets) {
					const b2d = targets[i];
					
					const position = b2d.body.GetPosition();
					
					b2d.x = position.x * Box2dToPixi;
					b2d.y = position.y * Box2dToPixi;
					b2d.rotation = b2d.body.GetAngle();
				}
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
			}
			
			get world() {
				return this._box2dData.world;
			}
			
			addBox2d(b2d: Box2dObject) {
				if (!b2d.body) {
					const body = this._box2dData.world.CreateBody(b2d.getBodyDef());
					const fixtureDefs = b2d.getFixtureDefs();
					
					for (let i = 0; i < fixtureDefs.length; i++) {
						body.CreateFixture(fixtureDefs[i]);
					}
					
					b2d.body = body;
					
					body.SetPosition({ x: b2d.x * PixiToBox2d, y: b2d.y * PixiToBox2d });
					body.SetAngle(b2d.rotation);
				}
				
				/*
				b2d.once('added', () => {
					this._box2dData.targets[b2d.box2dID] = b2d;
					
					b2d.once('removed', () => {
						delete(this._box2dData.targets[id]);
						this._box2dData.world.DestroyBody(b2d.body);
						b2d.body = null;
					});
				});
				*/
				
				this.addChild(b2d);
				this._box2dData.targets[b2d.box2dID] = b2d;
				delete(this._box2dData.deletes[b2d.box2dID]);
				
				return b2d;
			}
			
			removeBox2d(b2d: Box2dObject) {
				this.removeChild(b2d);
				this._box2dData.deletes[b2d.box2dID] = b2d;
				
				return b2d;
			}
		}
	}
}

/**
 * @ignore
 */
export import World = Pixim.box2d.World;