//renders the board


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
    // console.log('emptyArr:', emptyArr);

    return emptyArr;
}


//renders the cell - BUG
function renderCell(elCell, value) {
    elCell.classList.add('revealed');
    elCell.classList.remove('unrevealed');
    elCell.innerHTML = value;
    console.log('new current value:', elCell.innerHTML);
}

// counts the mines around each cell
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

function revealBoard(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            var elCell = document.getElementsByClassName(`.unrevealed cell-${i}-${j}`);
            // elCell.classList.add('revealed');
            // elCell.classList.remove('unrevealed');

            var cellContent;
            if (board[i][j].isMine) cellContent = MINE;
            else cellContent = board[i][j].minesAroundCount;

            board[i][j].isShown = true;
            elCell.innerHTML = cellContent;
            console.log('new cell value:', elCell.innerHTML);
        }
    }
}

function revealMines() {

    for (var i = 0; i < gGame.minesLocArr; i++) {
        var mineToRevealI = gGame.minesLocArr[i].i;
        var mineToRevealJ = gGame.minesLocArr[i].j;
        var elCell = document.getElementsByClassName(`.unrevealed cell-${mineToRevealI}-${mineToRevealJ}`);
        // elCell.classList.add('revealed');
        // elCell.classList.remove('unrevealed');
        elCell.innerHTML = MINE;
    }
    return;
}

// locating mines randomly in the board
function getRandomMine(num) {
    var emptyArr = getEmptyCellIdx(gBoard);
    for (var i = 0; i < num; i++) {
        var tmpIdx = getRandomInt(0, emptyArr.length - 1);
        var emptyCell = emptyArr[tmpIdx];
        var cellWithNewValue = gBoard[emptyCell.i][emptyCell.j];

        gGame.minesLocArr.push({ i: emptyCell.i, j: emptyCell.j });
        cellWithNewValue.isMine = true;
        emptyArr.splice(tmpIdx, 1);
    }
}


function timer() {
    gGame.secsPassed++;

    if (gGame.secsPassed === 60) {
        gGame.secsPassed = 0;
        gGame.minPassed++;
    }
    if (gGame.secsPassed <= 9) gGame.secsPassed = '0' + gGame.secsPassed;
    // if (gGame.minPassed < 9) gGame.minPassed = '0' + gGame.minPassed; //Needs to adjust

    var elTimer = document.querySelector('.timer');
    elTimer.innerText = `0${gGame.minPassed}:${gGame.secsPassed}`; //the zero in the begining of the string is just a plaster for now
}

//get random int inclusive
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function upDateScore() {

}




