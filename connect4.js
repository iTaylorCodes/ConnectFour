/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
	const htmlBoard = document.querySelector('#board');

	// Creates each column top and gives them a click event
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// Creates rows and cells for the gameboard and give each cell a unique ID based on location
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		const cell = document.getElementById(`${y}-${x}`);
		if (cell.childElementCount === 0) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
	const cell = document.getElementById(`${y}-${x}`);
	const piece = document.createElement('div');
	piece.className = currPlayer === 1 ? 'piece p1' : 'piece p2';
	cell.appendChild(piece);
}

/** endGame: announce game end */
function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	placeInTable(y, x);
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie Game!');
	}

	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([y, x]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			// Checks for horizontal win
			const horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3]
			];
			// Checks for a vertical win
			const vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x]
			];
			// Checks for a diagonal right win
			const diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3]
			];
			// Checks for a diagonal left win
			const diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3]
			];
			// If any win occurs return true
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();

// Changes the column top to show which players turn it is

const columnTop = Array.from(document.querySelectorAll('#column-top td'));
for (let top of columnTop) {
	top.addEventListener('mousemove', hoverPiece);
	top.addEventListener('mouseleave', function (e) {
		e.target.style.backgroundColor = 'white';
	});
}

function hoverPiece(e) {
	e.target.style.backgroundColor = currPlayer === 1 ? 'red' : 'blue';
}
