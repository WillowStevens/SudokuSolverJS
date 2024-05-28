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

        // Remove any existing invalid class from all inputs
        clearInvalidInputs();

        if (!/^[1-9]$/.test(value)) {
            input.value = '';  // Clear the input if it's not a digit between 1 and 9
        } else {
            const board = readBoard();
            const cell = input.parentElement;
            const row = cell.parentElement;
            const rowIndex = Array.from(row.parentElement.children).indexOf(row);
            const cellIndex = Array.from(row.children).indexOf(cell);

            // Temporarily clear the cell to avoid false positives in validation
            board[rowIndex][cellIndex] = 0;

            if (!isValid(board, rowIndex, cellIndex, parseInt(value))) {
                input.classList.add('invalid-input');
            } else {
                // Restore the value in the board
                board[rowIndex][cellIndex] = parseInt(value);
            }

            // Check for conflicts in the row, column, and box
            highlightConflicts(board, rowIndex, cellIndex, parseInt(value));
        }
    }

    function highlightConflicts(board, row, col, num) {
        const rows = boardElement.querySelectorAll('tr');

        // Check row and column conflicts
        for (let i = 0; i < 9; i++) {
            if (i !== col && board[row][i] === num) {
                rows[row].children[i].querySelector('input').classList.add('invalid-input');
            }
            if (i !== row && board[i][col] === num) {
                rows[i].children[col].querySelector('input').classList.add('invalid-input');
            }
        }

        // Check 3x3 box conflicts
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if ((i !== row || j !== col) && board[i][j] === num) {
                    rows[i].children[j].querySelector('input').classList.add('invalid-input');
                }
            }
        }
    }

    function clearInvalidInputs() {
        const inputs = boardElement.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('invalid-input');
        });
        const board = readBoard();
        // Revalidate the entire board to maintain invalid states
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] !== 0) {
                    const num = board[row][col];
                    board[row][col] = 0;
                    if (!isValid(board, row, col, num)) {
                        boardElement.querySelectorAll('tr')[row].children[col].querySelector('input').classList.add('invalid-input');
                    }
                    board[row][col] = num;
                }
            }
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

        // If the input is invalid, keep the invalid-input class
        if (input.classList.contains('invalid-input')) {
            setTimeout(() => {
                input.classList.add('invalid-input');
            }, 0);
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

        // Re-apply invalid-input class if needed
        if (input.classList.contains('invalid-input')) {
            setTimeout(() => {
                input.classList.add('invalid-input');
            }, 0);
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
            input.classList.remove('invalid-input');
        });
    }
});
