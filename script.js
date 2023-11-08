function createPlayer() {
    let value = '-';

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
            if (board[row][column] !== '-') {
                console.log("Not empty!!");
            } else {
                board[row][column].addMark(player);
            }
        }

        const getBoard = () => board;
    
        const printBoard = () => {
            for (let row of board) {
                for (let cell of row) {
                    console.log(cell);
                }
            }
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
    ]
}