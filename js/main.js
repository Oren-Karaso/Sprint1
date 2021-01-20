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
    secsPassed: 0
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
                isMarked: true
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
            var className = `cell cell${i}-${j}`;
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"> ${cell} </td>`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


function setMinesNegsCount(cellI, cellJ, board) {
    var countNeighbors = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) countNeighbors++;
        }
    }
    // console.log('for i=', cellI + ' for j=', cellJ + ' countNeighbors:', countNeighbors);
    board[cellI][cellJ].minesAroundCount = countNeighbors;
    return countNeighbors;
}

function cellClicked(elCell, i, j) {
    elCell = elCell.innerText;
    var numberToShow = gBoard[i][j].minesAroundCount;

    if (!gBoard[i][j].isMine) elCell = numberToShow;
    // console.log('elCellInnerText:', elCell);

    renderCell(i, j, numberToShow);
}


function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.innerHTML = value;
    // console.log('elCell InnerHTML:',  elCell.innerHTML);
}

function getRandomMine(num) {
    var emptyArr = getEmptyCellIdx(gBoard);
    // console.log('emptyArr:', emptyArr);
    for (var i = 0; i < num; i++) {
        var tmpIdx = getRandomInt(0, emptyArr.length - 1);
        var emptyCell = emptyArr[tmpIdx];
        console.log('emptyCell:', tmpIdx);
        var cellWithNewValue = gBoard[emptyCell.i][emptyCell.j];
        cellWithNewValue.isMine = true;
        emptyArr.splice(tmpIdx, 1);
    }
}


function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell) {

}


// return an array of location objects of empty cells in given mat
function getEmptyCellIdx(board) {
    var emptyArr = [];

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                var content = {
                    i: i,
                    j: j
                }
                emptyArr.push(content);
            }
        }
    }
    console.log('emptyArr:', emptyArr);

    return emptyArr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
