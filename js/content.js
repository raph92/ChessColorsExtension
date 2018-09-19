console.log("BraveOne Initiating.");
let $ = window.jQuery;

let re = /\d+px, \d+px/;
let attackSquare = document.createElement('square');
$(attackSquare).css({
    height: "64px",
    width: "64px",
    "background-color": "#F39BB1",
});
attackSquare.className = "customSquare";
let defendedSquare = document.createElement('square');
$(defendedSquare).css({
    height: "64px",
    width: "64px",
    "background-color": "#9BF3A0"
});
defendedSquare.className = "customSquare";
let neutralSquare = document.createElement('square');
$(neutralSquare).css({
    height: "64px",
    width: "64px",
    "background-color": "#FFE600"
});
neutralSquare.className = "customSquare";
let squareRowDictionary = {
    448: 1,
    384: 2,
    320: 3,
    256: 4,
    192: 5,
    128: 6,
    64: 7,
    0: 8
};

let squareColDictionary = {
    448: "H",
    384: "G",
    320: "F",
    256: "E",
    192: "D",
    128: "C",
    64: "B",
    0: "A"
};
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
Object.prototype.reverseSearch = function (search) {
    const target = this;
    for (let key in target) {
        if (target[key] == search)
            return key;
    }
    return null;
};

// receive messages from background.js
chrome.runtime.onMessage.addListener(
    function (data, sender, sendResponse) {
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
                $(".cg-board-wrap").append(div);
            }
            else if(square[key] === "Attacked"){
                let div = attackSquare.cloneNode(true);
                div.style.cssText += cssText;
                $(".cg-board-wrap").append(div);
            }
            else if(square[key] === "Neutral"){
                let div = neutralSquare.cloneNode(true);
                div.style.cssText += cssText;
                $(".cg-board-wrap").append(div);
            }
            else{
            }
        }
    });


}
