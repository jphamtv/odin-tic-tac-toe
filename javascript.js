// javascript.js

// ======== PLAYERS LOGIC (FACTORY FUNCTION) ========== 


// Create a factory function for Players
function Player(name, marker) {
  return { name, marker };
}


function createPlayers(playerOneName, playerTwoName) {
  // Get names from the form and create players
  const playerOne = Player(playerOneName, 'X');
  const playerTwo = Player(playerTwoName, 'O');

  return { playerOne, playerTwo };
}


const formElement = document.querySelector('#player-name-input');

formElement.addEventListener('submit', function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get values from the form fields
  const playerOneName = document.querySelector('#player-one-name').value;
  const playerTwoName = document.querySelector('#player-two-name').value;

  // Create players 
  const players = createPlayers(playerOneName, playerTwoName);

  // Start the game
  gameFlowModule.startGame(players);  
})


// ======== GAMEBOARD LOGIC (MODULE PATTERN) ========== 

const gameBoardModule = (function() {
  let board = {
    1: " ", 2: " ", 3: " ",
    4: " ", 5: " ", 6: " ",
    7: " ", 8: " ", 9: " "
  };

  function getBoard() {
    return board;
  }

  function setCell(cellId, marker) {
    if(board[cellId] === " ") {
      board[cellId] = marker;
    }
  }

  function resetBoard () {
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

// Initialize the board
gameBoardModule.resetBoard();

// Function to display the board on the UI
function displayBoard() {
  const board = gameBoardModule.getBoard();

  // Get a reference of the container that holds the game board
  const playGameContainer = document.querySelector('.play-game-container');

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

      const currentPlayer = gameFlowModule.getCurrentPlayer();

      gameBoardModule.setCell(cellId, currentPlayer.marker);

      // Update the innerHTML with current player's marker
      event.target.innerHTML = gameFlowModule.addMarkerToBoard(cellId);

      gameFlowModule.togglePlayer();

      displayBoard();
      
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

const gameFlowModule = (function() {
  let playerOne;
  let playerTwo;
  let currentPlayer;

  function startGame(players) {
    playerOne = players.playerOne;
    playerTwo = players.playerTwo;
    currentPlayer = playerOne;
    displayBoard();
  }

  function restartGame() {
    gameBoardModule.resetBoard();
    displayBoard();
  }

  // Export togglePlayer
  function togglePlayer() {
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
  }

  // Export getCurrentPlayer for use in main code
  function getCurrentPlayer() {
    return currentPlayer;
  }

  function addMarkerToBoard(cellId) {
    gameBoardModule.setCell(cellId, currentPlayer.marker);
    return currentPlayer.marker;
  }

  function checkCells(a, b, c, marker) {
    const board = gameBoardModule.getBoard();
    return board[a] === marker && board[b] === marker && board[c] === marker;
  }

  function checkForWinner() {
    if (
      checkCells(1, 2, 3, playerOne.marker) ||
      checkCells(4, 5, 6, playerOne.marker) ||
      checkCells(7, 8, 9, playerOne.marker) ||
      checkCells(1, 5, 9, playerOne.marker) ||
      checkCells(3, 5, 7, playerOne.marker)
    ) {
      return `${playerOne.name} wins!`;
  
    } else if (
      checkCells(1, 2, 3, playerTwo.marker) ||
      checkCells(4, 5, 6, playerTwo.marker) ||
      checkCells(7, 8, 9, playerTwo.marker) ||
      checkCells(1, 5, 9, playerTwo.marker) ||
      checkCells(3, 5, 7, playerTwo.marker)
    ) {
      return `${playerTwo.name} wins!`;
    }

    // Check for a tie
    const board = gameBoardModule.getBoard();
    if (Object.values(board).every(cell => cell !== " ")) {
      return "It's a draw.";
    }
  }

  return {
    startGame,
    restartGame,
    getCurrentPlayer,
    togglePlayer,
    addMarkerToBoard,
    checkForWinner,
  };

})();

