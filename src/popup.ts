
import UserSettings from "./DipAssistUserSettings";

function UpdateValues() {
 
    UserSettings.EnsureValuesAreLoaded(() => {

        const radio = document.getElementById('LanguageSelect' + UserSettings.Language);
        if (radio != null && (radio instanceof HTMLInputElement)) (<HTMLInputElement>radio).checked = true;

        const ckbVoiceAlerts = document.getElementById('VoiceAlertsEnabled') as HTMLInputElement;
        if (ckbVoiceAlerts != null && ckbVoiceAlerts instanceof HTMLInputElement) ckbVoiceAlerts.checked = UserSettings.VoiceAlertsEnabled;

        const ddnVolume = document.getElementById('VoiceAlertsVolume') as HTMLSelectElement;
        if (ddnVolume != null && ddnVolume instanceof HTMLSelectElement) ddnVolume.value = String(UserSettings.VoiceAlertsVolume);

        const ckbShowOriginalText = document.getElementById('ShowOriginalText') as HTMLInputElement;
        if (ckbShowOriginalText != null && ckbShowOriginalText instanceof HTMLInputElement) ckbShowOriginalText.checked = UserSettings.ShowOriginalText;

    });

}

function SetupCallbacks() {
    const radEnglish = document.getElementById('LanguageSelectEnglish');
    if (radEnglish != null) radEnglish.onclick = function () { UserSettings.Language = 'English'; }

    const radFrench = document.getElementById('LanguageSelectFrench');
    if (radFrench != null) radFrench.onclick = function () { UserSettings.Language = 'French'; }

    const ckbVoiceAlerts = document.getElementById('VoiceAlertsEnabled') as HTMLInputElement;
    if (ckbVoiceAlerts != null) ckbVoiceAlerts.onchange = function () {UserSettings.VoiceAlertsEnabled = ckbVoiceAlerts.checked; }

    const ddnVolume = document.getElementById('VoiceAlertsVolume') as HTMLSelectElement;
    if (ddnVolume != null) ddnVolume.onchange = function () {UserSettings.VoiceAlertsVolume = Number(ddnVolume.value); }

    const ckbShowOriginalText = document.getElementById('ShowOriginalText') as HTMLInputElement;
    if (ckbShowOriginalText != null) ckbShowOriginalText.onchange = function () {UserSettings.ShowOriginalText = ckbShowOriginalText.checked; }

    const btnTestSpeech = document.getElementById('btnTestSpeech') as HTMLButtonElement;
    if (btnTestSpeech != null) btnTestSpeech.onclick = function () { testSpeech(); }

}

function testSpeech(){
    let ss : string;

    switch (UserSettings.Language) {
        case "English":
          ss = "The deadline has passed";
          break;
        case "French":
          ss = "La limite de temps est passée";
          break;
        default:
          throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
      }
      
      chrome.runtime.sendMessage({ toSay: ss });
}

UpdateValues();
SetupCallbacks();
