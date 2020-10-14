namespace PIXI {
	export namespace box2d {
		export const Box2dToPixi = 30;
		export const PixiToBox2d = 1 / Box2dToPixi;
		
		export interface IPrepareOption {
			useDebugDraw?: boolean
		};
	}
}

/**
 * @ignore
 */
export import Box2dToPixi = PIXI.box2d.Box2dToPixi;

/**
 * @ignore
 */
export import PixiToBox2d = PIXI.box2d.PixiToBox2d;

/**
 * @ignore
 */
export import IPrepareOption = PIXI.box2d.IPrepareOption;

/**
 * @ignore
 */
export const options: PIXI.box2d.IPrepareOption = {};