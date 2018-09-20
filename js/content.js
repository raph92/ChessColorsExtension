console.log("BraveOne Initiating.");
/*
*
* Initial Vars
*
* */
let $ = window.jQuery;
if (location.href.indexOf("chess.com") > -1) {

}
attacked = "#F39BB1";
defenedColor = "#9BF3A0";
neutralColor = "#FFE600";

let squareRowDictionary;
let squareColDictionary;

let board;
let color;
let squareSize;

let ready = false;


let style = $("<style/>").prependTo("body");
let squares = {};
let ownedTexts = {};

function renderWhiteSide() {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let letters = "ABCDEFGH".split("");
            let numbers = "12345678".split("");
            let name = letters[x] + numbers[y];
            squares[name] = $('<div/>', {
                class: "customSquare",
                name: "cs-" + name,
            });
            ownedTexts[name] = $('<div/>', {
                class: "domText",
                name: "d-" + name,
            }).append('<p/>');
        }
    }
}

console.log(squares);

function LoadChessComDivs() {
    // $("[id*=container]").remove();
    if (location.href.indexOf("computer") > -1) {
        board = $("#chessboard_boardarea");
    }
    else {
        board = document.elementFromPoint(50, 50).children[0].getElementsByClassName("chessboard")[0]
    }

    board = $(board);
    console.log("Board is", board);
    squareSize = $(".chess_com_piece").first().attr("width");
    console.log("Square size is", squareSize);
    style.html(
        `.domText p {
            font-size: xx-large;  
        }
        .domText {
            width: ${squareSize}px;
            height: ${squareSize}px;
            position: absolute;
            text-align: center;
            z-index: 5;     
        }
        .customSquare{
            position: absolute;
            z-index: 2;
            pointer-events: none;
            opacity: 0.9;
            width: ${squareSize}px;
            height: ${squareSize}px;
        }`);
    squareRowDictionary = {
        1: squareSize * 7,
        2: squareSize * 6,
        3: squareSize * 5,
        4: squareSize * 4,
        5: squareSize * 3,
        6: squareSize * 2,
        7: squareSize,
        8: 0,
    };

    squareColDictionary = {
        "A": 0,
        "B": squareSize,
        "C": squareSize * 2,
        "D": squareSize * 3,
        "E": squareSize * 4,
        "F": squareSize * 5,
        "G": squareSize * 6,
        "H": squareSize * 7,
    };
    let col;
    let row;

    for (let key in squares) {
        if (squares.hasOwnProperty(key)) {
            col = squareColDictionary[key[0]];
            row = squareRowDictionary[key[1]];
            if (color === "black") {
                // flip dictionary
                row = Math.abs(row - (squareSize * 7));
                col = Math.abs(col - (squareSize * 7));
            }
            squares[key].css({transform: `translate(${col}px, ${row}px)`});
        }
    }
    for (let key in ownedTexts) {
        if (ownedTexts.hasOwnProperty(key)) {
            col = squareColDictionary[key[0]];
            row = squareRowDictionary[key[1]];
            if (color === "black") {
                // flip dictionary
                row = Math.abs(row - (squareSize * 7));
                col = Math.abs(col - (squareSize * 7));
            }
            ownedTexts[key].css({transform: `translate(${col}px, ${row}px)`});
        }
    }

}

function reInitDivs(){
    console.log("Removing all custom elements and reinitializing.");
    $('.domText').remove();
    $('.customSquare').remove();
    squares = {};
    ownedTexts = {};
    renderWhiteSide();
    LoadChessComDivs();
    for (let key in squares) {
        if (squares.hasOwnProperty(key))
            squares[key].prependTo(board);
    }
    for (let key in ownedTexts) {
        if (ownedTexts.hasOwnProperty(key))
            ownedTexts[key].prependTo(board);
    }
}

