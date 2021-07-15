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
    console.log(startPositionX);
    const startPositionY = Math.floor(Math.random() * BOARD_SIZE_Y).toString();
    console.log(startPositionY)
    const startPosition = [startPositionX, startPositionY];
    //add that position to the snake squares
    state.snakeSquares.unshift(startPosition);
    //the front of the snake
    state.snakeHead = [state.snakeSquares[0]];
    //the back of the snake
    state.snakeTail = state.snakeSquares[state.snakeSquares.length - 1];
}

// ***************** DOM SELECTORS *****************
const boardElem = document.querySelector("#board");

// ***************** GAME LOGIC HELPER FUNCTIONS *****************

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

//takes an array with a x and y coordinate and colors that square to represent the snake's position
const setSnakeSquares = () => {
    //iterate through the current snakeSquares
    for (let i = 0; i < state.snakeSquares.length; i++) {
        //get the coordinates and turn them into a string using coordArrayToString
        const coordString = coordArrayToString(state.snakeSquares[i]);
        console.log("setSnakeSquares function, coordString variable: " + coordString)
        //use our getElemByCoord function to get the DOM div element attached to our coordinates 
        const snakeSquare = getElemByCoord(coordString);
        //give it the snake class, turning the background red
        snakeSquare.classList.add('snake');
    }
}

//expects a string of coordinates such as '9,4' or '1,4' and returns the div element with that dataset
const getElemByCoord = (coordString) => {
    return document.querySelector("[data-coordinates='" + coordString + "']");
}

//takes an array with two coordinates and turns it into a string
const coordArrayToString = (coordArray) => {
    return `${coordArray[0]},${coordArray[1]}`
}

//takes in a coordinate and sets the corresponging element's class to snake or removes it if it already exists
const moveSnake = (coordString) => {
    const snakeSquare = getElemByCoord(coordString);

    snakeSquare.classList.add('snake');
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

// ***************** DOM MANIPULATION FUNCTIONS *****************
const renderBoard = () => {
    //empty the element
    boardElem.innerHTML = '';
    //get the new snake head
    state.snakeHead = state.snakeSquares[0];
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

    //renders the snake squares by giving all the elements with coordinates in snakeSquares list the 'snake' class
    setSnakeSquares();

}

// ***************** EVENT LISTENERS *****************
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight") {
        //creates newCoordsArray and newCoordsString variables from the head of the snake
        const {newCoordsArray, newCoordsString} = changeXCoord(state.snakeHead, "right");
        //gets the element of the square to the right of the head
        const rightSquareElem = getElemByCoord(newCoordsString);
        //adds the new square to the snakeSquares array
        state.snakeSquares.unshift(newCoordsArray);
        //gets rid of the tail of the snake
        state.snakeSquares.pop();
        //renders the board
        renderBoard();
    }
    if (event.key === "ArrowUp") {
         //creates newCoordsArray and newCoordsString variables from the head of the snake
        const {newCoordsArray, newCoordsString} = changeYCoord(state.snakeHead, "up");
        //gets the element of the square to the right of the head
        const rightSquareElem = getElemByCoord(newCoordsString);
        //adds the new square to the snakeSquares array
        state.snakeSquares.unshift(newCoordsArray);
        //gets rid of the tail of the snake
        state.snakeSquares.pop();
        //renders the board
        renderBoard();
        console.log("Up arrow was pressed");
    }
    if (event.key === "ArrowDown") {
         //creates newCoordsArray and newCoordsString variables from the head of the snake
        const {newCoordsArray, newCoordsString} = changeYCoord(state.snakeHead, "down");
        //gets the element of the square to the right of the head
        const rightSquareElem = getElemByCoord(newCoordsString);
        //adds the new square to the snakeSquares array
        state.snakeSquares.unshift(newCoordsArray);
        //gets rid of the tail of the snake
        state.snakeSquares.pop();
        //renders the board
        renderBoard();
        console.log("Down arrow was pressed");
    }
    if (event.key === "ArrowLeft") {
         //creates newCoordsArray and newCoordsString variables from the head of the snake
        const {newCoordsArray, newCoordsString} = changeXCoord(state.snakeHead, "left");
        //gets the element of the square to the right of the head
        const rightSquareElem = getElemByCoord(newCoordsString);
        //adds the new square to the snakeSquares array
        state.snakeSquares.unshift(newCoordsArray);
        //gets rid of the tail of the snake
        state.snakeSquares.pop();
        //renders the board
        renderBoard();
        console.log("Left arrow was pressed");
    }

})

//test zone
boardElem.addEventListener('click', function(event) {
    console.log(event.target.dataset['coordinates']);
    console.log(typeof(event.target.dataset['coordinates']));
    // const coords = event.target.dataset['coordinates'].split();
    //console.log(coords);
    const coords = event.target.dataset['coordinates']
    const bottomRight = document.querySelector("[data-coordinates='" + coords + "']");

    console.log(bottomRight);
    bottomRight.classList.add('snake');

    
}) 


resetState();
renderBoard();