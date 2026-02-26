// Gameboard object
const gameboard = (() => {
    // *** Properties *** 
    let gameboardArray = [];
    let numSymbolsPlaced = 0;
    let gameEnded = false;

    // *** Private Methods ***
    // Detects if a player has formed a line connection
    const detectLineConnection = (cell) => {
        // Diagonal lines
        const southEastDiagonalFormed = 
            gameboardArray[0][0] === gameboardArray[1][1] && 
            gameboardArray[1][1] === gameboardArray[2][2];
        
        const northEastDiagonalFormed = 
            gameboardArray[2][0] === gameboardArray[1][1] &&
            gameboardArray[1][1] === gameboardArray[0][2];

        // Check diagonals if cell is 00, 02, 11, 20, or 22
        if (((cell === "00" || cell === "22") && southEastDiagonalFormed) ||
            ((cell === "20" || cell === "02") && northEastDiagonalFormed) ||
            (cell === "11" && (southEastDiagonalFormed || northEastDiagonalFormed))) {
            return true;
        }

        // Horizontal lines
        const firstRowFormed =
            gameboardArray[0][0] === gameboardArray[0][1] &&
            gameboardArray[0][1] === gameboardArray[0][2];
        
        const secondRowFormed =
            gameboardArray[1][0] === gameboardArray[1][1] &&
            gameboardArray[1][1] === gameboardArray[1][2];
        
        const thirdRowFormed =
            gameboardArray[2][0] === gameboardArray[2][1] &&
            gameboardArray[2][1] === gameboardArray[2][2];

        // Vertical lines
        const firstColumnFormed = 
            gameboardArray[0][0] === gameboardArray[1][0] && 
            gameboardArray[1][0] === gameboardArray[2][0];
        
        const secondColumnFormed = 
            gameboardArray[0][1] === gameboardArray[1][1] &&
            gameboardArray[1][1] === gameboardArray[2][1];
        
        const thirdColumnFormed = 
            gameboardArray[0][2] === gameboardArray[1][2] &&
            gameboardArray[1][2] === gameboardArray[2][2];
        
        // Check horizontal and vertical lines
        switch (cell) {
            case "00":
                return firstRowFormed || firstColumnFormed;
            case "01":
                return firstRowFormed || secondColumnFormed;
            case "02":
                return firstRowFormed || thirdColumnFormed;
            case "10":
                return secondRowFormed || firstColumnFormed;
            case "11":
                return secondRowFormed || secondColumnFormed;
            case "12":
                return secondRowFormed || thirdColumnFormed;
            case "20":
                return thirdRowFormed || firstColumnFormed;
            case "21":
                return thirdRowFormed || secondColumnFormed;
            case "22":
                return thirdRowFormed || thirdColumnFormed;
            default:
                return false;
        }
    }

    // Display the gameboard on the console
    const displayBoard = () => {
        for (let row = 0; row < 3; row++) {
            let currRow = "";
            for (let col = 0; col < 3; col++) {
                currRow += 
                    gameboardArray[row][col].length === 2 
                    ? ` ${gameboardArray[row][col]} ` 
                    : ` ${gameboardArray[row][col]}  `
                if (col < 2) currRow += "|";
            }
            console.log(currRow);
            if (row < 2) console.log("--------------");
        }
    }

    // *** Public methods ***
    // Logically build the starting gameboard
    const getCell = (row, col) => {
        return gameboardArray[row][col];
    }

    const resetBoard = () => {
        gameboardArray.length = 0;
        numSymbolsPlaced = 0;
        gameEnded = false;

        for (let row = 0; row < 3; row++) {
            let currRow = [];
            for (let col = 0; col < 3; col++) {
                currRow.push(`${row}${col}`);
            }
            gameboardArray.push(currRow);
        }

        displayBoard();
    }

    // Places a symbol ('X' or 'O') somewhere on the board
    const placeSymbol = (symbol, cell) => {
        // Detect errors
        if (symbol.toUpperCase() !== 'X' && symbol.toUpperCase() !== 'O') throw Error("Symbol must be either X or O!");
        
        if (cell.length !== 2) throw Error("cell argument must be at least length 2!");
    
        const row = cell[0];
        const col = cell[1];
        
        if (row < 0 || row > 2) throw Error("row must be between 0 and 2!");
        

        if (col < 0 || col > 2) throw Error("column must be between 0 and 2!");
        
        const piece = gameboardArray[row][col];
        // console.log(`piece.length = ${piece.length}`);
        if (piece.length === 1) {
            console.log(`\nCell ${row}${col} is already occupied by ${piece}!`);
            return; 
        }

        gameboardArray[row][col] = symbol;

        numSymbolsPlaced++;

        displayBoard();

        if (detectLineConnection(cell)) { 
            console.log(`Player ${symbol} wins!`);
            gameEnded = true;
        } else if (numSymbolsPlaced === 9) {
            console.log("Draw!");
            gameEnded = true;
        }
    }

    const getNumSymbolsPlaced = () => numSymbolsPlaced;

    const getGameEnded = () => gameEnded;

    return { getCell, resetBoard, placeSymbol, getNumSymbolsPlaced, getGameEnded };
})();

