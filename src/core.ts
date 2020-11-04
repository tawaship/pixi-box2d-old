import { IInitializeOption, initializeOption } from './Conf';
import { Application } from 'pixi.js';
import { WorldContainer } from './WorldContainer';
import { DebugDraw } from './Box2dAlias';
import { Box2dToPixi } from './Conf';

/**
 * @ignore
 */
let _isInit = false;

namespace PIXI {
	export namespace box2d {
		/**
		 * @return Returns itself for the method chaining.
		 */
		export function init(options: IInitializeOption = {}) {
			if (_isInit) {
				console.warn('[PIXI-box2d] Already initialized.');
				return PIXI.box2d;
			}
			
			if (!options.ticker) {
				console.warn('[PIXI-box2d] It may not work because no default ticker is specified.');
			}
			
			initializeOption.ticker = options.ticker;
			
			_isInit = true;
			
			return PIXI.box2d;
		}
		
		/**
		 * @param world Instance you want to debug
		 * @param canvas The canvas element on which the content is drawn.
		 * @return Canvas element for debug display.
		 */
		export function addDebugDraw(world: WorldContainer, pixiCanvas: HTMLCanvasElement): HTMLCanvasElement {
			const canvas = document.createElement('canvas');
			if (pixiCanvas.parentNode) {
				pixiCanvas.parentNode.appendChild(canvas);
			}
			
			canvas.width = pixiCanvas.width;
			canvas.height = pixiCanvas.height;
			canvas.style.width = pixiCanvas.style.width;
			canvas.style.height = pixiCanvas.style.height;
			canvas.style.top = pixiCanvas.style.top || '0';
			canvas.style.left = pixiCanvas.style.left || '0';
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
export { IInitializeOption };

/**
 * @ignore
 */
export import init = PIXI.box2d.init;

/**
 * @ignore
 */
export import addDebugDraw = PIXI.box2d.addDebugDraw;