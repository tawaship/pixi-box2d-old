/*!
 * Pixim-box2d - v1.0.0
 * 
 * @require pixi.js v5.3.2
 * @require @tawaship/pixim.js v1.7.4
 * @require Box2d.js
 * @author tawaship (makazu.mori@gmail.com)
 * @license MIT
 */
this.Pixim = this.Pixim || {}, function(exports, box2dweb, pixim_js, pixi_js) {
    "use strict";
    var Pixim, Vec2 = box2dweb.Common.Math.b2Vec2, DebugDraw = box2dweb.Dynamics.b2DebugDraw, World = box2dweb.Dynamics.b2World, ContactListener = (box2dweb.Dynamics.Contacts.box2dContact, 
    box2dweb.Dynamics.b2ContactListener), BodyDef = box2dweb.Dynamics.b2BodyDef, FixtureDef = box2dweb.Dynamics.b2FixtureDef, Body = box2dweb.Dynamics.b2Body, CircleShape = box2dweb.Collision.Shapes.b2CircleShape, PolygonShape = box2dweb.Collision.Shapes.b2PolygonShape;
    box2dweb.Collision.Shapes.b2EdgeShape;
    !function(Pixim) {
        !function(box2d) {
            var ContainerBase = function(PiximContainer) {
                function ContainerBase() {
                    PiximContainer.apply(this, arguments);
                }
                return PiximContainer && (ContainerBase.__proto__ = PiximContainer), ContainerBase.prototype = Object.create(PiximContainer && PiximContainer.prototype), 
                ContainerBase.prototype.constructor = ContainerBase, ContainerBase;
            }(pixim_js.Container);
            box2d.ContainerBase = ContainerBase;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim || (Pixim = {}));
    var Pixim$1, ContainerBase = Pixim.box2d.ContainerBase, PixiToBox2d = 1 / 30, initializeOption = {
        ticker: null
    };
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
            var WorldContainer = function(ContainerBase) {
                function WorldContainer(options) {
                    var this$1 = this;
                    void 0 === options && (options = {}), ContainerBase.call(this);
                    var gravityX = "number" == typeof options.gravityX ? options.gravityX : 0, gravityY = "number" == typeof options.gravityY ? options.gravityY : 9.8, allowSleep = !!options.allowSleep, world = new World(new Vec2(gravityX, gravityY), allowSleep);
                    this._box2dData = {
                        world: world,
                        listener: new ContactListener,
                        enabled: !0,
                        speed: 1,
                        targets: {},
                        deletes: {},
                        ticker: options.ticker
                    }, this.on("added", (function() {
                        this$1._box2dData.ticker = this$1._box2dData.ticker || initializeOption.ticker, 
                        this$1._box2dData.ticker.add(this$1._handleTick, this$1);
                    })), this.on("removed", (function() {
                        this$1._box2dData.ticker.remove(this$1._handleTick, this$1);
                    }));
                    var listener = this._box2dData.listener;
                    options.listenBeginContact && (listener.BeginContact = beginContactHandler), options.listenEndContact && (listener.EndContact = endContactHandler), 
                    options.listenPreSolve && (listener.PreSolve = preSolveHandler), options.listenPostSolve && (listener.PostSolve = postSolveHandler), 
                    world.SetContactListener(listener), this.box2dEnabled = !0;
                }
                ContainerBase && (WorldContainer.__proto__ = ContainerBase), WorldContainer.prototype = Object.create(ContainerBase && ContainerBase.prototype), 
                WorldContainer.prototype.constructor = WorldContainer;
                var prototypeAccessors = {
                    speed: {
                        configurable: !0
                    },
                    box2dEnabled: {
                        configurable: !0
                    },
                    world: {
                        configurable: !0
                    }
                };
                return WorldContainer.prototype._handleTick = function(delta) {
                    if (this._box2dData.enabled) {
                        var world = this._box2dData.world;
                        world.Step(delta * this._box2dData.speed / 30, 10, 10), world.ClearForces(), world.DrawDebugData();
                        var targets = this._box2dData.targets;
                        for (var i in this._box2dData.deletes) {
                            var b2d = this._box2dData.deletes[i];
                            delete targets[i], world.DestroyBody(b2d.body), b2d.body = null;
                        }
                        for (var i$1 in this._box2dData.deletes = [], targets) {
                            var b2d$1 = targets[i$1], position = b2d$1.body.GetPosition();
                            b2d$1.x = 30 * position.x, b2d$1.y = 30 * position.y, b2d$1.rotation = b2d$1.body.GetAngle();
                        }
                    }
                }, prototypeAccessors.speed.get = function() {
                    return this._box2dData.speed;
                }, prototypeAccessors.speed.set = function(speed) {
                    this._box2dData.speed = speed;
                }, prototypeAccessors.box2dEnabled.get = function() {
                    return this._box2dData.enabled;
                }, prototypeAccessors.box2dEnabled.set = function(flag) {
                    this._box2dData.enabled = flag;
                }, prototypeAccessors.world.get = function() {
                    return this._box2dData.world;
                }, WorldContainer.prototype.addBox2d = function(b2d) {
                    if (!b2d.body) {
                        for (var body = this._box2dData.world.CreateBody(b2d.getBodyDef()), fixtureDefs = b2d.getFixtureDefs(), i = 0; i < fixtureDefs.length; i++) {
                            body.CreateFixture(fixtureDefs[i]);
                        }
                        b2d.body = body, body.SetPosition({
                            x: b2d.x * PixiToBox2d,
                            y: b2d.y * PixiToBox2d
                        }), body.SetAngle(b2d.rotation);
                    }
                    return this.addChild(b2d), this._box2dData.targets[b2d.box2dID] = b2d, delete this._box2dData.deletes[b2d.box2dID], 
                    b2d;
                }, WorldContainer.prototype.removeBox2d = function(b2d) {
                    return this.removeChild(b2d), this._box2dData.deletes[b2d.box2dID] = b2d, b2d;
                }, Object.defineProperties(WorldContainer.prototype, prototypeAccessors), WorldContainer;
            }(ContainerBase);
            box2d.WorldContainer = WorldContainer;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$1 || (Pixim$1 = {}));
    var Pixim$2, WorldContainer = Pixim$1.box2d.WorldContainer;
    !function(Pixim) {
        !function(box2d) {
            function createBodyDef(isDynamic) {
                void 0 === isDynamic && (isDynamic = !1);
                var bodyDef = new BodyDef;
                return isDynamic ? bodyDef.type = Body.b2_dynamicBody : Body.b2_staticBody, bodyDef;
            }
            var dynamicBodyDef = createBodyDef(!0), staticBodyDef = createBodyDef(!1);
            function createFixtureDef(options, pixi) {
                void 0 === options && (options = {});
                var fixtureDef = new FixtureDef;
                return fixtureDef.density = "number" == typeof options.density ? options.density : fixtureDef.density, 
                fixtureDef.friction = "number" == typeof options.friction ? options.friction : fixtureDef.friction, 
                fixtureDef.restitution = "number" == typeof options.restitution ? options.restitution : fixtureDef.restitution, 
                fixtureDef.filter.categoryBits = "number" == typeof options.categoryBits ? options.categoryBits : fixtureDef.filter.categoryBits, 
                fixtureDef.filter.maskBits = "number" == typeof options.maskBits ? options.maskBits : fixtureDef.filter.maskBits, 
                fixtureDef.isSensor = !!options.isSensor, fixtureDef.userData = pixi, fixtureDef;
            }
            var descriptors = {
                positionX: Object.getOwnPropertyDescriptor(pixi_js.ObservablePoint.prototype, "x"),
                positionY: Object.getOwnPropertyDescriptor(pixi_js.ObservablePoint.prototype, "y"),
                positionSet: pixi_js.ObservablePoint.prototype.set,
                rotation: Object.getOwnPropertyDescriptor(pixi_js.DisplayObject.prototype, "rotation")
            }, Box2dObject = function(ContainerBase) {
                function Box2dObject(options) {
                    void 0 === options && (options = {}), ContainerBase.call(this), this._box2dData = {
                        id: Box2dObject._id++,
                        body: null,
                        bodyDef: options.isStatic ? staticBodyDef : dynamicBodyDef,
                        fixtureDefs: [ createFixtureDef(options, this) ],
                        pixi: null
                    };
                }
                ContainerBase && (Box2dObject.__proto__ = ContainerBase), Box2dObject.prototype = Object.create(ContainerBase && ContainerBase.prototype), 
                Box2dObject.prototype.constructor = Box2dObject;
                var prototypeAccessors = {
                    box2dID: {
                        configurable: !0
                    },
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
                }, prototypeAccessors.box2dID.get = function() {
                    return this._box2dData.id;
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
                        p.x = x * PixiToBox2d, body.SetPosition(p);
                    }
                }, prototypeAccessors.y.get = function() {
                    return descriptors.positionY.get.call(this.position);
                }, prototypeAccessors.y.set = function(y) {
                    descriptors.positionY.set.call(this.position, y);
                    var body = this._box2dData.body;
                    if (body) {
                        var p = body.GetPosition();
                        p.y = y * PixiToBox2d, body.SetPosition(p);
                    }
                }, prototypeAccessors.rotation.get = function() {
                    return descriptors.rotation.get.call(this);
                }, prototypeAccessors.rotation.set = function(rotation) {
                    descriptors.rotation.set.call(this, rotation);
                    var body = this._box2dData.body;
                    body && body.SetAngle(rotation);
                }, Box2dObject.prototype.addMask = function(bits) {
                    for (var list = this._box2dData.body.GetFixtureList(); list; ) {
                        var data = list.GetFilterData();
                        data.maskBits |= bits, list.SetFilterData(data), list = list.GetNext();
                    }
                }, Box2dObject.prototype.addAllMask = function() {
                    for (var list = this._box2dData.body.GetFixtureList(); list; ) {
                        var data = list.GetFilterData();
                        data.maskBits = 65535, list.SetFilterData(data), list = list.GetNext();
                    }
                }, Box2dObject.prototype.removeMask = function(bits) {
                    for (var list = this._box2dData.body.GetFixtureList(); list; ) {
                        var data = list.GetFilterData();
                        data.maskBits ^= data.maskBits & bits, list.SetFilterData(data), list = list.GetNext();
                    }
                }, Box2dObject.prototype.removeAllMask = function() {
                    for (var list = this._box2dData.body.GetFixtureList(); list; ) {
                        var data = list.GetFilterData();
                        data.maskBits = 0, list.SetFilterData(data), list = list.GetNext();
                    }
                }, Box2dObject.prototype.toDynamic = function() {
                    this._box2dData.body && this._box2dData.body.SetType(Body.b2_dynamicBody);
                }, Box2dObject.prototype.toStatic = function() {
                    this._box2dData.body && this._box2dData.body.SetType(Body.b2_staticBody);
                }, Object.defineProperties(Box2dObject.prototype, prototypeAccessors), Box2dObject;
            }(ContainerBase);
            Box2dObject._id = 0, box2d.Box2dObject = Box2dObject;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$2 || (Pixim$2 = {}));
    var Pixim$3, Box2dObject = Pixim$2.box2d.Box2dObject;
    !function(Pixim) {
        !function(box2d) {
            var Circle = function(Box2dObject) {
                function Circle(radius, options) {
                    void 0 === options && (options = {}), Box2dObject.call(this, options), this.getFixtureDefs()[0].shape = new CircleShape(radius * PixiToBox2d);
                }
                return Box2dObject && (Circle.__proto__ = Box2dObject), Circle.prototype = Object.create(Box2dObject && Box2dObject.prototype), 
                Circle.prototype.constructor = Circle, Circle.from = function(pixi, options) {
                    void 0 === options && (options = {});
                    var b2d = new Circle(Math.max(pixi.width / 2, pixi.height / 2), options), c = b2d.addChild(new PIXI.Container);
                    c.addChild(pixi);
                    var b = b2d.getLocalBounds();
                    return c.x = -b.x - pixi.width / 2, c.y = -b.y - pixi.height / 2, b2d;
                }, Circle;
            }(Box2dObject);
            box2d.Circle = Circle;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$3 || (Pixim$3 = {}));
    var Pixim$4, Circle = Pixim$3.box2d.Circle;
    !function(Pixim) {
        !function(box2d) {
            var Rectangle = function(Box2dObject) {
                function Rectangle(width, height, options) {
                    void 0 === options && (options = {}), Box2dObject.call(this, options), width *= PixiToBox2d, 
                    height *= PixiToBox2d;
                    var fixtureDef = this.getFixtureDefs()[0];
                    fixtureDef.shape = new PolygonShape, fixtureDef.shape.SetAsArray([ new Vec2(0, 0), new Vec2(width, 0), new Vec2(width, height), new Vec2(0, height) ]);
                }
                return Box2dObject && (Rectangle.__proto__ = Box2dObject), Rectangle.prototype = Object.create(Box2dObject && Box2dObject.prototype), 
                Rectangle.prototype.constructor = Rectangle, Rectangle.from = function(pixi, options) {
                    void 0 === options && (options = {});
                    var b2d = new Rectangle(pixi.width, pixi.height, options), c = b2d.addChild(new PIXI.Container);
                    c.addChild(pixi);
                    var b = b2d.getLocalBounds();
                    return c.x = -b.x, c.y = -b.y, b2d;
                }, Rectangle;
            }(Box2dObject);
            box2d.Rectangle = Rectangle;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$4 || (Pixim$4 = {}));
    var Pixim$5, Rectangle = Pixim$4.box2d.Rectangle;
    !function(Pixim) {
        !function(box2d) {
            var Polygon = function(Box2dObject) {
                function Polygon(vertices, pixi, options) {
                    void 0 === options && (options = {}), Box2dObject.call(this, options);
                    var fixtureDef = this.getFixtureDefs()[0];
                    fixtureDef.shape = new PolygonShape, fixtureDef.shape.SetAsArray(vertices);
                }
                return Box2dObject && (Polygon.__proto__ = Box2dObject), Polygon.prototype = Object.create(Box2dObject && Box2dObject.prototype), 
                Polygon.prototype.constructor = Polygon, Polygon;
            }(Box2dObject);
            box2d.Polygon = Polygon;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$5 || (Pixim$5 = {}));
    var Pixim$6, Polygon = Pixim$5.box2d.Polygon;
    !function(Pixim) {
        !function(box2d) {
            var Edge = function(Box2dObject) {
                function Edge(to, options) {
                    void 0 === options && (options = {}), Box2dObject.call(this, options);
                    var fixtureDef = this.getFixtureDefs()[0];
                    fixtureDef.shape = new PolygonShape, fixtureDef.shape.SetAsEdge({
                        x: 0,
                        y: 0
                    }, {
                        x: to.x * PixiToBox2d,
                        y: to.y * PixiToBox2d
                    });
                }
                return Box2dObject && (Edge.__proto__ = Box2dObject), Edge.prototype = Object.create(Box2dObject && Box2dObject.prototype), 
                Edge.prototype.constructor = Edge, Edge;
            }(Box2dObject);
            box2d.Edge = Edge;
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$6 || (Pixim$6 = {}));
    var Pixim$7, Edge = Pixim$6.box2d.Edge, _isInit = !1;
    !function(Pixim) {
        !function(box2d) {
            box2d.init = function(options) {
                return void 0 === options && (options = {}), _isInit ? (console.warn("[Pixim-box2d] Already initialized."), 
                Pixim.box2d) : (options.ticker || console.warn("[Pixim-box2d] It may not work because no default ticker is specified."), 
                initializeOption.ticker = options.ticker, _isInit = !0, Pixim.box2d);
            }, box2d.addDebugDraw = function(world, pixiCanvas) {
                var canvas = document.body.appendChild(document.createElement("canvas"));
                canvas.width = pixiCanvas.width, canvas.height = pixiCanvas.height, canvas.style.width = pixiCanvas.style.width, 
                canvas.style.height = pixiCanvas.style.height, canvas.style.top = pixiCanvas.style.top, 
                canvas.style.left = pixiCanvas.style.left, canvas.style.position = "absolute", canvas.style.pointerEvents = "none", 
                canvas.style.zIndex = "100";
                var debugDraw = new DebugDraw;
                return debugDraw.SetSprite(canvas.getContext("2d")), debugDraw.SetDrawScale(30), 
                debugDraw.SetFillAlpha(.5), debugDraw.SetLineThickness(1), debugDraw.SetFlags(DebugDraw.e_shapeBit | DebugDraw.e_jointBit), 
                world.world.SetDebugDraw(debugDraw), canvas;
            };
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$7 || (Pixim$7 = {}));
    var Pixim$8, init = Pixim$7.box2d.init, addDebugDraw = Pixim$7.box2d.addDebugDraw;
    !function(Pixim) {
        !function(box2d) {
            !function(events) {
                events.BeginContact = "BeginContact", events.EndContact = "EndContact", events.PreSolve = "PreSolve", 
                events.PostSolve = "PostSolve";
            }(box2d.events || (box2d.events = {}));
        }(Pixim.box2d || (Pixim.box2d = {}));
    }(Pixim$8 || (Pixim$8 = {}));
    var events = Pixim$8.box2d.events;
    exports.Box2dObject = Box2dObject, exports.Circle = Circle, exports.Edge = Edge, 
    exports.Polygon = Polygon, exports.Rectangle = Rectangle, exports.WorldContainer = WorldContainer, 
    exports.addDebugDraw = addDebugDraw, exports.events = events, exports.init = init;
}(this.Pixim.box2d = this.Pixim.box2d || {}, Box2D, Pixim, PIXI);
//# sourceMappingURL=Pixim-box2d.js.map
