/*
Priorities: set up the board: check



*/





// ***************** STATE *****************

const state = {};
const BOARD_SIZE_X = 20;
const BOARD_SIZE_Y = 10;

const resetState = () => {
    state.board = [];
    //populate the board with rows and columns equal to BOARD_SIZE_X and BOARD_SIZE_Y
    generateBoard();

    //create a list that holds all of the squares that the snake takes up.
    state.snakeSquares = [];
    //current length of the snake (default to 1 square)
    state.snakeLength = 1;
    //create snake starting position and convert the ints into strings
    const startPositionX = Math.floor(Math.random() * BOARD_SIZE_X).toString();
    const startPositionY = Math.floor(Math.random() * BOARD_SIZE_Y).toString();
    const startPosition = [startPositionX, startPositionY];
    //add that position to the snake squares
    //state.snakeSquares.unshift(startPosition);
    state.snakeSquares.unshift(["2", "3"]);
    state.snakeSquares.unshift(["2", "4"]);
    state.snakeSquares.unshift(["2", "5"]);
    state.snakeSquares.unshift(["3", "5"]);
    state.snakeSquares.unshift(["4", "5"]);
    state.snakeSquares.unshift(["5", "5"]);
    //this element is what we use to stop the snakes current movement 
    state.snakeMovement;
    //direction the snake is moving in
    state.snakeDirection;
}

//generates a board based on BOARD_SIZE_X and BOARD_SIZE_Y
const generateBoard = () => {
    for (let x = 0; x < BOARD_SIZE_X; x++) {
        const row = []
        for (let y = 0; y < BOARD_SIZE_Y; y++) {
            row.push(y);
        }
        state.board.push(row);

    }
}



// ***************** DOM SELECTORS *****************
const boardElem = document.querySelector("#board");



// ***************** GAME LOGIC HELPER FUNCTIONS *****************

//expects a string of coordinates such as '9,4' or '1,4' and returns the div element corresponding to those coords
const getElemByCoord = (coordString) => {
    return document.querySelector("[data-coordinates='" + coordString + "']");
}

//expets an array with two coordinates as strings and returns a single string with the coordinates ex:"1,2"
const coordArrayToString = (coordArray) => {
    return `${coordArray[0]},${coordArray[1]}`
}

//takes an array with x and y coordinates and turns it into two integers
const coordArrayToInt = (coordArray) => {
    let intX = parseInt(coordArray[0]);
    let intY = parseInt(coordArray[1]);

    return [intX, intY];
}

const changeYCoord = (coordArray, direction) => {
    //get the int representation of the coordinates
    let [x,y] = coordArrayToInt(coordArray);
    //if the up key is pressed, subtract one from the y value, moving one row up
    if (direction === "up") {
        y -= 1;
    }
    //if the down key is pressed, add one to the y value, moving one row down
    else if (direction === "down") {
        y += 1;
    }

    //turn the new coordinates back into a string
    const newCoords = coordArrayToString([x,y]);
    //return the new coordinates as a string, and as an array of strings
    return {newCoordsString: newCoords, newCoordsArray: [x.toString(),y.toString()]}
}

const changeXCoord = (coordArray, direction) => {
    //get the int representation of the coordinates
    let [x,y] = coordArrayToInt(coordArray);
    //if the up key is pressed, subtract one from the y value, moving one row up
    if (direction === "left") {
        x -= 1;
    }
    //if the down key is pressed, add one to the y value, moving one row down
    else if (direction === "right") {
        x += 1;
    }

    //turn the new coordinates back into a string
    const newCoords = coordArrayToString([x,y]);
    //returns the coordinates as a string, and as an array of strings
    return {newCoordsString: newCoords, newCoordsArray: [x.toString(),y.toString()]};
}

//returns the coordinates of the nextSquare from the snake head based on the of the snake
const getNextMovement = () => {
    let direction = state.snakeDirection;
    const snakeHead = state.snakeSquares[0];

    //determine the correct direction
    let coordsArray;
    let coordsString;
    if (direction === "right") {
        const coordinatesObj= changeXCoord(snakeHead, direction);
        coordsArray = coordinatesObj.newCoordsArray;
        coordsString = coordinatesObj.newCoordsString;
    }  
    else if (direction === "left") {
        const coordinatesObj = changeXCoord(snakeHead, direction);
        coordsArray = coordinatesObj.newCoordsArray;
        coordsString = coordinatesObj.newCoordsString;
    } 
    else if (direction === "up") {
        const coordinatesObj = changeYCoord(snakeHead, direction);
        coordsArray = coordinatesObj.newCoordsArray;
        coordsString = coordinatesObj.newCoordsString;
    }
    else if (direction === "down") {
        const coordinatesObj = changeYCoord(snakeHead, direction);
        coordsArray = coordinatesObj.newCoordsArray;
        coordsString = coordinatesObj.newCoordsString;
    }

    return {nextSquareArray: coordsArray, nextSquareString: coordsString}
}

