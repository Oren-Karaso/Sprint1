
'use strict'

const MINE = '💣';
const FLAG = '⛳';

var gSize = 8;
var gMines = 12;

var gBoard;
var gLevel = {
    size: gSize,
    mines: gMines
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
};

function initGame() {
    getGameLevel();
    gGame.mineCounter = gMines;  // for some reason cannot initial it through reset function

    // console.log('gMines:', gMines + 'gSize:', gSize + 'mineCounter:', gGame.mineCounter);
    gBoard = buildBoard();
    getRandomMine(gMines);
    renderBoard(gBoard);
    console.log('mines location array:', gGame.minesLocArr);
    revealMines();
    // console.log('gBoard now:', gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gSize; i++) {
        board.push([]);
        for (var j = 0; j < gSize; j++) {
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
}

function checkWin() {
    if (gGame.mineCounter !== 0) return false;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) return;
            else continue;
        }
    }
    clearInterval(gGame.timerInterval);
    gGame.isOn = false;
    revealBoard(gBoard);
    alert('Congrats! you have survived!');
}

function cellClicked(elCell, i, j) {
    var minesAround;

    if (!gGame.isOn) firstClick(i, j);

    if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        gGame.mineCounter--;
        checkGameOver();
    }
    else if (gBoard[i][j].isMarked) return;
//    else if (gBoard[i][j].minesAroundCount === 0) expandShown(elCell, i, j);
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

function expandShown(elCell, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            if (gBoard[i][j].minesAroundCount === 0) {
                var elCell = document.getElementsByClassName(`.unrevealed cell-${i}-${j}`);
                console.log(elCell.innerText);
                elCell.classList.add('revealed');
                elCell.classList.remove('unrevealed');
                elCell.innerHTML = 0;
                expandShown(i, j);
            }
        }
    }
    // console.log('for i=', cellI + ' for j=', cellJ + ' countNeighbors:', countNeighbors);
    // gBoard[cellI][cellJ].minesAroundCount = countNeighbors;
}

function getGameLevel() {
    var level = +prompt('Please choose your game level: 1 beginner (4X4 2 mines), 2 Medium (8X8 12 mines) or 3 for Expert (12X12 30 mines)');
    switch (level) {
        case 1: gMines = 2, gSize = 4
            break;
        case 2: gMines = 12, gSize = 8
            break;
        case 3: gMines = 30, gSize = 12
            break;
        default: gMines = 2, gSize = 4
    }
}