if (location.href.indexOf("chess.com") > -1) {
    function injectJavaScript(scriptName, callback) {
        let script = document.createElement('script');
        script.src = chrome.extension.getURL(scriptName);
        script.addEventListener('load', callback, false);
        (document.head || document.documentElement).appendChild(script);
    }


    $(['id*=container']).ready(function () {
        renderWhiteSide();
        LoadChessComDivs();
        injectJavaScript('js/jquery-3.2.1.min.js', function () {
            console.log('injected jquery-3.2.1.min.js');
        });
        injectJavaScript('js/chesscomListener.js', function () {
            console.log('injected chesscomListener.js');
        });
        for (let key in squares) {
            if (squares.hasOwnProperty(key))
                squares[key].prependTo(board);
        }
        for (let key in ownedTexts) {
            if (ownedTexts.hasOwnProperty(key))
                ownedTexts[key].prependTo(board);
        }
        ready = true;
        console.log("ChessCom fully loaded.");
    });

}

else {
    board = $(".cg-board-wrap");
    squareSize = 64;
    squareRowDictionary = {
        448: 1,
        384: 2,
        320: 3,
        256: 4,
        192: 5,
        128: 6,
        64: 7,
        0: 8
    };
    squareColDictionary = {
        448: "H",
        384: "G",
        320: "F",
        256: "E",
        192: "D",
        128: "C",
        64: "B",
        0: "A"
    };
    attackSquare = document.createElement('square');
    attackSquare.className = "customSquare";

    defendedSquare = document.createElement('square');
    defendedSquare.className = "customSquare";

    neutralSquare = document.createElement('square');
    neutralSquare.className = "customSquare";
    $(attackSquare).css({
        height: squareSize + "px",
        width: squareSize + "px",
        "background-color": "#F39BB1",
    });
    $(neutralSquare).css({
        height: squareSize + "px",
        width: squareSize + "px",
        "background-color": "#FFE600"
    });
    $(defendedSquare).css({
        height: squareSize + "px",
        width: squareSize + "px",
        "background-color": "#9BF3A0"
    });
}

window.addEventListener('message', function (event) {
    if (event.data.type === 'fen') {
        color = event.data.color;
        chrome.runtime.sendMessage(event.data, function (response) {
        });
    }
    else if (event.data.type === 'render') {
        console.log("Re-rendering.");
        color = event.data.color;
        LoadChessComDivs();
    }
});

// receive messages from background.js
chrome.runtime.onMessage.addListener(
    function (data) {
        console.log("Received message from Mothership\nType:", data.type);
        if (data.type === "state") {
            UpdateBoard(JSON.parse(data.state));
        }
        if (data.type === "find") {
            reInitDivs();
        }

        if (data.type === "flip") {
            LoadChessComDivs();
        }

    });

function UpdateBoard(data) {
    console.log("Received board state.", data);
    if (!ready)
        return;
    $('.domText').hide();
    $('.customSquare').hide();
    console.log("Updating board square colors...");
    data.cells.forEach(function (square) {
        for (let key in square) {
            if (square.hasOwnProperty(key)) {
                if (square[key] === "Black") {
                    $(ownedTexts[key]).find("p").text("B").css({color: "black"});
                    $(ownedTexts[key]).show();
                }
                else if (square[key] === "White") {
                    $(ownedTexts[key]).find("p").text("W").css({color: "white"});
                    $(ownedTexts[key]).show();
                }
                else if (square[key] === "Neutral") {
                    $(ownedTexts[key]).find("p").text("N").css({color: "gray"});
                    $(ownedTexts[key]).show();
                }
                else{
                    $(ownedTexts[key]).hide();
                }
            }
        }
    });
    data.pieces.forEach(function (piece) {
        for (let key in piece) {
            if (piece.hasOwnProperty(key)) {
                if (piece[key] === "Protected") {
                    squares[key].css({"background-color": defenedColor});
                    squares[key].show();
                }
                else if (piece[key] === "Attacked") {
                    squares[key].css({"background-color": attacked});
                    squares[key].show();
                }
                else if (piece[key] === "Neutral") {

                    squares[key].css({"background-color": neutralColor});
                    squares[key].show();
                }
                else{
                    squares[key].hide();
                }
            }
        }
    });
    console.log("Finished.");
}
