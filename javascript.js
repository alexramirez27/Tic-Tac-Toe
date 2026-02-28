// Gameboard object
const gameboard = (() => {
    // *** Properties *** 
    let gameboardArray = [];
    let numSymbolsPlaced = 0;
    let gameEnded = false;
    let lineFormed = "";

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
        
        if (southEastDiagonalFormed) {
            lineFormed = "southeast";
        } else if (northEastDiagonalFormed) {
            lineFormed = "northeast";
        } else if (firstRowFormed) {
            lineFormed = "horizontal1";
        } else if (secondRowFormed) {
            lineFormed = "horizontal2";
        } else if (thirdRowFormed) {
            lineFormed = "horizontal3";
        } else if (firstColumnFormed) {
            lineFormed = "vertical1";
        } else if(secondColumnFormed) {
            lineFormed = "vertical2";
        } else if (thirdColumnFormed) {
            lineFormed = "vertical3";
        } 

        // Check diagonals if cell is 00, 02, 11, 20, or 22
        if (((cell === "00" || cell === "22") && southEastDiagonalFormed) ||
            ((cell === "20" || cell === "02") && northEastDiagonalFormed) ||
            (cell === "11" && (southEastDiagonalFormed || northEastDiagonalFormed))) {
            return true;
        }

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
    const getCell = (row, col) => gameboardArray[row][col];
    
    const resetBoard = () => {
        gameboardArray.length = 0;
        numSymbolsPlaced = 0;
        gameEnded = false;
        lineFormed = "";

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
        if (piece.length === 1) {
            console.log(`\nCell ${row}${col} is already occupied by ${piece}!`);
            return; 
        }

        gameboardArray[row][col] = symbol;

        numSymbolsPlaced++;

        displayBoard();

        const resultDiv = document.querySelector(".result");
        const span = document.createElement("span");

        if (detectLineConnection(cell)) { 
            console.log(`Player ${symbol} wins!`);
            gameEnded = true;

            if(symbol === 'X') {
                span.textContent = gameController.getPlayer1().getPlayerName(); 
                span.style.color = "rgb(46, 46, 219)";
                resultDiv.appendChild(span);

                const winSpan = document.createElement("span");
                winSpan.textContent = " wins!";
                resultDiv.appendChild(winSpan);

                screenController.changeAllCellsCursor("default");
                audioController.playWin();
            } else {
                span.textContent = gameController.getPlayer2().getPlayerName();
                span.style.color = "rgb(223, 53, 53)";
                resultDiv.appendChild(span);

                const winSpan = document.createElement("span");
                winSpan.textContent = " wins!";
                resultDiv.appendChild(winSpan);

                screenController.changeAllCellsCursor("default");
                audioController.playWin();
            }
        } else if (numSymbolsPlaced === 9) {
            console.log("Draw!");
            gameEnded = true;
            span.textContent = "Draw!";
            resultDiv.appendChild(span);

            screenController.changeAllCellsCursor("default");
            audioController.playDraw();
        }

        const winningLineFormed = gameboard.getLineFormed();
        const winningLineElement = screenController.getWinningLine(winningLineFormed);
        if (winningLineElement !== null) { 
            setTimeout(() => {
                winningLineElement.style.visibility = "visible";
            }, 350);
        }
    }

    const getNumSymbolsPlaced = () => numSymbolsPlaced;

    const getGameEnded = () => gameEnded;

    const getLineFormed = () => lineFormed;

    return { getCell, resetBoard, placeSymbol, getNumSymbolsPlaced, getGameEnded, getLineFormed };
})();

// Player object
function createPlayer(name) {
    let playerName = name;
    
    const getPlayerName = () => playerName;
    const setPlayerName = (name) => playerName = name;

    return { playerName, getPlayerName, setPlayerName };
}

