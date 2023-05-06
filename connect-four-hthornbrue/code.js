// DOM Elements
const allCells = document.querySelectorAll(".cell:not(.row-top)");
const topCells = document.querySelectorAll(".cell.row-top");
const resetButton = document.querySelector(".reset");
const statusSpan = document.querySelector(".status");

// Game State
let moveCounter = 0;
let didWin = false;
let gameActive = true;
let player1IsNext = true;

// Game Logic Functions
const generateColumns = () => {
  const columns = Array.from({ length: 7 }, (_, colIndex) =>
    Array.from({ length: 7 }, (_, rowIndex) =>
      rowIndex === 6 ? topCells[colIndex] : allCells[rowIndex * 7 + colIndex]
    ).reverse()
  );
  return columns;
};

const generateRows = (columns) =>
  columns.map((_, rowIndex) => columns.map((column) => column[rowIndex]));

const columns = generateColumns();
const rows = generateRows(columns);

const classListToArray = (cell) => [...cell.classList];

const columnEmptyCell = (columnLocation) => {
  const column = columns[columnLocation];
  const removeTopOfColumn = column.slice(0, 6);

  for (const cell of removeTopOfColumn) {
    const classList = classListToArray(cell);
    if (!classList.includes("yellow") && !classList.includes("red")) {
      return cell;
    }
  }
  return null;
};

const cellLocation = (cell) => {
  const classList = classListToArray(cell);
  const rowClass = classList.find((classNameInArray) =>
    classNameInArray.includes("row")
  );
  const columnClass = classList.find((classNameInArray) =>
    classNameInArray.includes("col")
  );
  const rowLocation = parseInt(rowClass[4], 10);
  const columnLocation = parseInt(columnClass[4], 10);

  return [rowLocation, columnLocation];
};

const clearClassColor = (columnLocation) => {
  const topCell = topCells[columnLocation];
  topCell.classList.remove("yellow");
  topCell.classList.remove("red");
};

const cellColor = (cell) => {
  const classList = classListToArray(cell);
  if (classList.includes("yellow")) {
    return "yellow";
  }
  if (classList.includes("red")) {
    return "red";
  }
  return null;
};

// checkRows Function - Checks for instances of horizontal four in a row
const checkRows = () => {
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < 4; col++) {
      const startPos = rows[row][col];
      const color = cellColor(startPos);

      if (
        color &&
        color === cellColor(rows[row][col + 1]) &&
        color === cellColor(rows[row][col + 2]) &&
        color === cellColor(rows[row][col + 3])
      ) {
        displayWinner.append(`${color.toUpperCase()} WINS!`);
        changeDisplayWinnerColor(color);
        displayGameOver.append(`GAME OVER`);
        didWin = true;
        return;
      }
    }
  }
};
// checkColumns Function - Checks for instances of vertical four in a row
const checkColumns = () => {
  for (let col = 0; col < columns.length; col++) {
    for (let row = 0; row < 3; row++) {
      const startPos = columns[col][row];
      const color = cellColor(startPos);

      if (
        color &&
        color === cellColor(columns[col][row + 1]) &&
        color === cellColor(columns[col][row + 2]) &&
        color === cellColor(columns[col][row + 3]) &&
        color === cellColor(columns[col][row + 4])
      ) {
        displayWinner.append(`${color.toUpperCase()} WINS!`);
        changeDisplayWinnerColor(color);
        displayGameOver.append(`GAME OVER`);
        didWin = true;
        return;
      }
    }
  }
};
// checkDiagonal1 Function - Checks for instances of diagonal four in a row
const checkDiagonalWin1 = () => {
  for (let row = 0; row <= 2; row++) {
    for (let col = 0; col <= 3; col++) {
      const startPos = allCells[row * 7 + col];
      const color = cellColor(startPos);

      if (
        color &&
        color === cellColor(allCells[(row + 1) * 7 + (col + 1)]) &&
        color === cellColor(allCells[(row + 2) * 7 + (col + 2)]) &&
        color === cellColor(allCells[(row + 3) * 7 + (col + 3)])
      ) {
        displayWinner.append(`${color.toUpperCase()} WINS!`);
        changeDisplayWinnerColor(color);
        displayGameOver.append(`GAME OVER`);
        didWin = true;
      }
    }
  }
};
// checkDiagonal2 Function - Checks for instances of anti-diagonal four in a row
const checkDiagonalWin2 = () => {
  for (let row = 0; row <= 2; row++) {
    for (let col = 3; col <= 6; col++) {
      const startPos = allCells[row * 7 + col];
      const color = cellColor(startPos);

      if (
        color &&
        color === cellColor(allCells[(row + 1) * 7 + (col - 1)]) &&
        color === cellColor(allCells[(row + 2) * 7 + (col - 2)]) &&
        color === cellColor(allCells[(row + 3) * 7 + (col - 3)])
      ) {
        displayWinner.append(`${color.toUpperCase()} WINS!`);
        changeDisplayWinnerColor(color);
        displayGameOver.append(`GAME OVER`);
        didWin = true;
      }
    }
  }
};
// checkTies Function - Checks for ties
const checkTies = () => {
  if ((moveCounter === 42) & (didWin === false)) {
    displayWinner.append("Tie!");
    displayGameOver.append(`GAME OVER`);
    gameActive = false;
  }
};

