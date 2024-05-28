document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const solveButton = document.getElementById('solve-button');
    const resetButton = document.getElementById('reset-button');
    
    // Create the Sudoku grid
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';  // Allow only one character
            input.addEventListener('input', validateInput);  // Validate input
            input.addEventListener('focus', handleFocus);    // Highlight row, column, and box
            input.addEventListener('blur', handleBlur);      // Remove highlights
            cell.appendChild(input);
            row.appendChild(cell);
        }
        boardElement.querySelector('tbody').appendChild(row);
    }

    solveButton.addEventListener('click', solveSudoku);
    resetButton.addEventListener('click', resetBoard);

    function validateInput(event) {
        const input = event.target;
        const value = input.value;
        if (!/^[1-9]$/.test(value)) {
            input.value = '';  // Clear the input if it's not a digit between 1 and 9
        }
    }

    function handleFocus(event) {
        const input = event.target;
        const cell = input.parentElement;
        const row = cell.parentElement;
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        const cellIndex = Array.from(row.children).indexOf(cell);

        // Highlight row
        row.classList.add('highlight-row');

        // Highlight column
        const rows = boardElement.querySelectorAll('tr');
        rows.forEach(row => {
            row.children[cellIndex].classList.add('highlight-col');
        });

        // Highlight 3x3 box
        const startRow = Math.floor(rowIndex / 3) * 3;
        const startCol = Math.floor(cellIndex / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                rows[i].children[j].classList.add('highlight-box');
            }
        }
    }

    function handleBlur(event) {
        const input = event.target;
        const cell = input.parentElement;
        const row = cell.parentElement;
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        const cellIndex = Array.from(row.children).indexOf(cell);

        // Remove row highlight
        row.classList.remove('highlight-row');

        // Remove column highlight
        const rows = boardElement.querySelectorAll('tr');
        rows.forEach(row => {
            row.children[cellIndex].classList.remove('highlight-col');
        });

        // Remove 3x3 box highlight
        const startRow = Math.floor(rowIndex / 3) * 3;
        const startCol = Math.floor(cellIndex / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                rows[i].children[j].classList.remove('highlight-box');
            }
        }
    }

    function readBoard() {
        const board = [];
        const rows = boardElement.querySelectorAll('tr');
        rows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('input').forEach(cell => {
                const value = cell.value;
                rowData.push(value ? parseInt(value) : 0);
            });
            board.push(rowData);
        });
        return board;
    }

    function isValid(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num ||
                board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
                return false;
            }
        }
        return true;
    }

    function isInitialBoardValid(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] !== 0) {
                    const num = board[row][col];
                    board[row][col] = 0;
                    if (!isValid(board, row, col, num)) {
                        return false;
                    }
                    board[row][col] = num;
                }
            }
        }
        return true;
    }

    function solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function solveSudoku() {
        const board = readBoard();
        if (!isInitialBoardValid(board)) {
            alert('Invalid Sudoku Entered');
            return;
        }
        if (solve(board)) {
            const rows = boardElement.querySelectorAll('tr');
            rows.forEach((row, i) => {
                row.querySelectorAll('input').forEach((cell, j) => {
                    cell.value = board[i][j];
                });
            });
        } else {
            alert('No solution exists!');
        }
    }

    function resetBoard() {
        const inputs = boardElement.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }
});