console.log('BraveOne Initiating.')
/*
*
* Initial Vars
*
* */
let $ = window.jQuery
if (location.href.indexOf('chess.com') > -1) {

}
ATTACKED = '#F39BB1'
DEFENDED = '#9BF3A0'
NEUTRAL = '#FFE600'

let squareRowDictionary
let squareColDictionary

let board
let color
let squareSize

let ready = false

let style = $('<style/>').prependTo('body')
let squares = {}
let ownedTexts = {}
let scoreTexts = {}

function renderWhiteSide () {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let letters = 'ABCDEFGH'.split('')
      let numbers = '12345678'.split('')
      let name = letters[x] + numbers[y]
      squares[name] = $('<div/>', {
        class: 'customSquare',
        name: 'cs-' + name,
      })
      ownedTexts[name] = $('<div/>', {
        class: 'domText',
        name: 'd-' + name,
      }).append('<span class="dominance"/>').append('<span class="score"/>')
    }
  }
}

console.log(squares)

function LoadChessComDivs () {
  // $("[id*=container]").remove();
  board = $('chess-board')
  console.log('Board is', board)
  squareSize = document.getElementsByClassName('piece')[0].offsetWidth
  console.log('Square size is', squareSize)
  style.html(
    `.domText p {
            font-size: large;  
        }
        .domText {
            width: ${squareSize}px;
            height: ${squareSize}px;
            position: absolute;
            text-align: center;
            z-index: 5;
            top: 4.5%;    
            font-size: large
        }
        .dominance {
            margin-right: 5px;
        }
        .customSquare{
            position: absolute;
            z-index: 0;
            pointer-events: none;
            opacity: 0.75;
            width: ${squareSize}px;
            height: ${squareSize}px;
        }`)
  squareRowDictionary = {
    1: squareSize * 7,
    2: squareSize * 6,
    3: squareSize * 5,
    4: squareSize * 4,
    5: squareSize * 3,
    6: squareSize * 2,
    7: squareSize,
    8: 0,
  }

  squareColDictionary = {
    'A': 0,
    'B': squareSize,
    'C': squareSize * 2,
    'D': squareSize * 3,
    'E': squareSize * 4,
    'F': squareSize * 5,
    'G': squareSize * 6,
    'H': squareSize * 7,
  }
  let col
  let row

  for (let key in squares) {
    if (squares.hasOwnProperty(key)) {
      col = squareColDictionary[key[0]]
      row = squareRowDictionary[key[1]]
      if (color === 'black') {
        // flip dictionary
        row = Math.abs(row - (squareSize * 7))
        col = Math.abs(col - (squareSize * 7))
      }
      squares[key].css({ transform: `translate(${col}px, ${row}px)` })
    }
  }
  for (let key in ownedTexts) {
    if (ownedTexts.hasOwnProperty(key)) {
      col = squareColDictionary[key[0]]
      row = squareRowDictionary[key[1]]
      if (color === 'black') {
        // flip dictionary
        row = Math.abs(row - (squareSize * 7))
        col = Math.abs(col - (squareSize * 7))
      }
      ownedTexts[key].css({ transform: `translate(${col}px, ${row}px)` })
    }
  }
  for (let key in scoreTexts) {
    if (scoreTexts.hasOwnProperty(key)) {
      col = squareColDictionary[key[0]]
      row = squareRowDictionary[key[1]]
      if (color === 'black') {
        // flip dictionary
        row = Math.abs(row - (squareSize * 7))
        col = Math.abs(col - (squareSize * 7))
      }
      scoreTexts[key].css({ transform: `translate(${col}px, ${row}px)` })
    }
  }

}

function reInitDivs () {
  console.log('Removing all custom elements and reinitializing.')
  $('.domText').remove()
  $('.customSquare').remove()
  squares = {}
  ownedTexts = {}
  renderWhiteSide()
  LoadChessComDivs()
  for (let key in squares) {
    if (squares.hasOwnProperty(key))
      squares[key].prependTo(board)
  }
  for (let key in ownedTexts) {
    if (ownedTexts.hasOwnProperty(key))
      ownedTexts[key].prependTo(board)
  }
}

