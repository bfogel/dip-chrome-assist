
chrome.runtime.onMessage.addListener(function (request) {

    if(request.toSay != undefined){
        chrome.tts.speak( String(request.toSay) );
    } else {
        //do nothing
    }
});