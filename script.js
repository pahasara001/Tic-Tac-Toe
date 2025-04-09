const board = document.getElementById('board');
const statusText = document.getElementById('status');
let currentPlayer = 'X'; // You
let gameActive = true;
let gameState = Array(9).fill('');

// Sound effects
const moveSound = new Audio('move.mp3');
const winSound = new Audio('win.mp3');
const drawSound = new Audio('draw.mp3');

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(e) {
  const index = +e.target.dataset.index;
  if (gameState[index] !== '' || !gameActive || currentPlayer !== 'X') return;

  makeMove(index, 'X');
  moveSound.play(); // Play move sound

  if (gameActive) {
    setTimeout(aiMove, 500); // Delay to simulate thinking
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  renderBoard();

  if (checkWinner(player)) {
    winSound.play(); // Play win sound
    statusText.textContent = `Player ${player} wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    drawSound.play(); // Play draw sound
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = player === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// AI logic to make smarter moves
function aiMove() {
  if (!gameActive) return;

  const bestMove = getBestMove();
  makeMove(bestMove, 'O');
  moveSound.play(); // Play move sound
}

// Function to check for a winner
function checkWinner(player) {
  return winningConditions.some(condition => {
    const [a, b, c] = condition;
    return (
      gameState[a] === player &&
      gameState[b] === player &&
      gameState[c] === player
    );
  });
}

// AI logic to find the best move
function getBestMove() {
  const emptyIndices = gameState
    .map((val, idx) => (val === '' ? idx : null))
    .filter(idx => idx !== null);

  // 1. Check if AI can win
  for (let i = 0; i < emptyIndices.length; i++) {
    const index = emptyIndices[i];
    gameState[index] = 'O';
    if (checkWinner('O')) {
      gameState[index] = '';
      return index;
    }
    gameState[index] = '';
  }

  // 2. Block player's winning move
  for (let i = 0; i < emptyIndices.length; i++) {
    const index = emptyIndices[i];
    gameState[index] = 'X';
    if (checkWinner('X')) {
      gameState[index] = '';
      return index;
    }
    gameState[index] = '';
  }

  // 3. Pick a random move
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
  gameState = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';
  gameState.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.dataset.index = index;
    cellDiv.textContent = cell;
    if (cell) cellDiv.classList.add('taken');
    cellDiv.addEventListener('click', handleCellClick);
    board.appendChild(cellDiv);
  });
}

// Initial render
renderBoard();
statusText.textContent = `Player ${currentPlayer}'s turn`;
