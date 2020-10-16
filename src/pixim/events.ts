namespace Pixim {
	export namespace box2d {
		export namespace events {
			/**
			 * When objects come into contact with each other.
			 * 
			 * @event
			 */
			export const BeginContact = 'BeginContact';
			
			/**
			 * When objects are separated from each other.
			 * 
			 * @event
			 */
			export const EndContact = 'EndContact';
			
			/**
			 * Immediately before performing contact processing between objects.
			 * It will not fire if at least one is "isSensor = true".
			 * 
			 * @event
			 */
			export const PreSolve = 'PreSolve';
			
			/**
			 * Immediately after performing contact processing between objects.
			 * It will not fire if at least one is "isSensor = true".
			 * 
			 * @event
			 */
			export const PostSolve = 'PostSolve';
		}
	}
}

/**
 * @ignore
 */
export import events = Pixim.box2d.events;