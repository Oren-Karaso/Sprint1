
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
    mines: 2
};

var gGame = {
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
    if (!gGame.isReseted) getGameLevel();

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

    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.minesToWin = gLevel.mines;  //???not working for some reason, initiate at initGame()
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
    // console.log('gGame.minesToWin:', gGame.minesToWin)
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
        cellContent = gBoard[i][j].minesAroundCount;
        gBoard[i][j].isShown = true;
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
        case 1: gLevel.mines = 2, gLevel.size = 4
            break;
        case 2: gLevel.mines = 12, gLevel.size = 8
            break;
        case 3: gLevel.mines = 30, gLevel.size = 12
            break;
        default: gLevel.mines = 2, gLevel.size = 4
    }
}

function manageRecord() {
    var sec = gGame.secsPassed * 60;
    if (!gRecord || gRecord > gGame.minPassed + sec) {
        localStorage.setItem('record', gRecord)
        alert('Great!, you set a new record!');
    }
}
