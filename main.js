"use strict";

/**
 * Vanilla Tic Tac Toe with enhanced feedback:
 * - highlights winning cells
 * - disables board after win/draw
 * - clear status updates
 */

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const state = {
  board: Array(9).fill(null), // null | "X" | "O"
  currentPlayer: "X",
  gameOver: false,
  winningLine: null, // number[] | null
};

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

init();

function init() {
  renderBoard();
  setStatus(`${state.currentPlayer}'s turn`);
  restartBtn.addEventListener("click", resetGame);
}

function renderBoard() {
  boardEl.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cellBtn = document.createElement("button");
    cellBtn.type = "button";
    cellBtn.className = "cell";
    cellBtn.setAttribute("role", "gridcell");
    cellBtn.dataset.index = String(i);

    cellBtn.addEventListener("click", onCellClick);

    boardEl.appendChild(cellBtn);
  }

  paint();
}

function onCellClick(e) {
  const index = Number(e.currentTarget.dataset.index);

  if (state.gameOver) return;
  if (state.board[index] !== null) return;

  state.board[index] = state.currentPlayer;

  const result = evaluateBoard();
  if (result.type === "win") {
    state.gameOver = true;
    state.winningLine = result.line;
    setStatus(`${state.currentPlayer} wins!`);
  } else if (result.type === "draw") {
    state.gameOver = true;
    state.winningLine = null;
    setStatus("Draw!");
  } else {
    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    setStatus(`${state.currentPlayer}'s turn`);
  }

  paint();
}

function evaluateBoard() {
  // win
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = state.board[a];
    if (v && v === state.board[b] && v === state.board[c]) {
      return { type: "win", line };
    }
  }

  // draw
  const hasEmpty = state.board.some((cell) => cell === null);
  if (!hasEmpty) {
    return { type: "draw" };
  }

  return { type: "playing" };
}

function paint() {
  const cells = boardEl.querySelectorAll(".cell");

  cells.forEach((cellEl, i) => {
    const value = state.board[i];
    cellEl.textContent = value ?? "";

    // styling helpers
    cellEl.classList.toggle("filled", value !== null);
    cellEl.classList.toggle("x", value === "X");
    cellEl.classList.toggle("o", value === "O");

    // disable interaction if filled or game over
    const disabled = state.gameOver || value !== null;
    cellEl.setAttribute("aria-disabled", disabled ? "true" : "false");
    cellEl.disabled = disabled;
  });

  // clear old win highlights
  cells.forEach((c) => c.classList.remove("win"));

  // highlight winning line
  if (state.winningLine) {
    for (const idx of state.winningLine) {
      cells[idx].classList.add("win");
    }
  }
}

function setStatus(text) {
  statusEl.textContent = text;
}

function resetGame() {
  state.board = Array(9).fill(null);
  state.currentPlayer = "X";
  state.gameOver = false;
  state.winningLine = null;

  setStatus(`${state.currentPlayer}'s turn`);
  paint();
}
