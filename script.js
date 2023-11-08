function createPlayer() {
    let value = '-';

    const addMark = (marker) => value = marker;

    const getMark = () => value;

    return {
        addMark,
        getMark
    }
}

function createGameboardController() {
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
    
    
        const getBoard = () => board;
    
        const printBoard = () => {
            for (let row of board) {
                for (let cell of row) {
                    console.log(cell);
                }
            }
        }
    
        return {
            getBoard, 
            printBoard
        }
    })();
}