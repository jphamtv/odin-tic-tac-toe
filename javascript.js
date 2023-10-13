// javascript.js

// ======== PLAYERS LOGIC (FACTORY FUNCTION) ========== 

// Create a factory function for Players
function Player(name, marker) {
  return { name, marker };
}

// Create players, will have to get names from form eventually
const playerOne = Player('Stacey', 'X');
const playerTwo = Player('Jack', 'O');


// ======== GAMEBOARD LOGIC (MODULE PATTERN) ========== 

// Create a module pattern for gameBoard
let gameBoard = {
  1: " ", 2: " ", 3: " ",
  4: " ", 5: " ", 6: " ",
  7: " ", 8: " ", 9: " "
};

// Function to display the board
function displayBoard() {
  // Get a reference to the game board container element
  const containerElement = document.querySelector('.game-board');

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
    newCell.innerHTML = `<button class="marker-button">${gameBoard[cell]}</button>`;

    // Add the new cell
    containerElement.appendChild(newCell);
  })
}

// Attach the event listeners for the cells when the page loads
window.addEventListener('load', attachCellButtonListeners);

// Function to attach event listener for the gameBoard
function attachCellButtonListeners() {
  const containerBoard = document.querySelector('.game-board');
  containerBoard.addEventListener('click', function (event) {
    if (event.target.classList.contains('marker-button')) {

      // Get the cell div from the button's parent 
      const cellDiv = event.target.parentElement;

      // Get the cell ID from the data-cell-id attribute of the cell div
      const cellId = cellDiv.dataset.cellId;

      // Update the button's innerHTML
      event.target.innerHTML = addMarkerToBoard(parseInt(cellId));

      displayBoard();

      const winner = checkForWinner();
      if (winner) {
        console.log("We have a winner!");
      }
      // Need to endgame if winner or tie
    }
  });
}

// Initiate the game for testing
displayBoard();

// Restart game
const restartButtons = document.querySelectorAll('.restart-button');
restartButtons.forEach((button) => {
  button.addEventListener('click', function (event) {
    restartGame();
  });
});

function restartGame() {
  gameBoard = {
    1: " ", 2: " ", 3: " ",
    4: " ", 5: " ", 6: " ",
    7: " ", 8: " ", 9: " "
  };
  displayBoard();
}

function startGame() {
  displayBoard();
}

function endGame() {
  //Stuff goes here
}



// ======== GAMEFLOW LOGIC (MODULE PATTERN) ========== 

// Initialize the current player
let currentPlayer = playerOne;

function addMarkerToBoard(cellId) {

  if (gameBoard[cellId] === " ") {

    // Add the marker to the board
    gameBoard[cellId] = currentPlayer.marker;
  } else {
    return;
  }

  // Toggle current player
  currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;

  return gameBoard[cellId];
}

// Create a module for gameFlow


// Create function that checks when the game is over, 3 in a row + tie
function checkCells(a, b, c, marker) {
  return gameBoard[a] === marker && gameBoard[b] === marker && gameBoard[c] === marker;
}

function checkForWinner() {
  if (
    checkCells(1, 2, 3, playerOne.marker) ||
    checkCells(4, 5, 6, playerOne.marker) ||
    checkCells(7, 8, 9, playerOne.marker) ||
    checkCells(1, 5, 9, playerOne.marker) ||
    checkCells(3, 5, 7, playerOne.marker)
  ) {
    console.log(`${playerOne.name} wins!`);
    return `${playerOne.name} wins!`;

  } else if (
    checkCells(1, 2, 3, playerTwo.marker) ||
    checkCells(4, 5, 6, playerTwo.marker) ||
    checkCells(7, 8, 9, playerTwo.marker) ||
    checkCells(1, 5, 9, playerTwo.marker) ||
    checkCells(3, 5, 7, playerTwo.marker)
  ) {
    console.log(`${playerTwo.name} wins!`);
    return `${playerTwo.name} wins!`;
  }

  // Check for a tie
  if (Object.values(gameBoard).every(cell => cell !== " ")) {
    console.log("It's a tie!");
    return "It's a tie!";
  }
}
