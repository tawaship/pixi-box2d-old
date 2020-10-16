import { IInitOption, initOption } from './Conf';
import { Application } from 'pixi.js';
import { World } from './World';
import { DebugDraw } from './Box2dAlias';
import { Box2dToPixi } from './Conf';

/**
 * @ignore
 */
let _isInit = false;

namespace Pixim {
	export namespace box2d {
		/**
		 * @return Returns itself for the method chaining.
		 */
		export function init(options: IInitOption = {}) {
			if (_isInit) {
				console.warn('[Pixim-box2d] Already initialized.');
				return Pixim.box2d;
			}
			
			if (!options.ticker) {
				console.warn('[Pixim-box2d] It may not work because no default ticker is specified.');
			}
			
			initOption.ticker = options.ticker;
			
			_isInit = true;
			
			return Pixim.box2d;
		}
		
		/**
		 * @param world Instance you want to debug
		 * @param canvas The canvas element on which the content is drawn.
		 * @return Canvas element for debug display.
		 */
		export function addDebugDraw(world: World, pixiCanvas: HTMLCanvasElement): HTMLCanvasElement {
			const canvas = document.body.appendChild(document.createElement('canvas'));
			canvas.width = pixiCanvas.width;
			canvas.height = pixiCanvas.height;
			canvas.style.width = pixiCanvas.style.width;
			canvas.style.height = pixiCanvas.style.height;
			canvas.style.top = pixiCanvas.style.top;
			canvas.style.left = pixiCanvas.style.left;
			canvas.style.position = 'absolute';
			canvas.style.pointerEvents = 'none';
			canvas.style.zIndex = '100';
			
			const debugDraw = new DebugDraw();
			debugDraw.SetSprite(canvas.getContext('2d'));
			debugDraw.SetDrawScale(Box2dToPixi);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1);
			debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit);
			
			world.world.SetDebugDraw(debugDraw);
			
			return canvas;
		}
	}
}

/**
 * @ignore
 */
export { IInitOption };

/**
 * @ignore
 */
export import init = Pixim.box2d.init;

/**
 * @ignore
 */
export import addDebugDraw = Pixim.box2d.addDebugDraw;