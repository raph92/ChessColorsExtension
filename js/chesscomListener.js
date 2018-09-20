let $ = window.jQuery;
let chessBoard;
const observer = new MutationObserver(function (_) {
    let elements = document.querySelectorAll('.chessboard');
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.id.indexOf('dummyBoard') > -1)
            continue;
        if (element.ready)
            continue;

        element.ready = true;
        chessBoard = element.chessBoard;

        if (!chessBoard)
            continue;
        chessBoard._customEventStacks['onDropPiece'].stack.push({
            callback: sendFen
        });
        chessBoard._customEventStacks['onAfterMoveAnimated'].stack.push({
            callback: sendFen
        });
        chessBoard._customEventStacks['onBoardLoaded'].stack.push({
            callback: sendFen
        });
        chessBoard._customEventStacks['onPartialResize'].stack.push({
            callback: sendFen
        });
        chessBoard._customEventStacks['onRefresh'].stack.push({
            callback: sendFen
        });
        chessBoard._customEventStacks['onRenderReady'].stack.push({
            callback: sendFen
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
