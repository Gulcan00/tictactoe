function createPlayer() {
    let mark = "";

    const addMark = (newMark) => mark = newMark;

    const getMark = () => mark;

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
                throw new Error('Cell already full');
            } else {
                board[row][column].addMark(player);
            }
        }

        const checkWin = () => {    
            //Check horizontal
            for (let row = 0; row < 3; ++row) {
                if (board[row][0].getMark() !== '' && board[row][0].getMark() === board[row][1].getMark() && board[row][1].getMark() === board[row][2].getMark()) {
                    return {status: "won", winner: board[row][0]};
                }
            }
    
            //Check vertical
            for (let col = 0; col < 3; ++col) {
                if (board[0][col].getMark() !== '' && board[0][col].getMark() === board[1][col].getMark() && board[1][col].getMark() === board[2][col].getMark()) {
                    return {status: "won", winner: board[0][col]}
                }
            }
    
            //Check diagonal
            if (board[0][0].getMark() !== '' && board[0][0].getMark() === board[1][1].getMark() && board[1][1].getMark() === board[2][2].getMark()) {
                return {status: "won", winner: board[0][0]}
            }
    
            //Check anti diagonal
            if (board[0][2].getMark() !== '' && board[0][2].getMark() === board[1][1].getMark() && board[1][1].getMark() === board[2][0].getMark()) {
                return {status: "won", winner: board[0][2]};
            }

            const boardIsFull = board.every(row => row.every(cell => cell.getMark() !== ''));
            if (boardIsFull) {
                return {status: "tie", winner: null}
            }
    
            return {status: "ongoing", winner: null}
        }

        const getBoard = () => board;

        const printBoard = () => {
            console.log(board.map(row => row.map(cell => cell.getMark())));
        }

        return {
            setMark,
            getBoard,
            printBoard,
            checkWin
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

    let gameStatus = {status: "ready", winner: null};

    const getGameStatus = () => gameStatus;

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
        try {
        board.setMark(row, col, activePlayer.marker);
        } catch (e) {
            return;
        }

        gameStatus = board.checkWin();

        if (gameStatus.status !== "ongoing") {
            if (gameStatus.status === "tie") {
                console.log("It's a tie!");
            } else {
            console.log("win!");
            console.log(activePlayer.name);
            }
            board.printBoard();
            return;
        }
        switchActivePlayer();
        printNewRound();
    }


    const restartGame = () => {
        const boardArr = board.getBoard();
        boardArr.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                boardArr[rowIndex][colIndex] = createPlayer();
            })
        });

        gameStatus = {status: "ready", winner: null};
        activePlayer = players[0];
    }

    printNewRound();


    return {
        getActivePlayer,
        playRound,
        getGameStatus,
        getBoard: board.getBoard,
        restartGame
    }
}

(function DisplayController() {
    let game;
    const boardDiv = document.querySelector(".board");
    const resultDiv = document.querySelector(".result");
    const restartBtn = document.querySelector(".result>button");
    const startBtn = document.querySelector("form>button");

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

        if (game.getGameStatus().status === "won") {
            const text = document.createTextNode(game.getActivePlayer().name + " won!");
            resultDiv.insertBefore(text, restartBtn);
            resultDiv.parentNode.style.display = "flex";
        } else if (game.getGameStatus().status === "tie") {
            const text = document.createTextNode("It's a tie!");
            resultDiv.insertBefore(text, restartBtn);
            resultDiv.parentNode.style.display = "flex";
        }
    }

    const clickHandlerCell = (e) => {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        game.playRound(row, col);
        updateScreen();
    }

    const clickRestart = (e) => {
        game.restartGame();
        resultDiv.parentNode.style.display = "none";
        resultDiv.innerHTML = null;
        resultDiv.appendChild(restartBtn);
        updateScreen();
    }

    restartBtn.addEventListener('click', clickRestart);

    const clickStart = (e) => {
        e.preventDefault();
        const form = document.querySelector("form");
        const formData = new FormData(form);
        const player1 = formData.get("player1");
        const player2 = formData.get("player2");
        game = createGameboardController(player1, player2);
        form.style.display = "none";
        updateScreen();
    }

    startBtn.addEventListener('click', clickStart);

})();