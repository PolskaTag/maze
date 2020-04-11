// DEMO OF MATTER!

// This all comes from Matter.js that is a script in index.html
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

// creates a new engine that works with world
const engine = Engine.create();

// Destructing world from new engine
// world in general is a canvas element in HTML
const { world } = engine;

// render is in charge of object logic
// @element: designates place to append world
// @engine: selects the engine that render will use
// @options: display of world(canvas element)
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: 800,
        height: 600
    }
});

// Creating constant width and height for later use
const width = 800;
const height = 600;

// Render.run() takes a render object
Render.run(render);
// runner works with engine 
Runner.run(Runner.create(), engine);

// Allows mouse functionality on objects
World.add(world, MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
}))

// Walls
const walls = [
    Bodies.rectangle(400, 0, 800, 25, {isStatic: true}), // top
    Bodies.rectangle(800, 300, 25, 600, {isStatic: true}), // right
    Bodies.rectangle(400, 600, 800, 25, {isStatic: true}), // bottom
    Bodies.rectangle(0, 300, 25, 600, {isStatic: true}) // left
]
// add the walls
World.add(world, walls);

// creating a new shape --- doesnt automatically append to world
const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: false // prevents the shape from moving
});

// append shape to world
World.add(world, shape);

// random shapes incoming!
for(let i = 0; i < 20; i++) {
    if(Math.random() > 0.5) {
        World.add(
            world,
            Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50));
    } else {
        World.add(
            world,
            Bodies.circle(Math.random() * width, Math.random() * height, 25));
    }
}