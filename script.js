let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameOver = false;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");

// Create board UI
function createBoard() {
  boardDiv.innerHTML = "";
  board.forEach((cell, index) => {
    const button = document.createElement("button");
    button.innerText = cell;
    button.classList.add("cell");
    button.addEventListener("click", () => humanMove(index));
    boardDiv.appendChild(button);
  });
}

function humanMove(index) {
  if (board[index] === "" && !gameOver) {
    board[index] = human;
    createBoard();

    if (checkWinner(board, human)) {
      statusText.innerText = "You Win!";
      gameOver = true;
      return;
    }

    if (isDraw(board)) {
      statusText.innerText = "Draw!";
      gameOver = true;
      return;
    }

    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = ai;
  createBoard();

  if (checkWinner(board, ai)) {
    statusText.innerText = "AI Wins!";
    gameOver = true;
    return;
  }

  if (isDraw(board)) {
    statusText.innerText = "Draw!";
    gameOver = true;
  }
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, ai)) return 10 - depth;
  if (checkWinner(board, human)) return depth - 10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = ai;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = human;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(board, player) {
  return winPatterns.some(pattern => {
    return pattern.every(index => board[index] === player);
  });
}

function isDraw(board) {
  return board.every(cell => cell !== "");
}

// Initialize
createBoard();

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusText.innerText = "";
  createBoard();
}