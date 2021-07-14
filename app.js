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
        //get the coordinates and turn them into a string
        const coordString = `${state.snakeSquares[i][0]},${state.snakeSquares[i][1]}`
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

//takes an array with x and y coordinates and moves the snake based on the arrow key pushed
const moveSnake = (coordArray) => {

}

const changeYCoord = (coordArray, direction) => {
    let newCoords = ''

    return newCoords;
}

const changeXcoord = (coordArray, direction) => {
    let newCoords = ''

    return newCoords;
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

    setSnakeSquares();



    // //populate the board with squares div element (gonna try td and tr elements later on if this doesn't work)
    // for (let i = 0; i < state.board.length; i++) {
    //     //get the square number into a variable
    //     const square = state.board[i];
    //     //create a new div element to represent the square
    //     const squareElem = document.createElement('div')
    //     //give it a class so we can make changes to it in css
    //     squareElem.classList.add('square');
    //     //display the square number for visualization purposes
    //     squareElem.innerHTML = square
    //     //give the square an id so we can access it
    //     squareElem.dataset.squareNum = i;
    //     //append the square to main so that it shows up on the webpage
    //     boardElem.appendChild(squareElem);

    //     //if the square should contain a snakeSquare, color it
    //     if (state.snakeSquares.includes(i)) {
    //         squareElem.style.backgroundColor = 'red';
    //     }

    // }
}

// ***************** EVENT LISTENERS *****************
document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight") {
        console.log("Right arrow was pressed");
    }
    if (event.key === "ArrowUp") {
        console.log("Up arrow was pressed");
    }
    if (event.key === "ArrowDown") {
        console.log("Down arrow was pressed");
    }
    if (event.key === "ArrowLeft") {
        console.log("Left arrow was pressed");
    }
})

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