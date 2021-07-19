/* Classic snake game
Author: Daniel Golub (Pleachy)
Last Updated: July 18th
*/

// ***************** STATE *****************

const state = {};
const BOARD_SIZE_X = 20;
const BOARD_SIZE_Y = 10;
let HIGH_SCORE = 0;

const resetState = () => {
    state.interval = 200;

    state.board = [];
    //populate the board with rows and columns equal to BOARD_SIZE_X and BOARD_SIZE_Y
    generateBoard();

    //create a list that holds all of the squares that the snake takes up.
    state.snakeSquares = [];
    //current length of the snake (default to 1 square)
    state.snakeLength = 1;
    const startPosition = assignRandomCoordinate();
    //add that position to the snake squares
    state.snakeSquares.unshift(startPosition);
    //this element is what we use to stop the snakes current movement 
    state.snakeMovement;
    //direction the snake is moving in
    state.snakeDirection;
    //last popped element of the snake
    state.lastTailLocation;
    //initial mouse generation
    state.mouse = assignRandomCoordinate();

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

const assignRandomCoordinate = (coordinatesToExclude = []) => {
    let returnCoord = [
        Math.floor(Math.random() * BOARD_SIZE_X).toString(),
        Math.floor(Math.random() * BOARD_SIZE_Y).toString()
    ];

    for (let i = 0; i < coordinatesToExclude.length; i++) {
        if (areCoordinatesEqual(returnCoord, coordinatesToExclude[i])) {
            return assignRandomCoordinate(coordinatesToExclude)
        }
    }
    
    return returnCoord;
}

//returns true if the passed coordinates are equal
const areCoordinatesEqual = (coordinateOne, coordinateTwo) => coordinateOne.toString() === coordinateTwo.toString();

// ***************** DOM SELECTORS *****************
const boardElem = document.querySelector("#board");
const startButtonElem = document.querySelector('#start-game');



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
    let coordinatesObj;
    let coordsArray;
    let coordsString;
    if (direction === "right" || direction === "left") {
        coordinatesObj = changeXCoord(snakeHead, direction);
    }  
    else if (direction === "up" || direction === "down") {
        coordinatesObj = changeYCoord(snakeHead, direction);
    }

    if (coordinatesObj) {
        coordsArray = coordinatesObj.newCoordsArray;
        coordsString = coordinatesObj.newCoordsString;
        return {nextSquareArray: coordsArray, nextSquareString: coordsString}
    }
}

//moves the snake based on state.snakeDirection
const moveSnake = () => {
    
    const nextCoordsObj = getNextMovement();
    if (nextCoordsObj) {
        let newCoordsArray = nextCoordsObj.nextSquareArray;
        
        //adds the new square to the snakeSquares array
        state.snakeSquares.unshift(newCoordsArray);
        //gets rid of the tail of the snake and put the popped element into last tail location
        state.lastTailLocation = state.snakeSquares.pop();
    }
}

//sets state.snakeDirection based on which arrowkey was pressed (called in mainGameLoop)
const getMovementDirection = (event) => {
    if (event.key === "ArrowRight") {
        //prevents the player from killing themselves by pressing the key opposite of the snake's direction
        if (state.snakeDirection !== "left") {
            state.snakeDirection = "right";
        }
    }
    else if (event.key === "ArrowUp") {
        if (state.snakeDirection !== "down"){
            state.snakeDirection = "up";
        }
    }
    else if (event.key === "ArrowDown") {
        if (state.snakeDirection !== "up"){
            state.snakeDirection = "down";
        }
    }
    else if (event.key === "ArrowLeft") {
        if (state.snakeDirection !== "right") {
            state.snakeDirection = "left";
        }
    }
}

const increaseSpeed = (incrementAmount) => state.interval = state.interval - (state.interval * incrementAmount);

//main game loop function which calls all out game logic and render functions
const mainGameLoop = () => {
    moveSnake();
    render();
    if (wallCollisionDetected() || snakeCollisionDetected()) {
        gameOver();
    }
    if (mouseCollisionDetected()) {
        growSnake();
        updateMouse();
        increaseSpeed(.1);
    }
}

//resets the game and stops snake movement
const gameOver = () => {
    setNewHighScore(state.snakeSquares.length - 1);
    clearInterval(state.snakeMovement)
    alert(`Game Over! Your score was: ${state.snakeSquares.length - 1}`);
    startGame();
}

const startGame = () => {
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
    state.snakeMovement = setInterval(mainGameLoop, state.interval);
}

const wallCollisionDetected = () => {
    let collision = false;

    const snakeHead = state.snakeSquares[0];
    const [x,y] = coordArrayToInt(snakeHead);

    if (x > BOARD_SIZE_X - 1 || x <= -1) {
        collision = true;
    }
    else if (y > BOARD_SIZE_Y - 1 || y <= -1) {
        collision = true;
    }
    return collision;
}

const snakeCollisionDetected = () => {
    const snakeHead = state.snakeSquares[0];
    const collision =  state.snakeSquares.find((snakeBodySquare, index) => {
        if (index !== 0 && areCoordinatesEqual(snakeHead, snakeBodySquare)) return true;
        return false
    })
    //cast to a boolean to avoid any weird behaviour from javscript
    return Boolean(collision);
}

const setNewHighScore = (newScore) => {
    if (newScore > HIGH_SCORE) {
        HIGH_SCORE = newScore;
    }
}

//returns true if snake head is on a mouse square
const mouseCollisionDetected = () => areCoordinatesEqual(state.snakeSquares[0], state.mouse);

const growSnake = () => {
    state.snakeSquares.push(state.lastTailLocation);
}

const updateMouse = () => {
    const currentMouseElem = getElemByCoord(state.mouse.toString());
    currentMouseElem.classList.remove('mouse');

    state.mouse = assignRandomCoordinate();
    const newMouseElem = getElemByCoord(state.mouse.toString());
    newMouseElem.classList.add('mouse');
    renderMouse();
}

// ***************** DOM MANIPULATION FUNCTIONS *****************
const renderBoard = () => {
    //empty the element
    boardElem.innerHTML = '';

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
        const coordString = state.snakeSquares[i].toString();
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

const renderMouse = () => {
    const coordString = state.mouse.toString();
    const mouseSquare = getElemByCoord(coordString);

    mouseSquare.classList.add('mouse');
}

const renderScore = () => {
    const highScoreElem = document.querySelector('#high-score');
    const currentScoreElem = document.querySelector('#current-score');

    highScoreElem.innerHTML = `High Score: ${HIGH_SCORE}`;
    currentScoreElem.innerHTML = `Current Score: ${state.snakeSquares.length - 1}`;
}

const render = () => {
    renderBoard();
    renderSnake();
    renderMouse();
    renderScore();
}

// ***************** EVENT LISTENERS *****************
document.addEventListener('keydown', handleUserInput)

// ***************** WEBPAGE INITIALIZATION *****************
startButtonElem.addEventListener('click', startGame);