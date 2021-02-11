
let lastFen = ''
function hideModal () {
  // Append styles element
  const style = $('<style/>').prependTo('body')
  // .share-menu-modal {
  //   display: none !important;
  // }
  style.html(`
  .modal-container-component {
    display: none !important;
  }
  `)
  return style
}

function getColor () {
  let color
  const board = document.querySelector('chess-board')
  if (board.className.indexOf('flipped') > -1) {
    color = 'black'
  } else
    color = 'white'
  console.log(color)
  return color
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

let mutationTrackerNo = 0
// Options for the observer (which mutations to observe)
const config = {
  attributes: true,
  childList: true,
  subtree: false,
  attributeOldValue: true,
}

const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  mutationTrackerNo++
  for (const mutation of mutationsList) {
    switch (mutation.type){
      case "attributes":
        switch (mutation.attributeName){
          case "class":
            console.log('Piece class changed')
            // const style = hideModal()
            let fen
            $('.share-menu-tab-pgn-section' +
              ' .form-input-component' +
              ' > input').ready(() => {
              fen = document.querySelector('.share-menu-tab-pgn-section' +
                ' .form-input-component' +
                ' > input').value
              // style.remove()
              if (lastFen === fen)
                return
              lastFen = fen
              // lines-component
              sendFen(fen)
            })
        }
    }
  }
}
function docReady (fn) {
  // https://stackoverflow.com/a/9899701
  // see if DOM is already available
  if (document.readyState === 'complete' || document.readyState ===
    'interactive') {
    // call on next available tick
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}
let $ = window.jQuery
docReady(function () {
  const style = hideModal()
  $('[data-test="download"]').ready(()=> {
    document.querySelector('[data-test="download"]').click()
  })
  // Select the node that will be observed for mutations
  const targetNode = document.querySelector('chess-board')
// Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback)
// Start observing the target node for configured mutations
  observer.observe(targetNode, config)
})