// Game controller object
const gameController = (() => {
    // *** Properties *** 
    const player1 = createPlayer("Player1");
    const player2 = createPlayer("Player2");

    // *** Private Methods ***

    // *** Public Methods ***
    const placePiece = (cell) => {
        const numPiecesPlaced = gameboard.getNumSymbolsPlaced();
        const row = cell[0];
        const col = cell[1];
        if (numPiecesPlaced < 9 && !gameboard.getGameEnded()) {
            if (numPiecesPlaced % 2 === 0) {
                gameboard.placeSymbol('X', cell);
                if (!gameboard.getGameEnded() && gameboard.getCell(row, col) !== 'O') console.log("\nPlayer O's turn!");
            } else {
                gameboard.placeSymbol('O', cell);
                if (numPiecesPlaced < 8 && !gameboard.getGameEnded() && gameboard.getCell(row, col) !== 'X') 
                    console.log("\nPlayer X's turn!");
            }
        }
    }

    const initGame = () => {
        gameboard.resetBoard();
        console.log("\nPlayer X's turn!");
    }

    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;

    return { placePiece, initGame, getPlayer1, getPlayer2 };

})();

const screenController = (() => {
    // *** Properties *** 
    const xDValue = "M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z";
    const oDValue = "M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z";

    // *** Private Methods ***
    const buildSvg = (className, dValue) => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.classList.add(className);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", dValue);
        path.setAttribute("fill", "currentColor");
        svg.appendChild(path);
        return svg;
    }

    const changeNamesFunctionality = () => {
        const changeNamesBtn = document.querySelector(".change-names-btn");
        changeNamesBtn.addEventListener("click", () => {
            const dialog = document.querySelector("dialog");
            dialog.showModal(); // Opens a modal
        });
    }

    const restartGameFunctionality = () => {
        const restartGameBtn = document.querySelector(".restart-game-btn");
        restartGameBtn.addEventListener("click", () => {
            let player1Name = document.querySelector(".player1-name");
            let player2Name = document.querySelector(".player2-name");
            const temp = player1Name.textContent;
            player1Name.textContent = player2Name.textContent;
            player2Name.textContent = temp;

            gameController.getPlayer1().setPlayerName(player1Name.textContent);
            gameController.getPlayer2().setPlayerName(player2Name.textContent);

            // Update the input name values
            const player1 = document.querySelector("#player1_name");
            player1.value = player1Name.textContent;

            const player2 = document.querySelector("#player2_name");
            player2.value = player2Name.textContent;

            // Remove spans from result div
            const resultDiv = document.querySelector(".result");
            resultDiv.replaceChildren();

            // Remove all svgs
            const allSvgs = document.querySelectorAll(".cell");
            allSvgs.forEach(currSvg => {
                currSvg.replaceChildren();
            });

            const winningLineFormed = gameboard.getLineFormed();

            const winningLineElement = screenController.getWinningLine(winningLineFormed);
            if (winningLineElement !== null) winningLineElement.style.visibility = "hidden";

            changeAllCellsCursor("pointer");
            audioController.stopAll();
            gameController.initGame();
        });
    }
    
    const submitFunctionality = () => {
        const submitBtn = document.querySelector(".submit-btn");
        submitBtn.addEventListener("click", () => {
            const player1 = document.querySelector("#player1_name").value;
            if (player1.length !== 0) document.querySelector(".player1-name").textContent = player1;
            gameController.getPlayer1().setPlayerName(player1);

            const player2 = document.querySelector("#player2_name").value;
            if (player2.length !== 0) document.querySelector(".player2-name").textContent = player2;
            gameController.getPlayer2().setPlayerName(player2);
        });
    }

    const enableBrightnessModes = () => {
        const brightnessModes = document.querySelectorAll(".brightness-mode");
        brightnessModes.forEach((mode) => {
            mode.addEventListener("click", () => {
                document.body.classList.toggle("dark-mode");
            });
        });
    }

    const swapSvgs = (active, inactive) => {
        active.parentNode.insertBefore(inactive, active);
        active.parentNode.removeChild(active);
    }

    const placeSymbol = (className) => {
        if (gameboard.getGameEnded()) return;

        let svg;
        let soundToPlay;
        // Get the number of pieces placed
        const numPlaced = gameboard.getNumSymbolsPlaced();
        if (numPlaced % 2 === 0) {
            soundToPlay = audioController.playWriteX;
            svg = buildSvg("alphaX", xDValue);
        } else {
            soundToPlay = audioController.playWriteO;
            svg = buildSvg("alphaO", oDValue);
        }

        // Add the svg to the cell
        const classList = [...className.classList];
        const lastClassName = classList.at(-1);
        const cell = document.querySelector(`.${lastClassName}`);

        switch (lastClassName) {
            case "first":
                gameController.placePiece("00");
                break;
            case "second":
                gameController.placePiece("01");
                break;
            case "third":
                gameController.placePiece("02");
                break;
            case "fourth":
                gameController.placePiece("10");
                break;
            case "fifth":
                gameController.placePiece("11");
                break;
            case "sixth":
                gameController.placePiece("12");
                break;
            case "seventh":
                gameController.placePiece("20");
                break;
            case "eigth":
                gameController.placePiece("21");
                break;
            case "ninth":
                gameController.placePiece("22");
                break;
        }

        if (cell.childElementCount < 1) { 
            soundToPlay();
            setTimeout(() => {
                cell.appendChild(svg);
            }, 250);

            // Make the cursor default again
            cell.style.cursor = "default";
        }
    }

    const addListenersToCells = () => {
        const allCells = document.querySelectorAll(".cell");
        allCells.forEach(currCell => {
            // console.log(`currCell.className: ${currCell.className}`);
            currCell.addEventListener("click", () => placeSymbol(currCell));
        });
    }

    // Public methods
    const getWinningLine = (lineFormed) => {
        let res;
        switch (lineFormed) {
            case "southeast":
                res = document.querySelector(".south-east");
                return res; 
            case "northeast":
                res = document.querySelector(".north-east");
                return res; 
            case "horizontal1":
                res = document.querySelector(".horizontal.line1");
                return res; 
            case "horizontal2":
                res = document.querySelector(".horizontal.line2");
                return res; 
            case "horizontal3":
                res = document.querySelector(".horizontal.line3");
                return res; 
            case "vertical1":
                res = document.querySelector(".vertical.line1");
                return res; 
            case "vertical2":
                res = document.querySelector(".vertical.line2");
                return res; 
            case "vertical3":
                res = document.querySelector(".vertical.line3");
                return res; 
            default:
                return null; 
        }
    }

    const changeAllCellsCursor = (cursorVal) => {
        const allCells = document.querySelectorAll(".cell");
        allCells.forEach(currCell => {
            currCell.style.cursor = cursorVal;
        });
    }

    const initScreenController = () => {
        addListenersToCells();
        changeNamesFunctionality();
        restartGameFunctionality();
        submitFunctionality();
        enableBrightnessModes();

        // Volume on and volume off
        const volumeOn = document.querySelector(".volume-on");
        const volumeOff = document.querySelector(".volume-off");

        volumeOn.addEventListener("click", () => {
            audioController.toggleAudio();
            swapSvgs(volumeOn, volumeOff)
        });
        volumeOff.addEventListener("click", () => {
            audioController.toggleAudio();
            swapSvgs(volumeOff, volumeOn)
        });

        // Sun and moon
        const sun = document.querySelector(".sun");
        const moon = document.querySelector(".moon");

        sun.addEventListener("click", () => swapSvgs(sun, moon));
        moon.addEventListener("click", () => swapSvgs(moon, sun));

        volumeOff.parentNode.removeChild(volumeOff);
        moon.parentNode.removeChild(moon);

        // Dialog
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
    }

    return { getWinningLine, changeAllCellsCursor, initScreenController };

})();

const audioController = (() => {
    // *** Properties ***
    const writeX = new Audio("./audio/writeX.wav");
    const writeO = new Audio("./audio/writeO.wav");
    const win = new Audio("./audio/win.mp3");
    const draw = new Audio("./audio/draw.mp3");
    let audioDisabled = false;

    // *** Private Methods ***

    // *** Public Methods ***
    const playWriteX = () => {
        if (!audioDisabled) {
            writeX.currentTime = 0;
            writeX.play();
        }
    }

    const playWriteO = () => {
        if (!audioDisabled) {
            writeO.currentTime = 0;
            writeO.play();
        }
    }

    const playWin = () => {
        if (!audioDisabled) {
            win.currentTime = 0;
            win.play();
        }
    }

    const playDraw = () => {
        if (!audioDisabled) {
            draw.currentTime = 0;
            draw.play();
        }
    }

    const stopAll = () => {
        [writeX, writeO, win, draw].forEach(currSound => {
            currSound.pause();
            currSound.currentTime = 0;
        });
    }

    const toggleAudio = () => {
        audioDisabled = !audioDisabled;
    }

    return { playWriteX, playWriteO, playWin, playDraw, stopAll, toggleAudio };
})();

// Global calls
gameController.initGame();
screenController.initScreenController();