if (location.href.indexOf('chess.com') > -1) {
  function injectJavaScript (scriptName, callback) {
    let script = document.createElement('script')
    script.src = chrome.extension.getURL(scriptName)
    script.addEventListener('load', callback, false);
    (document.head || document.documentElement).appendChild(script)
  }

  $('chess-board').ready(function () {
    renderWhiteSide()
    LoadChessComDivs()
    injectJavaScript('js/jquery-3.2.1.min.js', function () {
      console.log('injected jquery-3.2.1.min.js')
    })
    injectJavaScript('js/chesscomListener.js', function () {
      console.log('injected chesscomListener.js')
    })
    for (let key in squares) {
      squares[key].prependTo(board)
    }
    for (let key in ownedTexts) {
      ownedTexts[key].prependTo(board)
    }
    // for (let key in scoreTexts) {
    //     scoreTexts[key].prependTo(board);
    // }
    ready = true
    console.log('ChessCom fully loaded.')
  })

} else {
  board = $('.cg-board-wrap')
  squareSize = 64
  squareRowDictionary = {
    448: 1,
    384: 2,
    320: 3,
    256: 4,
    192: 5,
    128: 6,
    64: 7,
    0: 8,
  }
  squareColDictionary = {
    448: 'H',
    384: 'G',
    320: 'F',
    256: 'E',
    192: 'D',
    128: 'C',
    64: 'B',
    0: 'A',
  }
  attackSquare = document.createElement('square')
  attackSquare.className = 'customSquare'

  defendedSquare = document.createElement('square')
  defendedSquare.className = 'customSquare'

  neutralSquare = document.createElement('square')
  neutralSquare.className = 'customSquare'
  $(attackSquare).css({
    height: squareSize + 'px',
    width: squareSize + 'px',
    'background-color': '#F39BB1',
  })
  $(neutralSquare).css({
    height: squareSize + 'px',
    width: squareSize + 'px',
    'background-color': '#FFE600',
  })
  $(defendedSquare).css({
    height: squareSize + 'px',
    width: squareSize + 'px',
    'background-color': '#9BF3A0',
  })
}

window.addEventListener('message', function (event) {
  if (event.data.type === 'fen') {
    color = event.data.color

    chrome.runtime.sendMessage(event.data, function (response) {
    })
  } else if (event.data.type === 'render') {
    console.log('Re-rendering.')
    color = event.data.color
    LoadChessComDivs()
  }
})

// receive messages from background.js
chrome.runtime.onMessage.addListener(
  function (data) {
    console.log('Received message from Mothership\nType:', data.type)
    if (data.type === 'state') {
      UpdateBoard(JSON.parse(data.state))
    }
    if (data.type === 'find') {
      reInitDivs()
    }

    if (data.type === 'flip') {
      LoadChessComDivs()
    }

  })

function UpdateBoard (data) {
  console.log('Received board state.', data)
  if (!ready)
    return
  $('.domText').hide()
  $('.customSquare').hide()
  console.log('Updating board square colors...')
  data.cells.forEach(function (square) {
    let dominance = square.dominance
    let cell = square.name
    let blackAttackers = square.blackAttackers
    let whiteAttackers = square.whiteAttackers
    let score = whiteAttackers.length - blackAttackers.length
    $(ownedTexts[cell]).show()
    if (dominance === 'Black') {
      $(ownedTexts[cell]).find('.dominance').text('B').css({ color: 'green' })
    } else if (dominance === 'White') {
      $(ownedTexts[cell]).find('.dominance').text('W').css({ color: 'blue' })
    } else if (dominance === 'Neutral') {
      $(ownedTexts[cell]).find('.dominance').text('C').css({ color: 'orange' })
    } else{
      $(ownedTexts[cell]).find('.dominance').hide()
    }
    // console.log(cell, 'score:', score)
    $(ownedTexts[cell]).
      find('.score').
      text(`${score}`).
      css({ color: 'gray' });
  })
  data.pieces.forEach(function (piece) {
    let safety = piece.safety
    let square = piece.square
    if (safety === 'Protected') {
      squares[square].css({ 'background-color': DEFENDED })
      squares[square].show()
    } else if (safety === 'Attacked') {
      squares[square].css({ 'background-color': ATTACKED })
      squares[square].show()
    } else if (safety === 'Neutral') {

      squares[square].css({ 'background-color': NEUTRAL })
      squares[square].show()
    } else {
      squares[square].hide()
    }
  })
  console.log('Finished.')
}

window.onresize = LoadChessComDivs
