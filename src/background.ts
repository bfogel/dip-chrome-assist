
import UserSettings from "./DipAssistUserSettings"; 

chrome.runtime.onMessage.addListener(function (request) {
    if(request.toSay !== undefined){
        const opts : chrome.tts.SpeakOptions = { volume: UserSettings.VoiceAlertsVolume};
        chrome.tts.speak( String(request.toSay), opts);
    } else {
        //do nothing
    }
});
