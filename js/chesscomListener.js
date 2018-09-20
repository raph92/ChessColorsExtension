let chessBoard;
const observer = new MutationObserver(function (mutate) {

    let elements = document.querySelectorAll('.chessboard');
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.id.indexOf('dummyBoard') > -1)
            continue;
        if (element.ready)
            continue;

        element.ready = true;
        if (chessBoard == null)
            chessBoard = element.chessBoard;
        console.log("chessboard is", chessBoard);
        console.log(chessBoard._customEventStacks);
        if (!chessBoard)
            continue;
        // chessBoard._customEventStacks['onDropPiece'].stack.push({
        //     callback: ()=>{
        //         console.log("onDropPiece called");
        //         sendFen();
        //     }
        // });
        // chessBoard._customEventStacks['onAfterMoveAnimated'].stack.push({
        //     callback: ()=>{
        //         console.log("onAfterMoveAnimated called");
        //         sendFen()
        //
        //     }
        // });
        // chessBoard._customEventStacks['onBoardLoaded'].stack.push({
        //     callback: ()=>{
        //         console.log("onBoardLoaded called");
        //         sendFen()
        //     }
        // });
        // chessBoard._customEventStacks['onPartialResize'].stack.push({
        //     callback: ()=>{
        //         console.log("onPartialResize called.");
        //         sendFen()
        //     }
        // });
        chessBoard._customEventStacks['onRefresh'].stack.push({
            callback: ()=>{
                console.log("onRefresh called.");
                sendFen()
            }
        });
        chessBoard._customEventStacks['onRenderReady'].stack.push({
            callback: () =>{
                console.log("onRenderReady called");
                sendFen();

            }

        });
    }

});

function sendFen() {
    let color;
    if (!chessBoard.boardFlip)
        color = "white";
    else
        color = "black";
    let fen = chessBoard.getBoardApi().getProperty('selectedFen');
    console.log("board api is ", chessBoard.getBoardApi());
    let message = {
        type: 'fen',
        color: color,
        fen: fen,
    };
    window.postMessage(message, '*');
}

let element;
if (location.href.indexOf("computer") > -1)
    element = document.getElementById('content');
else
    element = document.getElementsByClassName('chessboard-component_0')[0];

observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});
