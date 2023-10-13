// javascript.js

// ======== PLAYERS LOGIC ========== 

// Create a factory function for Players
function Player(name, marker) {
  return { name, marker };
}

// Create players, will have to get names from form eventually
const playerOne = Player('Player 1', 'X');
const playerTwo = Player('Payer 2', 'O');


// ======== GAMEBOARD LOGIC ========== 

// Create a module pattern for gameBoard
const gameBoard = {
  1: "X", 2: " ", 3: " ",
  4: " ", 5: "O", 6: " ",
  7: " ", 8: " ", 9: "X"
};

// Function to display the board
function displayBoard () {
  // Get a reference to the game board container element
  const containerElement = document.querySelector('.container');

  // Clear the board
  containerElement.innerHTML = '';

  //Loop through the board object and update the cells
  Object.keys(gameBoard).forEach(cell => {
    const newCell = document.createElement('div');

    // Set the class attribute
    newCell.classList.add("cell");

    // Set the data attribute to match the cell number
    newCell.dataset.cellId = cell;
    
    //HTML structure of the new cells
    newCell.innerHTML = `<button>${gameBoard[cell]}</button>`;

    // Add the new cell
    containerElement.appendChild(newCell);
  })
}

// Attach the event listeners for the cells when the page loads
window.addEventListener('load', attachCellButtonListeners);

// Function to attach event listener for the gameBoard
function attachCellButtonListeners() {
  const containerBoard = document.querySelector('container');
  containerBoard.addEventListener('click', function (event) {
    if (event.target.classList.contains('cell')) {
      
      // Get the cell ID from the data-cell-id attribute
      const cellId = event.target.dataset.cellId;

      // Update cell by ID
      addMarkerToBoard(parseInt(cellId));
    }
  })
}

function restartGame () {
  gameBoard = {
    1: " ", 2: " ", 3: " ",
    4: " ", 5: " ", 6: " ",
    7: " ", 8: " ", 9: " "
  };
  displayBoard();
}

displayBoard();


// ======== GAMEFLOW LOGIC ========== 

const cellElement = document.querySelectorAll('button');

cellElement.addEventListener('click', function (event) {

})

function addMarkerToBoard(player, marker) {

  // Add the marker to the gameBoard
  gameBoard
}

// Create a module for gameFlow
const gameFlow = (function () {
  let marker = 'X'
  let i = 0;
  let cell;

  do {    
    cell = prompt(`Turn for ${marker}. Which cell to mark?`);

    if (gameBoard[cell] === " ") {
      gameBoard[cell] = marker;    
    } else {
      return;
    }
    
    if (marker === 'X') {
      marker = 'O';
    } else {
      marker = 'X';
    };
    printBoard();
    checkForWinner();
    i++;
  } while (i < 9);
})();

// Create function that checks when the game is over, 3 in a row + tie
function checkCells(a, b, c, marker) {
  return gameBoard[a] === marker && gameBoard[b] === marker && gameBoard[c] === marker;
}

function checkForWinner() {
  for (const marker of ['X', 'O']) {
    if (
      checkCells(1, 2, 3, marker) ||
      checkCells(4, 5, 6, marker) ||
      checkCells(7, 8, 9, marker) ||
      checkCells(1, 5, 9, marker) ||
      checkCells(3, 5, 7, marker)
    ) {
      console.log(`Player ${marker === 'X' ? 1 : 2} wins!`);
      return `Player ${marker === 'X' ? 1 : 2} wins!`;
    }
  }

  if (Object.values(gameBoard).every(cell => cell !== " ")) {
    console.log("It's a tie!");
    return "It's a tie!";
  }
}

