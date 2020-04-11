// This all comes from Matter.js that is a script in index.html
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// creates a new engine that works with world
const engine = Engine.create();
engine.world.gravity.y = 0;

// Destructing world from new engine
// world in general is a canvas element in HTML
const { world } = engine;

// cells per 
const cellsHorizontal = 10;
const cellsVertical = 10;

// Creating constant width and height for later use
const width = window.innerWidth;
const height = window.innerHeight;

// Unit lengths
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

// render is in charge of object logic
// @element: designates place to append world
// @engine: selects the engine that render will use
// @options: display of world(canvas element)
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});

// Render.run() takes a render object
Render.run(render);
// runner works with engine 
Runner.run(Runner.create(), engine);

// Boundary Walls
// @params Bodies.rectangle(x, y, width, height, options{})
const walls = [
    Bodies.rectangle(width/2, 0, width, 2, {isStatic: true}), // top
    Bodies.rectangle(width/2, height, width, 2, {isStatic: true}), // bottom
    Bodies.rectangle(width, height/2, 2, height, {isStatic: true}), // right
    Bodies.rectangle(0, height/2, 2, height, {isStatic: true}) // left
]
// add the walls
World.add(world, walls);

// ****************Maze generation****************

const shuffle = (arr) => {
    let counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        // swap
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

// creates grid array
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

// These are vertical boundaries inside grid
const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));

// These are horizonal bounderies inside grid
const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

// Starting point
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

// Takes a 'step' into a cell
const step = (row, column) => {
    // If I visited cell at [row,column]: return
    if(grid[row][column]) return;
    // Mark this cell as visited
    grid[row][column] = true;
    // Assemble randomly ordered list of neighbors
    const neighbors = shuffle([
        [row-1, column, 'up'],
        [row, column+1, 'right'],
        [row+1, column,'down'],
        [row, column-1,'left'] 
    ]);
    // For each neighbor
    for(let neighbor of neighbors){
        const [nextRow, nextColumn, direction] = neighbor;

        // see if neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal){
            continue;
        }
        // If we have visited neighbor, contineu to next neighbor
        if(grid[nextRow][nextColumn]){
            continue;
        }
        // Remove the wall based on direction of neighbor with respect to current cell
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row-1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        // Visit that next cell
        step(nextRow, nextColumn);
    }
};

step(startRow, startColumn);

// Setting up horizontal walls for maze
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,    // x coord 
            rowIndex * unitLengthY + unitLengthY,         // y coord
            unitLengthX,                                 // width of wall
            5,                                         // Height of wall
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    })
});

// Setting up vertical walls for maze
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,    // x coord 
            rowIndex * unitLengthY + unitLengthY / 2,     // y coord
            5,                                       // width of wall
            unitLengthY,                               // Height of wall
            {
                label: 'wall',
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    })
});

// Creating object for victory condition
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX / 2,
    unitLengthY / 2,
    {
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal);

// User object - ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: 'ball',
        render: {
            fillStyle: 'violet'
        }
    }
);
World.add(world, ball);

// Logic for ball object movement
document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;
    if (event.key === 'w' || event.key === 'ArrowUp') {
        Body.setVelocity(ball, { x, y: y -5 });
    }
    if (event.key === 'd' || event.key === 'ArrowRight') {
        Body.setVelocity(ball, { x: x + 5, y });
    }
    if (event.key === 's' || event.key === 'ArrowDown') {
        Body.setVelocity(ball, { x, y: y + 5 });
    }
    if (event.key === 'a' || event.key === 'ArrowLeft') {
        Body.setVelocity(ball, { x: x -5, y });
    }
});

// Win condition
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
        const labels = ['ball', 'goal'];

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if(body.label === 'wall'){
                    Body.setStatic(body, false);
                }
            });
        }
    });
});