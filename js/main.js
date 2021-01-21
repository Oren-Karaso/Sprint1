
'use strict'

const SIZE = 4;
const MINES = 2
const MINE = '💣';
const FLAG = '⛳';


var gBoard;
var gBoardToShow;
var gLevel = {
    size: SIZE,
    mines: MINES
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    mineCounter: 0,
    secsPassed: 0,
    minPassed: 0,
    timerInterval: 0,
}


function initGame() {

    gBoard = buildBoard();
    getRandomMine(MINES);
    renderBoard(gBoard);
    // console.log('gBoard now:', gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell;
        }
    }
    // console.log(board)
    return board;
}


function renderBoard(board) {
    var strHTML = '<table border="1"<tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j].isMine;
            if (cell) cell = MINE;
            else {
                setMinesNegsCount(i, j, board);
                cell = '';
            }

            // cell = cell.isMine ? MINE : '';
            var className = `unrevealed cell-${i}-${j}`;
            
            strHTML += `<td class="${className}" 
            oncontextmenu="cellMarked(this, ${i}, ${j}); return false;" 
            onclick="cellClicked(this, ${i}, ${j})"> ${cell} </td>`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


function resetGame() {
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.mineCounter = 0;
    gGame.secsPassed = 0;
    gGame.minPassed = 0;
    gGame.timerInterval = 0;
    initGame();
}

function checkGameOver() {
    gGame.isOn = false;
    clearInterval(gGame.timerInterval);
    revealBoard(gBoard);
    alert('Oh nooo! You have been exploded to pieces!');

    resetGame();
}

function cellClicked(elCell, i, j) {
    var numberToShow;

    if (!gGame.isOn) {
        gGame.timerInterval = setInterval(timer, 1000);
        gGame.isOn = true;
    }

    if (gBoard[i][j].isMine) checkGameOver();
    else if (gBoard[i][j].isMarked) return;
    else numberToShow = gBoard[i][j].minesAroundCount;
    
    renderCell(elCell, numberToShow);
}


function cellMarked(elCell, i, j) {
    // console.log(gBoard[i][j].isMarked);
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        renderCell(elCell, FLAG);
    }
    // oncontextmenu.preventDefault();
    return false;
}

function expandShown(board, elCell) {

}
