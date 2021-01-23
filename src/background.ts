chrome.runtime.onMessage.addListener(function (request) {
    chrome.tts.speak(request.toSay);
});