// Game controller object
const gameController = (() => {
    // *** Properties *** 

    // *** Private Methods ***

    // *** Public Methods ***
    const placePiece = (cell) => {
        const numPiecesPlaced = gameboard.getNumSymbolsPlaced();
        const row = cell[0];
        const col = cell[1];
        if (numPiecesPlaced < 9 && !gameboard.getGameEnded()) {
            if (numPiecesPlaced % 2 === 0) {
                gameboard.placeSymbol('X', cell);
                // console.log(`Number of pieces placed: ${gameboard.getNumSymbolsPlaced()}`);
                if (!gameboard.getGameEnded() && gameboard.getCell(row, col) !== 'O') console.log("\nPlayer O's turn!");
            } else {
                gameboard.placeSymbol('O', cell);
                // console.log(`Number of pieces placed: ${gameboard.getNumSymbolsPlaced()}`);
                if (numPiecesPlaced < 8 && !gameboard.getGameEnded() && gameboard.getCell(row, col) !== 'X') 
                    console.log("\nPlayer X's turn!");
            }
        }
    }

    const initGame = () => {
        gameboard.resetBoard();
        console.log("\nPlayer X's turn!");
    }

    return { placePiece, initGame };

})();

gameController.initGame();

// Player object
function createPlayer() {
    this.id = crypto.randomUUID();
    let playerName;
    let wins = 0;
    let losses = 0;
    let draws = 0;
}

// Buttons functionality
const changeNamesBtn = document.querySelector(".change-names-btn");
changeNamesBtn.addEventListener("click", () => {
    const dialog = document.querySelector("dialog");
    // dialog.show() // Opens a non-modal dialog
    dialog.showModal(); // Opens a modal

    // dialog.close(); // Closes the dialog
});

const restartGameBtn = document.querySelector(".restart-game-btn");
restartGameBtn.addEventListener("click", () => {
    let player1Name = document.querySelector(".player1-name");
    let player2Name = document.querySelector(".player2-name");
    const temp = player1Name.textContent;
    player1Name.textContent = player2Name.textContent;
    player2Name.textContent = temp;

    // Update the input name values
    const player1 = document.querySelector("#player1_name");
    player1.value = player1Name.textContent;

    const player2 = document.querySelector("#player2_name");
    player2.value = player2Name.textContent;
});

const submitBtn = document.querySelector(".submit-btn");
submitBtn.addEventListener("click", () => {
    const player1 = document.querySelector("#player1_name").value;
    if (player1.length !== 0) document.querySelector(".player1-name").textContent = player1;
    const player2 = document.querySelector("#player2_name").value;
    if (player2.length !== 0) document.querySelector(".player2-name").textContent = player2;
});

const dialog = document.querySelector("dialog");

dialog.addEventListener("click", e => {
  const dialogDimensions = dialog.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close()
  }
});

// Light mode and dark mode
// const brightnessMode = document.querySelector(".brightness-mode");
// brightnessMode.addEventListener("click", e => {
//     const body = document.querySelector("body");
//     body.style.backgroundColor = "rgb(21, 21, 29)";

//     const ticTacToeHeader = document.querySelector("main > h1");
//     ticTacToeHeader.style.color = "white";

//     const vsText = document.querySelector(".vs-text");
//     vsText.style.color = "white";

//     const header = document.querySelector("header");
//     header.style.borderBottom = "1px solid black";

//     const changeNamesBtn = document.querySelector("change-names-btn");
// });

// TODO: ScreenController object
// Enable brightness modes
const brightnessModes = document.querySelectorAll(".brightness-mode");
brightnessModes.forEach((mode) => {
    mode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});

function swapSvgs(active, inactive) {
    active.parentNode.insertBefore(inactive, active);
    active.parentNode.removeChild(active);
}

// Volume on and volume off
const volumeOn = document.querySelector(".volume-on");
const volumeOff = document.querySelector(".volume-off");

volumeOn.addEventListener("click", () => swapSvgs(volumeOn, volumeOff));
volumeOff.addEventListener("click", () => swapSvgs(volumeOff, volumeOn));

// Sun and moon
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");

sun.addEventListener("click", () => swapSvgs(sun, moon));
moon.addEventListener("click", () => swapSvgs(moon, sun));

volumeOff.parentNode.removeChild(volumeOff);
moon.parentNode.removeChild(moon);




