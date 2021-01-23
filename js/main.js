
'use strict'

const MINE = '💣';
const FLAG = '⛳';


var mineSound = new Audio('explosion.mp3');
var winSound = new Audio('win.mp3');

var gRecord = localStorage.getItem('record');
var gEmoji = document.querySelector('.info-box h2');
var gPresentLivesNumber = document.querySelector('.lives-count span');


var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
};

var gLastCell = {
    content: 0,
    i: 0,
    j: 0,
    isMarked: false,
    isShown: false,
    isMine: false,
    minesAroundCount: 0

};

var gGame = {
    undoBtn: 1,
    isOn: false,
    isReseted: false,
    shownCount: 0,
    markedCount: 0,
    minesToWin: gLevel.mines,
    secsPassed: 0,
    minPassed: 0,
    timerInterval: 0,
    elTimer: document.querySelector('.timer'),
    minesLocArr: [],
    howManyLives: 3,
};


function initGame() {
    if (!gGame.isReseted) {
        getGameLevel();
        gGame.isReseted = false;
    }
    gPresentLivesNumber.innerText = gGame.howManyLives;
    gGame.minesToWin = gLevel.mines;
    gBoard = buildBoard();
    getRandomMine(gLevel.mines);
    renderBoard(gBoard);
    console.log('mines location array for developer:', gGame.minesLocArr);
}
//builds the board
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
        }
    }
    return board;
}

//renders the board
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

    gEmoji.innerText = '😃';

    gGame.undoBtn = 1;
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.minPassed = 0;
    gGame.timerInterval = 0;
    gGame.elTimer.innerText = `0${gGame.minPassed}:0${gGame.secsPassed}`;
    gGame.minesLocArr = [];
    gGame.howManyLives = 3;

    initGame();
}

function firstClick(i, j) {
    if (gBoard[i][j].isMine) {
        gGame.isReseted = true;
        resetGame();
    }
    else {
        gGame.timerInterval = setInterval(timer, 1000);
        gGame.isOn = true;
    }
    return;
}

function checkGameOver() {
    if (gGame.howManyLives > 0) return false;

    gGame.isOn = false;
    gGame.isReseted = false;

    gEmoji.innerText = '☠';
    clearInterval(gGame.timerInterval);
    // revealMines();
    alert('Oh nooo! You have been exploded to pieces!');
}

function checkWin() {
    if (gGame.minesToWin !== 0) return false;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked)
                if (isLastCell(i, j) === 1) continue;
        }
    }
    clearInterval(gGame.timerInterval);
    gGame.isReseted = false;
    gGame.isOn = false;
    // revealBoard(gBoard);

    gEmoji.innerText = '😎';
    winSound.play();
    alert('Congrats! you have survived!');
    manageRecord();
}

function cellClicked(elCell, i, j) {
    var cellContent;

    if (!gGame.isOn) {
        if (!gGame.minesToWin) return;
        if (gGame.howManyLives === 0) return;
        else firstClick(i, j);
    }

    if (gBoard[i][j].isShown) return;

    if (gBoard[i][j].isMarked) return;

    if (gBoard[i][j].isMine) {
        gEmoji.innerText = '🤯';
        gBoard[i][j].isShown = true;
        cellContent = MINE;
        // updateLastCell(i, j, cellContent);
        renderCell(elCell, cellContent);

        gGame.minesToWin--;
        gGame.howManyLives--;
        gGame.minesLocArr.pop();

        mineSound.play();
        alert('Watch it! You have just lost a limb...')
        gPresentLivesNumber.innerText = gGame.howManyLives;
        checkGameOver();
    } //else if (gBoard[i][j].minesAroundCount === 0) expandShown(elCell, i, j);
    else {
        cellContent = gBoard[i][j].minesAroundCount === 0 ? '' : gBoard[i][j].minesAroundCount;
        gBoard[i][j].isShown = true;
        // updateLastCell(i, j, cellContent);
        renderCell(elCell, cellContent);
        checkWin();
    }
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) {
        if (!gGame.minesToWin) return;
        if (gGame.howManyLives === 0) return;
    } else if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = true;
        if (gBoard[i][j].isMine) gGame.minesToWin--;

        renderCell(elCell, FLAG);
        // updateLastCell(i, j, elCell.innerText);
    } else return;

    checkWin();
}

function expandShown(elCell, cellI, cellJ) {
    console.log(elCell.innerText);

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;

            if ((gBoard[i][j].minesAroundCount === 0) &&
                (!gBoard[i][j].isMarked) && (!gBoard[i][j].isShown)) {

                // elCell.classList.add('revealed');
                // elCell.classList.remove('unrevealed');
                gBoard[i][j].isShown = true;
                elCell.innerHTML = gBoard[i][j].minesAroundCount;
                // console.log('gBoard[i][j]=', gBoard[i][j]);
                expandShown(elCell, i, j);                      //function calls itself
            }
        }
    }
}

function getGameLevel() {
    var level = +prompt('Please choose your game level: 1 beginner (4X4 2 mines), 2 Medium (8X8 12 mines) or 3 for Expert (12X12 30 mines)');
    switch (level) {
        case 1: gLevel.mines = 2, gLevel.size = 4, gGame.howManyLives = 1
            break;
        case 2: gLevel.mines = 12, gLevel.size = 8
            break;
        case 3: gLevel.mines = 30, gLevel.size = 12
            break;
        default: gLevel.mines = 2, gLevel.size = 4, gGame.howManyLives = 1
    }
}

function manageRecord() {
    var sec = gGame.secsPassed * 60;
    if (!gRecord || gRecord > gGame.minPassed + sec) {
        localStorage.setItem('record', gRecord)
        alert('Great!, you set a new record!');
    }
}

function updateLastCell(i, j, content) {
    gLastCell.i = i;
    gLastCell.j = j;
    gLastCell.isShown = gGame[i][j].isShown;
    gLastCell.isMarked = gGame[i][j].isMarked;
    gLastCell.isMine = gGame[i][j].isMine;
    gLastCell.minesAroundCount = gGame[i][j].minesAroundCount;
    gLastCell.content = content;
}

function undo() {
    if (!gGame.isOn) return alert('Game is over, cannot undo');
    if (gGame.undoBtn !== 1) return alert('Already used your undo option');

    if (gLastCell.content === MINE) {
        gGame.howManyLives++;
        gGame.minesToWin++;
    }

    gBoard[gLastCell.i][gLastCell.j].minesAroundCount = gLastCell.minesAroundCount;
    gBoard[gLastCell.i][gLastCell.j].isMine = gLastCell.isMine;
    gBoard[gLastCell.i][gLastCell.j].isMarked = gLastCell.isMarked;
    gBoard[gLastCell.i][gLastCell.j].isShown = gLastCell.isShown;

    var elCell = document.getElementsByClassName(`revealed cell-${i}-${j}`);
    elCell.innerText = gLastCell.content;
    elCell.classList.add('unrevealed');
    elCell.classList.remove('revealed');

    gGame.undoBtn--;
}
