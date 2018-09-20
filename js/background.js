let move = null;
let conn;
let cache = null;
let cacheQueue = [];
let attempts = 0;
let maxAttempts = 20;
let active = false;
let pinging = false;
let paused = false;
let tabId = 0;

let fen = "";
let mover = "";
// get tabId
chrome.tabs.query({pinned: true}, function (e) {
    tabId = e[0].id;
});


// attach debugger
chrome.tabs.query({pinned: true}, function (e) {
    chrome.debugger.attach({tabId: e[0].id}, "1.1", function () {
        tabId = e[0].id;
        chrome.debugger.sendCommand({tabId: e[0].id}, "Network.enable");
        chrome.debugger.onEvent.addListener(onEvent);
        chrome.debugger.onDetach.addListener(function (source, reason) {
            console.log("Debugger detached", reason);
        });
        console.log("Debugger attached.");
    });
});

// manage incoming debugger events
function onEvent(debuggeeId, message, params) {
    if (tabId !== debuggeeId.tabId)
        return;
    if (message === "Network.webSocketFrameReceived") {
        // do something with params.response.payloadData,
        //   it contains the data RECEIVED
        try {
            let data = JSON.parse(params.response.payloadData);
            if (data.t === "move") {
                console.log(params.response.payloadData);
                let dataDict = {};
                dataDict.fen = data.d.fen;
                fen = dataDict.fen;
                send(JSON.stringify(dataDict), "board_request");
            }
        } catch (e) {
            console.log(e);
        }
        console.log(params.response.payloadData);
    }
}


// listen for content script messages
chrome.runtime.onMessage.addListener(function (request, _, _1) {  // callback function not used in favor of async, tab specific response
    if (request.type === 'fen') {
        send(JSON.stringify(request), "board_request")
    }

});

// send move to content.js
function receivedBoardState(boardState) {
    console.log("Received board state from MotherShip. Sending to BraveOne.");
    sendToContent({state: boardState, type: "state"});
}

function sendToContent(json) {
    let r = null;
    console.log(tabId);
    chrome.tabs.sendMessage(tabId, json, function (response) {
        console.log(JSON.stringify(response));
    });
    // while (r === null){}
    return r;
}

let Thread;

function mothershipReady() {
    return conn.readyState === conn.OPEN;
}

// connect to websocket hosted by yours truly
function initConn() {
    console.log(`Pinging MotherShip. (${attempts})`);
    conn = new WebSocket("ws://localhost:5002/bridge");
    conn.onopen = function () {
        send('Standing by.', "Anbu");
        console.log("Connected with MotherShip.");
        let temp = cacheQueue;
        let i = 0;
        temp.forEach(function (msg) {
            conn.send(msg);
            console.log("[Uncached] " + msg);
            cacheQueue.splice(i, 1);
            i++;
        });
        active = true;
        pinging = false;
        attempts = 0;
    };
    conn.onerror = function (e) {
        console.log(e);
    };


    conn.onmessage = function (e) { // receive message from mothership
        console.log(e.data);
        if (e.data.indexOf("board_state") > -1) {
            {
                let boardstate = e.data.split("board_state")[1];
                receivedBoardState(boardstate);
            }
        }

    };
    conn.onclose = function () {
        console.log("Awaiting MotherShip.");
        pinging = false;
        PingMotherShip();
    };

}


// make it easy to identify what kind of message is being sent. also wakes the pinger up incase of sleeping
function send(msg, type) {
    let readied = type + " " + msg;
    if (mothershipReady())
        conn.send(readied);
    else {
        cacheQueue.push(readied);
        console.log("[Cached] " + readied);
        paused = false;
        if (!pinging) {
            attempts = 0;
            PingMotherShip();
        }
    }
}

function PingMotherShip() {
    if (pinging || paused)
    // Prevent function from running twice.
        return;
    pinging = true;
    if (attempts > maxAttempts) {
        console.log(`No response from MotherShip in more than ${maxAttempts} attempts. Sleeping.`);
        paused = true;
        pinging = false;
        return;
    }
    if (conn != null) {
        if (conn.readyState === conn.OPEN) {
            console.log("MotherShip ping ending.");
            clearInterval(Thread);
            return;
        }
    }
    initConn();
    // attempts++;
}


PingMotherShip();

