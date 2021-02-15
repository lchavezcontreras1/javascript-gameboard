$(document).ready(function () {
    createBoard();
});

const totalRows = 4;
const totalCols = 7;
const totalSquares = totalRows * totalCols;

function humanPlayerTurn() {
    // what square was clicked?
    let chosenSquare = $(this);

    // get the row and col info from the data attributes
    let chosenRow = chosenSquare.data("row");
    let chosenCol = chosenSquare.data("col");
    console.log(`Human player chose row ${chosenRow} col ${chosenCol}`);

    // if a span has the class "human-player" or the class "computer-player",
    // then it is already occupied and not available to pick
    let squareOccupied = chosenSquare.hasClass("human-player")
        || chosenSquare.hasClass("computer-player");

    if (!squareOccupied) {
        console.log("It was free");

        // Give the square a CSS class
        chosenSquare.addClass("human-player");

        // Remove its text
        chosenSquare.empty();

        // let the computer have a turn
        computerPlayerTurn();
    }

    checkForGameOver();

}

function computerPlayerTurn() {
    let squareOccupied = false;
    let chosenSquare;

    do {
        // pick a random square number
        let randomSquareNum = Math.floor(Math.random() * totalSquares);
        console.log("Computer player chose square #" + randomSquareNum);

        // select the chosen square
        chosenSquare = $("span.square").eq(randomSquareNum);

        // does the square have the class "computer-player" or "human-player"?
        if (chosenSquare.hasClass("computer-player")
            || chosenSquare.hasClass("human-player")) {
            squareOccupied = true;
            console.log("It was already taken!");
        } else {
            squareOccupied = false;
            console.log("It was free");
        }

    } while (squareOccupied);

    // give the square a CSS class
    chosenSquare.addClass("computer-player");

    // Remove its text
    chosenSquare.empty();
}

function checkForGameOver() {
    // Ask jQuery to find all the free squares
    let freeSquares = $("span.square").not(".human-player").not(".computer-player");

    // Any free squares left?
    if (freeSquares.length === 0) {
        gameOver();
    }
}

function gameOver() {
    console.log("Game Over!");

    // Create a Game Over heading
    let gameOverMessage = "<h1>Game Over</h1>";

    // Add it to the container div
    $("div.container").append(gameOverMessage);

    // Remove click handler from all spans
    $("span.square").off("click");
}

function createBoard() {
    // How big can each square be?
    // Add 2 to allow for one square's worth of padding on either side
    let squareWidth = Math.round(window.innerWidth / (totalCols + 2));
    console.log("width: " + squareWidth);
    let squareHeight = Math.round(window.innerHeight / (totalRows + 2));
    console.log("height: " + squareHeight);

    // Choose the smaller of the two dimensions so both height and width
    // will fit in the viewport and still be a square
    let bestDimension = Math.min(squareWidth, squareHeight);
    console.log("Squares should be: " + bestDimension);


    // store the board div in a variable
    let gameBoardDiv = $("#board");

    // loop to print rows of squares
    for (let rowNum = 1; rowNum <= totalRows; rowNum++) {
        // Create a new row
        let rowOfSquares = $("<div>");
        // give the row the class of "row" (for Bootstrap)
        rowOfSquares.addClass("row justify-content-center");
        // add the row to the gameboard
        gameBoardDiv.append(rowOfSquares);

        // loop to print the squares in each row
        for (let colNum = 1; colNum <= totalCols; colNum++) {
            // create an empty element to be a square on the board
            let square = $("<span>");
            // give the square its row number as data
            square.data("row", rowNum);
            // give the square its column number as data
            square.data("col", colNum);
            // set the width and height of the square
            square.width(bestDimension);
            square.height(bestDimension);
            // give the square the class of "square" to make it inline-block
            square.addClass("square");
            // display the square's row and column info
            square.html(`Row ${rowNum}<br>Col ${colNum}`);
            // make the square run a function when clicked
            square.click(humanPlayerTurn);

            // give the square a random color...
            let red, green, blue, luma;
            do {
                red = randomColorValue();
                green = randomColorValue();
                blue = randomColorValue();
                // ...but not too dark
                // See https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
                luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
            } while  (luma < 128);

            square.css("background-color", `rgb(${red}, ${green}, ${blue})`);

            // add the square to the current row
            rowOfSquares.append(square);
        }
    }
}

function randomColorValue() {
    return Math.floor(Math.random() * 255);
}