/* --- Create Game Board--- */
const Gameboard = (function() {
    let gameboard = ['', '', '', '', '', '', '', '', ''];

    const createBoard = function() {
        let boardElement = '';
        gameboard.forEach(function(square, index) {
            boardElement += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector('#game-board').innerHTML = boardElement;

        const squares = document.querySelectorAll('.square');
        squares.forEach(function(square) {
            square.addEventListener('click', Game.squareClick);
        })
    }

    const update = function(index, value) {
        gameboard[index] = value;
        createBoard();
    }

    const getGameboard = function() {
        return gameboard;
    }

    return {
        createBoard,
        update,
        getGameboard
    }
})();

/* --- Create Players --- */
const createPlayer = function(name, mark) {
    return {
        name,
        mark
    }
}

/* --- Start Game --- */
const Game = (function() {
    let players = [];
    let playerIndex;
    let gameOver;

    const start = function() {
        players = [
            createPlayer(document.querySelector('#player1').value, 'X'),
            createPlayer(document.querySelector('#player2').value, 'O')
        ]
        playerIndex = 0;
        gameOver = false;
        Gameboard.createBoard();

        const squares = document.querySelectorAll('.square');
        squares.forEach(function(square) {
            square.addEventListener('click', squareClick);
        })
    }

    const squareClick = function(e) {
        if(gameOver) {
            return;
        }

        let index = parseInt(e.target.id.split('-')[1]);
        if(Gameboard.getGameboard()[index] !== '') {
            return;
        }
        Gameboard.update(index, players[playerIndex].mark);

        if(gameWin(Gameboard.getGameboard(), players[playerIndex].mark)) {
            gameOver = true;
            showMessage.createMessage(`${players[playerIndex].name} wins!`);
        } else if(gameTie(Gameboard.getGameboard())) {
            gameOver = true;
            showMessage.createMessage(`Tie!`);
        }

        playerIndex = playerIndex === 0 ? 1 : 0;
    }

    const restart = function() {
        for(let i = 0; i < 9; i++) {
            Gameboard.update(i, '');
        }
        Gameboard.createBoard();
        gameOver = false;
        document.querySelector('#message').innerHTML = '';
    }

    return {
        start,
        restart,
        squareClick
    }
})();

/* --- Results --- */
function gameWin(board) {
    const winOptions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for(let i = 0; i < winOptions.length; i++) {
        const [a, b, c] = winOptions[i];
        if(board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function gameTie(board) {
    return board.every(cell => cell !== '');
}

/* --- Create Message --- */
const showMessage = (function() {
    const createMessage = function(message) {
        document.querySelector('#message').innerHTML = message;
    }
    return {
        createMessage,
    }
})();

/* --- Start Button --- */
const startBtn = document.querySelector('#start-btn');
startBtn.addEventListener('click', function() {
    Game.start();
})

/* --- Restart Button --- */
const restartBtn = document.querySelector('#restart-btn');
restartBtn.addEventListener('click', function() {
    Game.restart();
})