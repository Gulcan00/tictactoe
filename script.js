function createPlayer() {
    let value = "";

    const addMark = (marker) => value = marker;

    const getMark = () => value;

    return {
        addMark,
        getMark
    }
}

function createGameboardController(
    player1Name = "Player 1",
    player2Name = "Player 2"
) {
    const board = (function createGameboard() {
        const board = [];
        const rows = 3;
        const cols = 3;

        //Initial board
        for (let i = 0; i < rows; ++i) {
            board[i] = [];
            for (let j = 0; j < cols; ++j) {
                board[i][j] = createPlayer();
            }
        }

        const setMark = (row, column, player) => {
            if (board[row][column].getMark() !== '') {
                console.log("Not empty!!");
            } else {
                board[row][column].addMark(player);
            }
        }

        const getBoard = () => board;

        const printBoard = () => {
            console.log(board.map(row => row.map(cell => cell.getMark())));
        }

        return {
            setMark,
            getBoard,
            printBoard
        }
    })();

    const players = [
        {
            name: player1Name,
            marker: 'X'
        },
        {
            name: player2Name,
            marker: 'O'
        }
    ];

    let winner;

    const getWinner = () => winner;

    const checkWin = (board) => {
        const boardIsFull = board.every(row => row.every(cell => cell.getMark() !== ''));
        if (boardIsFull) {
            return "tie";
        }

        //Check horizontal
        for (let row = 0; row < 3; ++row) {
            if (board[row][0].getMark() !== '' && board[row][0].getMark() === board[row][1].getMark() && board[row][1].getMark() === board[row][2].getMark()) {
                return board[row][0];
            }
        }

        //Check vertical
        for (let col = 0; col < 3; ++col) {
            if (board[0][col].getMark() !== '' && board[0][col].getMark() === board[1][col].getMark() && board[1][col].getMark() === board[2][col].getMark()) {
                return board[0][col];
            }
        }

        //Check diagonal
        if (board[0][0].getMark() !== '' && board[0][0].getMark() === board[1][1].getMark() && board[1][1].getMark() === board[2][2].getMark()) {
            return board[0][0];
        }

        //Check anti diagonal
        if (board[0][2].getMark() !== '' && board[0][2].getMark() === board[1][1].getMark() && board[1][1].getMark() === board[2][0].getMark()) {
            return board[0][2];
        }

        return null;

    }

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const playRound = (row, col) => {
        board.setMark(row, col, activePlayer.marker);

        winner = checkWin(board.getBoard());

        if (winner) {
            if (winner === "tie") {
                console.log("It's a tie!");
            } else {
            console.log("win!");
            const player = players.find(player => player.marker === winner.getMark());
            console.log(player.name);
            }
            board.printBoard();
            return;
        }
        switchActivePlayer();
        printNewRound();
    }

    printNewRound();


    return {
        getActivePlayer,
        playRound,
        getWinner,
        getBoard: board.getBoard
    }
}

(function DisplayController() {
    const game = createGameboardController();
    const boardDiv = document.querySelector(".board");
    const winnerDiv = document.querySelector(".winner");

    const updateScreen = () => {
        boardDiv.innerHTML = null;
        const board = game.getBoard();
        board.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
            const button = document.createElement("button");
            button.innerText = cell.getMark();
            button.dataset.row = rowIndex;
            button.dataset.col = colIndex;
            button.addEventListener('click', clickHandlerCell);
            boardDiv.appendChild(button);
        }));

        if (game.getWinner()) {
            boardDiv.remove();
            winnerDiv.innerText = game.getWinner().getMark() + " WON!!!!";
        }
    }

    const clickHandlerCell = (e) => {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        game.playRound(row, col);
        updateScreen();
    }

    updateScreen();
})();