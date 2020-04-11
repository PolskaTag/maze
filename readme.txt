This app creates a maze for the user to traverse. The goal 
is to make it through the maze to the finish point.

Notes about Matter:
    script: https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.14.2/matter.min.js

    World: Object that contains all other sub objects
    Engine: Reads in the current state of the world, then calculates changes
    Runner: Makes world and engine work together ~ 60/s
    Render: Shows data on the screen from engine
    Body: A shape that is being displayed.