//moves the snake based on state.snakeDirection
const moveSnake = () => {

    const nextCoordsObj = getNextMovement();
    let newCoordsArray = nextCoordsObj.nextSquareArray;

    //adds the new square to the snakeSquares array
    state.snakeSquares.unshift(newCoordsArray);
    //gets rid of the tail of the snake
    state.snakeSquares.pop();
}

//sets state.snakeDirection based on which arrowkey was pressed (called in mainGameLoop)
const getMovementDirection = (event) => {
    if (event.key === "ArrowRight") {
        state.snakeDirection = "right";
    }
    else if (event.key === "ArrowUp") {
        state.snakeDirection = "up";
    }
    else if (event.key === "ArrowDown") {
        state.snakeDirection = "down";
    }
    else if (event.key === "ArrowLeft") {
        state.snakeDirection = "left";
    }
}

//main game loop function which calls all out game logic and render functions
const mainGameLoop = () => {
    moveSnake();
    render();
    detectColision();
}

const gameOver = () => {
    clearInterval(state.snakeMovme)
    resetState();
    render();
}

//function that handles keypresses by the user and is called by our event listener
const handleUserInput = (event) => {
    /* clear interval uses state.snakeMovement to refresh the snake direction, without clearInterval
    the snake would continue moving "right" even though the "up" arrowkey had been pressed */
    clearInterval(state.snakeMovement);
    //sets state.snakeDirection based on the arrowkey that was pressed
    getMovementDirection(event);
    //calls mainGameLoop every 1/10th of a second
    state.snakeMovement = setInterval(mainGameLoop, 200);
}

const detectColision = () => {
    /* checks to see if the square the snake is going to move it is out of the grid bounds
    which are set by BOARD_SIZE_X and BOARD_SIZE_Y*/
    //get the coordinates for the next movement
    const nextCoordsObj = getNextMovement();
    //get the coordinate array for the next square to be moved into
    const nextCoordsArray = nextCoordsObj.nextSquareArray;
    //get the x and y values as ints so that we can compare them to our game board borders
    const [x,y] = coordArrayToInt(nextCoordsArray);

    if (x > BOARD_SIZE_X|| x < -1) {
        console.log("game over!")
        gameOver();
    }
    else if (y > BOARD_SIZE_Y || y < -1) {
        console.log("game over!")
        gameOver();
    }
}


// ***************** DOM MANIPULATION FUNCTIONS *****************
const renderBoard = () => {
    //empty the element
    boardElem.innerHTML = '';
    //get the new snake head
    //state.snakeHead = state.snakeSquares[0];
    //get the new snake tail
    state.snakeTail = state.snakeSquares[state.snakeSquares.length - 1];
    //fill out the new snake using the snakeSquares array
    for (let i = 0; i < state.snakeSquares.length; i++) {
        //setSnakeSquares(state.snakeSquares[i]);
    }

    for (let x = 0; x < state.board.length; x++) {
        //create an element to represent rows
        const rowElem = document.createElement('div');
        //give it a class name (maybe this will be useful i'm not sure yet)
        rowElem.classList.add('row_' + x);
        //append it to main
        boardElem.appendChild(rowElem);
        for (let y = 0; y < state.board[x].length; y++) {
            //create an element to represent squares
            const squareElem = document.createElement('div');
            //give it a coordinates dataset
            squareElem.dataset.coordinates = `${x},${y}`;
            //give it a classname so we can style it
            squareElem.classList.add('square');
            //append it to the newly created row element
            rowElem.appendChild(squareElem);
        }
    }
}

//uses state.snakeSquares array to color all of the squares with a snake in them to red
const renderSnake = () => {
    //iterate through the current snakeSquares
    for (let i = 0; i < state.snakeSquares.length; i++) {
        //get the coordinates and turn them into a string using coordArrayToString
        const coordString = coordArrayToString(state.snakeSquares[i]);
        //use our getElemByCoord function to get the DOM div element attached to our coordinates 
        const snakeSquare = getElemByCoord(coordString);
        //give it the snake class, turning the background red
        try {
            snakeSquare.classList.add('snake');
        }
        catch (e) {
            console.log("snake is off the grid");
        }
    }
}

const render = () => {
    renderBoard();
    renderSnake();
}


// ***************** EVENT LISTENERS *****************
document.addEventListener('keydown', handleUserInput)

//test zone
boardElem.addEventListener('click', function(event) {
 
}) 

// ***************** WEBPAGE INITIALIZATION *****************
resetState();
render();