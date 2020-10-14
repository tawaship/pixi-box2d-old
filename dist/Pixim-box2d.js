/*!
 * Pixim-box2d - v1.0.0
 * 
 * @require pixi.js v5.3.2
 * @require @tawaship/pixim.js v1.7.4
 * @require Box2d.js
 * @author tawaship (makazu.mori@gmail.com)
 * @license MIT
 */
this.Pixim = this.Pixim || {}, function(exports, _PIXI, _Pixim, box2dweb) {
    "use strict";
    var PIXI, Vec2 = box2dweb.Common.Math.b2Vec2, DebugDraw = box2dweb.Dynamics.b2DebugDraw, World = box2dweb.Dynamics.b2World, ContactListener = (box2dweb.Dynamics.Contacts.box2dContact, 
    box2dweb.Dynamics.b2ContactListener), BodyDef = box2dweb.Dynamics.b2BodyDef, FixtureDef = box2dweb.Dynamics.b2FixtureDef, Body = box2dweb.Dynamics.b2Body, CircleShape = box2dweb.Collision.Shapes.b2CircleShape, PolygonShape = box2dweb.Collision.Shapes.b2PolygonShape;
    !function(PIXI) {
        !function(box2d) {
            box2d.Box2dToPixi = 30, box2d.PixiToBox2d = 1 / box2d.Box2dToPixi;
        }(PIXI.box2d || (PIXI.box2d = {}));
    }(PIXI || (PIXI = {}));
    var Pixim, Box2dToPixi = PIXI.box2d.Box2dToPixi, PixiToBox2d = PIXI.box2d.PixiToBox2d, options = {};
    !function(Pixim) {
        !function(box2d) {
            function createBodyDef(isDynamic) {
                void 0 === isDynamic && (isDynamic = !1);
                var bodyDef = new BodyDef;
                return isDynamic ? bodyDef.type = Body.b2_dynamicBody : Body.b2_staticBody, bodyDef;
            }
            var dynamicBodyDef = createBodyDef(!0), staticBodyDef = createBodyDef(!1);
            function createFixtureDef(options) {
                void 0 === options && (options = {});
                var fixtureDef = new FixtureDef;
                return fixtureDef.density = "number" == typeof options.density ? options.density : fixtureDef.density, 
                fixtureDef.friction = "number" == typeof options.friction ? options.friction : fixtureDef.friction, 
                fixtureDef.restitution = "number" == typeof options.restitution ? options.restitution : fixtureDef.restitution, 
                fixtureDef.filter.categoryBits = "number" == typeof options.categoryBits ? options.categoryBits : fixtureDef.filter.categoryBits, 
                fixtureDef.filter.maskBits = "number" == typeof options.maskBits ? options.maskBits : fixtureDef.filter.maskBits, 
                fixtureDef.isSensor = options.isSensor || fixtureDef.isSensor, fixtureDef.userData = options.userData || fixtureDef.userData, 
                fixtureDef;
            }
            var descriptors = {
                positionX: Object.getOwnPropertyDescriptor(_PIXI.ObservablePoint.prototype, "x"),
                positionY: Object.getOwnPropertyDescriptor(_PIXI.ObservablePoint.prototype, "y"),
                positionSet: _PIXI.ObservablePoint.prototype.set,
                rotation: Object.getOwnPropertyDescriptor(_PIXI.DisplayObject.prototype, "rotation")
            }, Box2dObject = function(superclass) {
                function Box2dObject(isStatic, options) {
                    void 0 === isStatic && (isStatic = !1), void 0 === options && (options = {}), superclass.call(this), 
                    options.userData = options.userData || this, this._box2dData = {
                        body: null,
                        bodyDef: isStatic ? staticBodyDef : dynamicBodyDef,
                        fixtureDefs: [ createFixtureDef(options) ]
                    };
                }
                superclass && (Box2dObject.__proto__ = superclass), Box2dObject.prototype = Object.create(superclass && superclass.prototype), 
                Box2dObject.prototype.constructor = Box2dObject;
                var prototypeAccessors = {
                    body: {
                        configurable: !0
                    },
                    x: {
                        configurable: !0
                    },
                    y: {
                        configurable: !0
                    },
                    rotation: {
                        configurable: !0
                    }
                };
                return Box2dObject.prototype.getBodyDef = function() {
                    return this._box2dData.bodyDef;
                }, Box2dObject.prototype.getFixtureDefs = function() {
                    return this._box2dData.fixtureDefs;
                }, prototypeAccessors.body.get = function() {
                    return this._box2dData.body;
                }, prototypeAccessors.body.set = function(body) {
                    this._box2dData.body = body;
                }, prototypeAccessors.x.get = function() {
                    return descriptors.positionX.get.call(this.position);
                }, prototypeAccessors.x.set = function(x) {
                    descriptors.positionX.set.call(this.position, x);
                    var body = this._box2dData.body;
                    if (body) {
                        var p = body.GetPosition();
                        p.x = x / Box2dToPixi, body.SetPosition(p);
                    }
                }, prototypeAccessors.y.get = function() {
                    return descriptors.positionY.get.call(this.position);
                }, prototypeAccessors.y.set = function(y) {
                    descriptors.positionY.set.call(this.position, y);
                    var body = this._box2dData.body;
                    if (body) {
                        var p = body.GetPosition();
                        p.y = y / Box2dToPixi, body.SetPosition(p);
                    }
                }, prototypeAccessors.rotation.get = function() {
                    return descriptors.rotation.get.call(this);
                }, prototypeAccessors.rotation.set = function(rotation) {
                    descriptors.rotation.set.call(this, rotation);
                    var body = this._box2dData.body;
                    body && body.SetAngle(rotation);
                }, Object.defineProperties(Box2dObject.prototype, prototypeAccessors), Box2dObject;
            }(_PIXI.Container);
            box2d.Box2dObject = Box2dObject;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim || (Pixim = {}));
    var Pixim$1, Box2dObject = Pixim.box2d.Box2dObject;
    !function(Pixim) {
        !function(box2d) {
            function beginContactHandler(contact) {
                var dataA = contact.GetFixtureA().GetUserData(), dataB = contact.GetFixtureB().GetUserData();
                dataA && dataA.emit && dataA.emit("BeginContact", dataB), dataB && dataB.emit && dataB.emit("BeginContact", dataA);
            }
            function endContactHandler(contact) {
                var dataA = contact.GetFixtureA().GetUserData(), dataB = contact.GetFixtureB().GetUserData();
                dataA && dataA.emit && dataA.emit("EndContact", dataB), dataB && dataB.emit && dataB.emit("EndContact", dataA);
            }
            function preSolveHandler(contact) {
                var dataA = contact.GetFixtureA().GetUserData(), dataB = contact.GetFixtureB().GetUserData();
                dataA && dataA.emit && dataA.emit("PreSolve", dataB), dataB && dataB.emit && dataB.emit("PreSolve", dataA);
            }
            function postSolveHandler(contact) {
                var dataA = contact.GetFixtureA().GetUserData(), dataB = contact.GetFixtureB().GetUserData();
                dataA && dataA.emit && dataA.emit("PostSolve", dataB), dataB && dataB.emit && dataB.emit("PostSolve", dataA);
            }
            var _app = null;
            _PIXI.Application.registerPlugin({
                init: function() {
                    this.ticker.add(World$1.update), _app = this;
                },
                destroy: function() {
                    this.ticker.remove(World$1.update), _app = null;
                }
            });
            var World$1 = function(superclass) {
                function World$1(options$1) {
                    var this$1 = this;
                    void 0 === options$1 && (options$1 = {}), superclass.call(this);
                    var gravityX = "number" == typeof options$1.gravityX ? options$1.gravityX : 0, gravityY = "number" == typeof options$1.gravityY ? options$1.gravityY : 9.8, allowSleep = !!options$1.allowSleep, useHandler = options$1.useHandler || {}, beginContact = !!useHandler.beginContact, endContact = !!useHandler.endContact, preSolve = !!useHandler.preSolve, postSolve = !!useHandler.postSolve, world = new World(new Vec2(gravityX, gravityY), allowSleep);
                    options.useDebugDraw && function(app, world) {
                        var canvas = document.body.appendChild(document.createElement("canvas"));
                        canvas.width = app.view.width, canvas.height = app.view.height, canvas.style.width = app.view.style.width, 
                        canvas.style.height = app.view.style.height, canvas.style.top = app.view.style.top, 
                        canvas.style.left = app.view.style.left, canvas.style.position = "absolute", canvas.style.pointerEvents = "none", 
                        canvas.style.zIndex = "100";
                        var debugDraw = new DebugDraw;
                        debugDraw.SetSprite(canvas.getContext("2d")), debugDraw.SetDrawScale(Box2dToPixi), 
                        debugDraw.SetFillAlpha(.5), debugDraw.SetLineThickness(1), debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit), 
                        world.SetDebugDraw(debugDraw);
                    }(_app, world), this.on("added", (function() {
                        World$1._add(this$1._box2dData.id, this$1);
                    })), this.on("removed", (function() {
                        World$1._remove(this$1._box2dData.id);
                    })), this._box2dData = {
                        world: world,
                        listener: new ContactListener,
                        enabled: !0,
                        speed: 1,
                        id: World$1._id++
                    };
                    var listener = this._box2dData.listener;
                    beginContact && (listener.BeginContact = beginContactHandler), endContact && (listener.EndContact = endContactHandler), 
                    preSolve && (listener.PreSolve = preSolveHandler), postSolve && (listener.PostSolve = postSolveHandler), 
                    this.box2dEnabled = !0;
                }
                superclass && (World$1.__proto__ = superclass), World$1.prototype = Object.create(superclass && superclass.prototype), 
                World$1.prototype.constructor = World$1;
                var prototypeAccessors = {
                    speed: {
                        configurable: !0
                    },
                    box2dEnabled: {
                        configurable: !0
                    }
                };
                return World$1.update = function(delta) {
                    for (var i in World$1._targets) {
                        World$1._targets[i].box2dEnabled && World$1._targets[i].update(delta);
                    }
                }, World$1._add = function(id, world) {
                    this._targets[id] = world;
                }, World$1._remove = function(id) {
                    delete this._targets[id];
                }, prototypeAccessors.speed.get = function() {
                    return this._box2dData.speed;
                }, prototypeAccessors.speed.set = function(speed) {
                    this._box2dData.speed = speed;
                }, prototypeAccessors.box2dEnabled.get = function() {
                    return this._box2dData.enabled;
                }, prototypeAccessors.box2dEnabled.set = function(flag) {
                    this._box2dData.enabled = flag;
                }, World$1.prototype.update = function(delta) {
                    var world = this._box2dData.world;
                    world.Step(delta * this._box2dData.speed / 60, 10, 10), world.ClearForces(), world.DrawDebugData();
                    for (var d = this.children, i = 0; i < d.length; i++) {
                        if (d[i] instanceof Box2dObject) {
                            var r = d[i], position = r.body.GetPosition();
                            r.x = position.x * Box2dToPixi, r.y = position.y * Box2dToPixi, r.rotation = r.body.GetAngle();
                        }
                    }
                }, World$1.prototype.addBox2d = function(child) {
                    this.addChild(child);
                    for (var body = this._box2dData.world.CreateBody(child.getBodyDef()), fixtureDefs = child.getFixtureDefs(), i = 0; i < fixtureDefs.length; i++) {
                        body.CreateFixture(fixtureDefs[i]);
                    }
                    return child.body = body, child;
                }, World$1.prototype.removeBox2d = function(child) {
                    return this.removeChild(child), this._box2dData.world.DestroyBody(child.body), child.body = null, 
                    child;
                }, Object.defineProperties(World$1.prototype, prototypeAccessors), World$1;
            }(_Pixim.Container);
            World$1._id = 0, World$1._targets = {}, box2d.World = World$1;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$1 || (Pixim$1 = {}));
    var Pixim$2, World$1 = Pixim$1.box2d.World;
    !function(Pixim) {
        !function(box2d) {
            var Circle = function(Box2dObject) {
                function Circle(radius, isStatic, pixi, options) {
                    void 0 === options && (options = {}), Box2dObject.call(this, isStatic, options), 
                    this._box2dData.radius = radius, this.getFixtureDefs()[0].shape = new CircleShape(radius * PixiToBox2d), 
                    this.addChild(pixi);
                }
                Box2dObject && (Circle.__proto__ = Box2dObject), Circle.prototype = Object.create(Box2dObject && Box2dObject.prototype), 
                Circle.prototype.constructor = Circle;
                var prototypeAccessors = {
                    radius: {
                        configurable: !0
                    }
                };
                return prototypeAccessors.radius.get = function() {
                    return this._box2dData.radius;
                }, Object.defineProperties(Circle.prototype, prototypeAccessors), Circle;
            }(Box2dObject);
            box2d.Circle = Circle;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$2 || (Pixim$2 = {}));
    var Pixim$3, Circle = Pixim$2.box2d.Circle;
    !function(Pixim) {
        !function(box2d) {
            var Rectangle = function(Box2dObject) {
                function Rectangle(width, height, isStatic, pixi, options) {
                    void 0 === options && (options = {}), Box2dObject.call(this, isStatic, options), 
                    this._box2dData.width = width, this._box2dData.height = height, width *= PixiToBox2d, 
                    height *= PixiToBox2d;
                    var fixtureDef = this.getFixtureDefs()[0];
                    fixtureDef.shape = new PolygonShape, fixtureDef.shape.SetAsArray([ new Vec2(0, 0), new Vec2(width, 0), new Vec2(width, height), new Vec2(0, height) ]), 
                    this.addChild(pixi);
                }
                return Box2dObject && (Rectangle.__proto__ = Box2dObject), Rectangle.prototype = Object.create(Box2dObject && Box2dObject.prototype), 
                Rectangle.prototype.constructor = Rectangle, Rectangle;
            }(Box2dObject);
            box2d.Rectangle = Rectangle;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$3 || (Pixim$3 = {}));
    var PIXI$1, Rectangle = Pixim$3.box2d.Rectangle;
    !function(PIXI) {
        !function(box2d) {
            box2d.setConfig = function(options$1) {
                void 0 === options$1 && (options$1 = {}), options.useDebugDraw = options$1.useDebugDraw;
            };
        }(PIXI.box2d || (PIXI.box2d = {}));
    }(PIXI$1 || (PIXI$1 = {}));
    var setConfig = PIXI$1.box2d.setConfig;
    exports.Box2dObject = Box2dObject, exports.Circle = Circle, exports.Rectangle = Rectangle, 
    exports.World = World$1, exports.setConfig = setConfig;
}(this.Pixim.box2d = this.Pixim.box2d || {}, PIXI, Pixim, Box2D);
//# sourceMappingURL=Pixim-box2d.js.map
