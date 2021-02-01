let lastFen = ''
const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
setInterval(function () {
  try {
    let element = document.querySelector('.move-feedback-row-component')
    if (!element) {
      element = document.querySelector('.lines-component')
    }
    let fen
    try {
      fen = element.getAttribute('fen')
    } catch (e) {
      fen = DEFAULT_FEN
    }
    if (lastFen === fen)
      return
    lastFen = fen
    // lines-component
    sendFen(fen)
  } catch (e) {
    if (location.href.indexOf('analysis') === -1)
      console.log(e)
    else
      console.log(e)
  }
}, 200)

function getColor () {
  let element = document.getElementsByClassName('evaluation-bar-fill')[0].children
  console.log(element)
  const userColor = element[1]
  return userColor.className.indexOf('white') > -1  ? 'white' : 'black'
}

function sendFen (fen) {
  console.log(JSON.stringify(fen))
  let color = getColor()
  console.log(color)
  console.log('board fen is ', fen)
  let message = {
    type: 'fen',
    color: color,
    fen: fen,
  }
  window.postMessage(message, '*')
}