// Checks for horizontal wins, vertical wins, diagonal wins, anti-diagonal wins, & ties
const checkForWin = () => {
  checkRows();
  checkColumns();
  checkDiagonalWin1();
  checkDiagonalWin2();
  checkTies();
};

// Event Listeners
let mouseHover = (e) => {
  if (!gameActive) {
    return;
  }
  const cell = e.target;
  const [rowLocation, columnLocation] = cellLocation(cell);
  const playerChoiceRow = topCells[columnLocation];
  playerChoiceRow.classList.add(player1IsNext ? "yellow" : "red");
};

const mouseOut = (e) => {
  const cell = e.target;
  const [rowLocation, columnLocation] = cellLocation(cell);
  const playerChoiceRow = topCells[columnLocation];

  playerChoiceRow.classList.remove("yellow");
  playerChoiceRow.classList.remove("red");
};

const playerColumnClick = (e) => {
  if (didWin) {
    return;
  }
  const cell = e.target;
  const [rowLocation, columnLocation] = cellLocation(cell);
  const emptyColumnLocation = columnEmptyCell(columnLocation);
  if (!columnEmptyCell) {
    return;
  }

  emptyColumnLocation.classList.add(player1IsNext ? "yellow" : "red");
  emptyColumnLocation.classList.add("drop-animation");
  moveCounter += 1;
  checkForWin(cell);
  player1IsNext = !player1IsNext;
  clearClassColor(columnLocation);
  const topCell = topCells[columnLocation];
  topCell.classList.add(player1IsNext ? "yellow" : "red");
};

const resetGame = () => {
  gameActive = true;
  didWin = false;
  moveCounter = 0;
  displayWinner.innerHTML = "";
  displayGameOver.innerHTML = "";

  for (let r = 0; r < rows.length; r++) {
    for (let innerRows = 0; innerRows < rows[r].length; innerRows++) {
      rows[r][innerRows].classList.remove("yellow");
      rows[r][innerRows].classList.remove("red");
    }
  }
};

// Helper Functions
const changeDisplayWinnerColor = (color) => {
  displayWinner.style.color = color;
};

// Event Listeners Setup
for (const row of rows) {
  for (const cell of row) {
    cell.addEventListener("mouseover", mouseHover);

    cell.addEventListener("mouseout", mouseOut);

    cell.addEventListener("click", playerColumnClick);
  }
}

resetButton.addEventListener("click", resetGame);
