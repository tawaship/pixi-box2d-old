{
	Pixim.box2d = {};
	
	Pixim.box2d.World = class World extends PIXI.Container {
	
	}
	
	class Box2dContainer extends PIXI.Container {
		constructor(bodyDef, fixtureDefs) {
			super();
			
			this._box2dData = {
				body: null,
				bodyDef,
				fixtureDefs
			};
		}
		
		get body() {
			return this._box2dData.body;
		}
		
		set body(body) {
			this._box2dData.body = body;
		}
	}
	
	Pixim.box2d.Circle = class Circle extends Box2dContainer {
		constructor() {
			super();
			
			this._box2dData = {
				body: null,
				bodyDef,
				fixtureDefs
			};
		}
	}
	
	Pixim.box2d.Rectangle = class Rectangle extends Box2dContainer {
	
	}