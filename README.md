# SudokuSolverJS

Sudoku Solver Project I decided to work on after finishing a JavaScript coding course.

While working on the JavaScript course, I noticed at the end of the course there was a Sudoku Checker Project, which at the time I mistook for a Sudoku Solver. Since I had already been thinking about it, I decided to take the plunge and try it out!

## Features

- **Interactive Board**: Select a cell to highlight the row, column, and 3x3 grid to help visualize where inputs would conflict.
- **Input Validation**: When you put in an invalid response, it will highlight all conflicting inputs in red.
- **Solver**: Click "Solve" to fill the board with a valid solution using a standard Sudoku backtracking algorithm.
  - If the puzzle is unsolvable, it will send an alert saying "No solution exists!"
  - If there are conflicts present when you click "Solve", it will put an alert saying "Invalid Sudoku Entered."
- **Reset**: Click "Reset" to clear the board and start over.

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, etc.)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/WillowStevens/SudokuSolverJS.git
    ```
2. Navigate to the project directory:
    ```bash
    cd SudokuSolverJS
    ```
3. Open the `index.html` file in your web browser.

## Usage

1. **Enter Values**: Click on a cell and enter a number between 1 and 9.
2. **Highlight Conflicts**: If your input causes a conflict, the conflicting cells will be highlighted in red.
3. **Solve the Puzzle**: Click the "Solve" button to fill in the solution.
4. **Reset the Board**: Click the "Reset" button to clear the board.

## How It Works

The Sudoku solver uses a backtracking algorithm to find a valid solution. Here’s a brief overview of how the algorithm works:

1. **Backtracking Algorithm**: 
    - Start with an empty cell.
    - Try all numbers from 1 to 9 in the cell.
    - For each number, check if it is valid (i.e., no conflicts in the row, column, and 3x3 grid).
    - If a valid number is found, move to the next empty cell and repeat.
    - If no valid number is found, backtrack to the previous cell and try the next number.
    - Repeat until the board is completely filled or no solution exists.

## Future Improvements

- **Solve Visualization**: Help the user understand how the algorithm works by visualizing the solving process.

## License

This project is licensed under the GNU General Public License v3.0.

## Acknowledgements

- Thanks to the JavaScript course that inspired this project.
