console.log("BraveOne Initiating.");
/*
*
* Initial Vars
*
* */
let $ = window.jQuery;
if (location.href.indexOf("chess.com") > -1) {

}


let squareRowDictionary;
let squareColDictionary;

let board;
let color;
let squareSize;

let blackOwned = $('<div/>', {
    class: 'domText',
});
let whiteOwned = $('<div/>', {
    class: 'domText',
});
let neutralOwned = $('<div/>', {
    class: 'domText',
});
$('<p style="color:red">B</p>').appendTo(blackOwned);
$('<p style="color:lawngreen">W</p>').appendTo(whiteOwned);
$('<p style="color:gray">N</p>').appendTo(neutralOwned);

let attackSquare = $('<div/>', {
    class: "customSquare",
    style:"background-color: #F39BB1"
});
let defendedSquare = $('<div/>', {
    class: "customSquare",
    style: "background-color: #9BF3A0"
});
let neutralSquare = $('<div/>', {
    class: "customSquare",
    style: "background-color: #FFE600"
});
let style = $("<style/>").prependTo("body");

function LoadChessComDivs() {
    if (location.href.indexOf("computer") > -1) {
        board = $("#chessboard_boardarea");
    }
    else {
        board = document.elementFromPoint(50, 50).children[0].getElementsByClassName("chessboard")
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
}

if (location.href.indexOf("chess.com") > -1) {
    function injectJavaScript(scriptName, callback) {
        let script = document.createElement('script');
        script.src = chrome.extension.getURL(scriptName);
        script.addEventListener('load', callback, false);
        (document.head || document.documentElement).appendChild(script);
    }


    $(window).on("load", function () {
        injectJavaScript('js/chesscomListener.js', function () {
            console.log('injected chesscomListener.js');
        });
        injectJavaScript('js/jquery-3.2.1.min.js', function () {
            console.log('injected jquery-3.2.1.min.js');
        });
        // right under chessboard_r7cdnp2


        // neutralOwned.append(neutralText);
        // blackOwned.append(blackText);
        // whiteOwned.append(whiteText);
        LoadChessComDivs();
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
});

// receive messages from background.js
chrome.runtime.onMessage.addListener(
    function (data) {
        console.log("Received message from Mothership");
        console.log(data);
        if (data.type === "state") {
            console.log("Received board state.", data);
            UpdateBoard(JSON.parse(data.state));
        }

    });

// function piecesToDict() {
//     let dict = {};
//     $("piece").each(function () {
//         let offsetStr;
//         let offsetCol;
//         let offsetRow;
//         try {
//             offsetStr = re.exec($(this)[0].style.cssText)[0].replaceAll("px", "").replaceAll(" ", "");
//             offsetCol = squareColDictionary[offsetStr.split(",")[0]];
//             offsetRow = squareRowDictionary[offsetStr.split(",")[1]];
//             dict[$(this)[0].className] = offsetCol + offsetRow;
//         } catch {
//         }
//     });
//     console.log(JSON.stringify(dict));
//     return dict;
// }

function UpdateBoard(data) {
    $('.domText').remove();
    $('.customSquare').remove();
    LoadChessComDivs();
    console.log("Updating board square colors.");
    let col;
    let row;
    let cssText;
    console.log(data);
    data.cells.forEach(function (square) {
        for (let key in square) {
            if (square.hasOwnProperty(key)) {
                col = squareColDictionary[key[0]];
                row = squareRowDictionary[key[1]];
                if (color === "black") {
                    // flip dictionary
                    row = Math.abs(row - (squareSize * 7));
                    col = Math.abs(col - (squareSize * 7));
                }
                if (square[key] === "Black") {
                    let div = blackOwned.clone(true);
                    div.css({transform: `translate(${col}px, ${row}px)`});
                    board.prepend(div);
                }
                else if (square[key] === "White") {
                    let div = whiteOwned.clone(true);
                    div.css({transform: `translate(${col}px, ${row}px)`});
                    board.prepend(div);
                }
                else if (square[key] === "Neutral") {
                    let div = neutralOwned.clone(true);
                    div.css({transform: `translate(${col}px, ${row}px)`});
                    board.prepend(div);
                }
            }
        }
    });
    data.pieces.forEach(function (piece) {
        for (let key in piece) {
            if (piece.hasOwnProperty(key)) {
                console.log("Processing", key);
                col = squareColDictionary[key[0]];
                row = squareRowDictionary[key[1]];
                if (color === "black") {
                    // flip dictionary
                    row = Math.abs(row - (squareSize * 7));
                    col = Math.abs(col - (squareSize * 7));
                }
                console.log("Col", col, "row", row);
                console.log("Square state is", piece[key]);
                if (piece[key] === "Protected") {
                    let div = defendedSquare.clone(true);
                    div.css({transform: `translate(${col}px, ${row}px)`});
                    board.prepend(div);
                }
                else if (piece[key] === "Attacked") {
                    let div = attackSquare.clone(true);
                    div.css({transform: `translate(${col}px, ${row}px)`});
                    board.prepend(div);
                }
                else if (piece[key] === "Neutral") {
                    let div = neutralSquare.clone(true);
                    div.css({transform: `translate(${col}px, ${row}px)`});
                    board.prepend(div);
                }
            }
        }
    });
}
