console.log("popup.js loaded.");
function reFindBoard(){
    console.log("Sending find command to background.js");
    chrome.runtime.sendMessage(null,{type: "find"});
}
function flipBoard(){
    console.log("Sending find command to background.js");
    chrome.runtime.sendMessage(null, {type: "flip"});
}
document.getElementById('find-btn').addEventListener('click', reFindBoard);

document.getElementById('flip').addEventListener('click', flipBoard);
