console.log("BraveOne Initiating.");
/*
*
* Initial Vars
*
* */
let $ = window.jQuery;
if (location.href.indexOf("chess.com") > -1) {

}

let re = /\d+px, \d+px/;


let squareRowDictionary;
let squareColDictionary;
let attackSquare;
let defendedSquare;
let neutralSquare;
let board;
if (location.href.indexOf("chess.com") > -1) {
    function injectJavaScript(scriptName, callback) {
        var script = document.createElement('script');
        script.src = chrome.extension.getURL(scriptName);
        script.addEventListener('load', callback, false);
        (document.head || document.documentElement).appendChild(script);
    }

    injectJavaScript('js/chesscomListener.js', function () {
        console.log('injected chesscomListener.js');
    });
    window.addEventListener('message', function (event) {

        if (event.data.type === 'fen') {
            chrome.runtime.sendMessage(event.data, function (response) {
            });
        }
    });
    board = $("#chessboard_boardarea");

    squareRowDictionary = {
        665: 1,
        570: 2,
        475: 3,
        380: 4,
        285: 5,
        190: 6,
        95: 7,
        0: 8
    };
    squareColDictionary = {
        665: "H",
        570: "G",
        475: "F",
        380: "E",
        285: "D",
        190: "C",
        95: "B",
        0: "A"
    };

    attackSquare = document.createElement('div');
    attackSquare.className = "customSquare";

    defendedSquare = document.createElement('div');
    defendedSquare.className = "customSquare";

    neutralSquare = document.createElement('div');
    neutralSquare.className = "customSquare";
    $(attackSquare).css({
        position: "absolute",
        "z-index": 2,
        "pointer-events": "none",
        opacity: 0.9,
        width: "95px",
        height: "95px",
        "background-color": "#F39BB1",
    });
    $(neutralSquare).css({
        position: "absolute",
        "z-index": 2,
        "pointer-events": "none",
        opacity: 0.9,
        width: "95px",
        height: "95px",
        "background-color": "#FFE600"
    });
    $(defendedSquare).css({
        position: "absolute",
        "z-index": 2,
        "pointer-events": "none",
        opacity: 0.9,
        width: "95px",
        height: "95px",
        "background-color": "#9BF3A0"
    });

}
else {
    board = $(".cg-board-wrap");
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
        height: "64px",
        width: "64px",
        "background-color": "#F39BB1",
    });
    $(neutralSquare).css({
        height: "64px",
        width: "64px",
        "background-color": "#FFE600"
    });
    $(defendedSquare).css({
        height: "64px",
        width: "64px",
        "background-color": "#9BF3A0"
    });
}


String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
Object.prototype.reverseSearch = function (search) {
    const target = this;
    for (let key in target)
        if (target[key] == search)
            return key;
    return null;
};

// receive messages from background.js
chrome.runtime.onMessage.addListener(
    function (data, _, _1) {
        console.log("Received message from Mothership");
        console.log(data);
        if (data.type === "state") {
            console.log("Received board state.");
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
    $(".customSquare").remove();
    console.log("Updating board square colors.");
    let col;
    let row;
    let cssText;
    console.log(data);
    data.forEach(function (square) {
        for (let key in square) {
            if (!square.hasOwnProperty(key))
                return;
            console.log("Processing", key);
            col = squareColDictionary.reverseSearch(key[0]);
            row = squareRowDictionary.reverseSearch(key[1]);
            cssText = `transform: translate(${col}px, ${row}px);`;
            console.log("Col", col, "row", row, "cssText", cssText);
            console.log("Square state is", square[key]);
            if (square[key] === "Protected") {
                let div = defendedSquare.cloneNode(true);
                div.style.cssText += cssText;
                board.append(div);
            }
            else if (square[key] === "Attacked") {
                let div = attackSquare.cloneNode(true);
                div.style.cssText += cssText;
                board.append(div);
            }
            else if (square[key] === "Neutral") {
                let div = neutralSquare.cloneNode(true);
                div.style.cssText += cssText;
                board.append(div);
            }
            else {
            }
        }
    });


}
