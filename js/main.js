
'use strict'

const SIZE = 8;
const MINES = 12;
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
    mineCounter: gLevel.mines,
    secsPassed: 0,
    minPassed: 0,
    timerInterval: 0,
    elTimer: document.querySelector('.timer'),
    minesLocArr: [],
}


function initGame() {

    gBoard = buildBoard();
    getRandomMine(MINES);
    renderBoard(gBoard);
    console.log('mines location array:', gGame.minesLocArr);
    revealMines();
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
            setMinesNegsCount(i, j, board);
            var cellInnerText = '';

            var className = `unrevealed cell-${i}-${j}`;

            strHTML += `<td class="${className}" 
            oncontextmenu="cellMarked(this, ${i}, ${j}); return false;" 
            onclick="cellClicked(this, ${i}, ${j})"> ${cellInnerText} </td>`;
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
    gGame.mineCounter = gLevel.mines;
    gGame.secsPassed = 0;
    gGame.minPassed = 0;
    gGame.timerInterval = 0;
    gGame.elTimer.innerText = `0${gGame.minPassed}:0${gGame.secsPassed}`;
    gGame.minesLocArr = [];

    initGame();
}

function firstClick(i, j) {
    if (gBoard[i][j].isMine) resetGame();
    else {
        gGame.timerInterval = setInterval(timer, 1000);
        gGame.isOn = true;
    }
    return;
}

function checkGameOver() {
    gGame.isOn = false;
    clearInterval(gGame.timerInterval);
    revealMines();
    alert('Oh nooo! You have been exploded to pieces!');

    setTimeout(resetGame, 3000);
}

function checkWin() {
    if (gGame.mineCounter !== 0) return false;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isMine) {
                if (!gBoard[i][j].isShown) return false;
            }
        }
    }
    clearInterval(gGame.timerInterval);
    gGame.isOn = false;
    revealBoard(gBoard);
    alert('Congrats! you have survived!');
    setTimeout(resetGame, 3000);
}

function cellClicked(elCell, i, j) {
    var minesAround;

    if (!gGame.isOn) firstClick(i, j);

    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        gGame.mineCounter--;
        return checkGameOver();
    }
    else if (gBoard[i][j].isMarked) return;
    else {
        minesAround = gBoard[i][j].minesAroundCount;
        gBoard[i][j].isShown = true;
        renderCell(elCell, minesAround);
        checkWin();
    }
}


function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isMine) gGame.mineCounter--;
    // console.log('gGame.mineCounter:', gGame.mineCounter);
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        renderCell(elCell, FLAG);
    }
    checkWin();
    return false;
}

function expandShown(board, elCell) {

}
