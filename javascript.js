// javascript.js

// ======== PLAYERS LOGIC (FACTORY FUNCTION) ========== 

// Create a factory function for Players
function Player(name, marker) {
  return { name, marker };
}


function createPlayers(playerOneName, playerTwoName) {
  // Get names from the form and create players using factory function
  const playerOne = Player(playerOneName, 'X');
  const playerTwo = Player(playerTwoName, 'O');

  return { playerOne, playerTwo };
}

// Get the name iput form element
const formElement = document.querySelector('#player-name-input');

// Get the div that holds the start game form
const startGameContainer = document.querySelector('.start-game-container');

// Get the names and start the game
formElement.addEventListener('submit', function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get values from the form fields
  const playerOneName = document.querySelector('#player-one-name').value;
  const playerTwoName = document.querySelector('#player-two-name').value;

  // Create players 
  const players = createPlayers(playerOneName, playerTwoName);

  // Hide the start game container
  startGameContainer.style.display = 'none';

  // Call startGame() and pass the players to the function
  gameFlowModule.startGame(players);
})


// ======== GAMEBOARD LOGIC (MODULE PATTERN) ========== 

const gameBoardModule = (function () {
  // Initialize the board to use in resetBoard function
  let board = {
    1: " ", 2: " ", 3: " ",
    4: " ", 5: " ", 6: " ",
    7: " ", 8: " ", 9: " "
  };

  // Function to get the board from module
  function getBoard() {
    return board;
  }

  // Function to assign current player's marker to the cell ID
  function setCell(cellId, marker) {
    if (board[cellId] === " ") {
      board[cellId] = marker;
      return true;
    }
    return false;
  }

  // Function to clear all markers
  function resetBoard() {
    board = {
      1: " ", 2: " ", 3: " ",
      4: " ", 5: " ", 6: " ",
      7: " ", 8: " ", 9: " "
    };
  }

  return {
    getBoard,
    setCell,
    resetBoard
  };
})();


// Get a reference of the container that holds the game board
const playGameContainer = document.querySelector('.play-game-container');

// Function to display the board on the UI
function displayBoard() {
  const board = gameBoardModule.getBoard();

  // Get a reference to the game board element
  const gameBoardElement = document.querySelector('.game-board');

  // Show the game board UI container
  playGameContainer.style.display = 'flex';

  // Clear the board
  gameBoardElement.innerHTML = '';

  //Loop through the board object and update the cells
  Object.keys(board).forEach(cell => {
    const newCell = document.createElement('div');

    // Set the class attribute
    newCell.classList.add("cell");

    // Set the data attribute to match the cell number
    newCell.dataset.cellId = cell;

    //HTML structure of the new cells
    newCell.innerHTML = `<button class="marker-button">${board[cell]}</button>`;

    // Add the new cell
    gameBoardElement.appendChild(newCell);
  })
}

// Attach the event listeners for the cells when the page loads
window.addEventListener('load', attachCellButtonListeners);

// Get the reference for the dialog modal
const dialog = document.querySelector("dialog");

function attachCellButtonListeners() {
  const gameBoardContainer = document.querySelector('.game-board');
  gameBoardContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('marker-button')) {

      // Get the cell div from the parent element
      const cellDiv = event.target.parentElement;

      // Get the cell ID from the data-cell-id attribute of the cell div
      const cellId = parseInt(cellDiv.dataset.cellId);

      // Get the current player
      const currentPlayer = gameFlowModule.getCurrentPlayer();

      const cellWasEmpty = (gameBoardModule.getBoard()[cellId] === " ");

      // Assign the marker to the selected cell
      gameBoardModule.setCell(cellId, currentPlayer.marker);

      // Update the innerHTML with current player's marker
      event.target.innerHTML = gameFlowModule.addMarkerToBoard(cellId);

      // Toggle the player for the next move
      if (cellWasEmpty) {
        gameFlowModule.togglePlayer();
      }

      // Refresh the board UI
      displayBoard();

      // Check if there's a winner, or tie. Show the dialog modal if so.
      const winnerElement = document.querySelector('.winner-announcement');
      const winner = gameFlowModule.checkForWinner();
      if (winner) {
        winnerElement.innerHTML = `${winner}`;
        dialog.showModal();
      }
    }
  });
}


// ======== GAMEFLOW LOGIC (MODULE PATTERN) ========== 

const gameFlowModule = (function () {
  // Initialize to use in the functions
  let playerOne;
  let playerTwo;
  let currentPlayer;

  // Function to initialize players, set current player, and start the game.
  function startGame(players) {
    playerOne = players.playerOne;
    playerTwo = players.playerTwo;
    currentPlayer = playerOne;
    displayBoard();
  }

  // Function to reset the game for the current players
  function restartGame() {
    gameBoardModule.resetBoard();
    displayBoard();
    currentPlayer = playerOne;
  }

  // Function to quit game and reset board and players
  function quitGame() {
    gameBoardModule.resetBoard();
    playerOne = null;
    playerTwo = null;
  }

  // Function to toggle player turns
  function togglePlayer() {
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
  }

  // Function to export getCurrentPlayer for use in main code
  function getCurrentPlayer() {
    return currentPlayer;
  }

  // Function to add current player's marker to the board
  function addMarkerToBoard(cellId) {
    gameBoardModule.setCell(cellId, currentPlayer.marker);
    return currentPlayer.marker;
  }

  // Function template for checkWinningCondition function
  function checkCells(a, b, c, marker) {
    const board = gameBoardModule.getBoard();
    return board[a] === marker && board[b] === marker && board[c] === marker;
  }

  // Helper function to simplify code
  function checkWinningCondition(player) {
    return (
      checkCells(1, 2, 3, player.marker) ||
      checkCells(4, 5, 6, player.marker) ||
      checkCells(7, 8, 9, player.marker) ||
      checkCells(1, 4, 7, player.marker) ||
      checkCells(2, 5, 8, player.marker) ||
      checkCells(3, 6, 9, player.marker) ||
      checkCells(1, 5, 9, player.marker) ||
      checkCells(3, 5, 7, player.marker)
    );
  }

  // Function to check for winner, or draw
  function checkForWinner() {
    if (checkWinningCondition(playerOne)) {
      return `${playerOne.name} wins!`;
    } else if (checkWinningCondition(playerTwo)) {
      return `${playerTwo.name} wins!`;
    }

    const board = gameBoardModule.getBoard();
    if (Object.values(board).every(cell => cell !== " ")) {
      return "It's a draw.";
    }
  }

  return {
    startGame,
    restartGame,
    quitGame,
    getCurrentPlayer,
    togglePlayer,
    addMarkerToBoard,
    checkForWinner,
  };

})();


const restartGameButton = document.querySelector('.reset-button');
const playAgainButton = document.querySelector('.play-again-button');
const quitButtons = document.querySelectorAll('.quit-button');

restartGameButton.addEventListener('click', function () {
  gameFlowModule.restartGame();
});

playAgainButton.addEventListener('click', function () {
  dialog.close();
  gameFlowModule.restartGame();
});

// Reset all and start fresh
quitButtons.forEach(button => {
  button.addEventListener('click', function () {
    gameFlowModule.quitGame();
    dialog.close();
    playGameContainer.style.display = 'none';
    startGameContainer.style.display = 'flex';
    formElement.reset(); // Reset the name input form
  });
});