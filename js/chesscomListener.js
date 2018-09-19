const observer = new MutationObserver(function (_) {
    let elements = document.querySelectorAll('.chessboard');
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.id.indexOf('dummyBoard') > -1)
            continue;
        if (element.ready)
            continue;

        element.ready = true;
        let chessBoard = element.chessBoard;

        if (!chessBoard)
            continue;
        chessBoard._customEventStacks['onAfterMoveAnimated'].stack.push({
            callback: function (e) {
                let fen = chessBoard.getBoardApi().getProperty('selectedFen');
                let message = {
                    type: 'fen',
                    fen: fen,
                };
                window.postMessage(message, '*');
            }
        });
    }
});

let element = document.getElementById('content');

observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});