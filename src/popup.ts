
function UpdateLanguageSelect() {

    chrome.storage.sync.get(['DipAssistLanguage'], function (result) {

        const val = result.DipAssistLanguage;
        if (val === undefined) return;

        const radio = document.getElementById('LanguageSelect' + val);
        if (radio == null) return;
        if (!(radio instanceof HTMLInputElement)) return;

        (<HTMLInputElement>radio).checked = true;

    });

}

function SetLanguageSelect(value: string) {
    console.log("SetLanguageSelect: " + value);
    chrome.storage.sync.set({ 'DipAssistLanguage': value });
}

function SetupRadioButtonCallbacks() {
    const radEnglish = document.getElementById('LanguageSelectEnglish');
    if (radEnglish != null) radEnglish.onclick = function () { SetLanguageSelect('English'); }

    const radFrench = document.getElementById('LanguageSelectFrench');
    if (radFrench != null) radFrench.onclick = function () { SetLanguageSelect('French'); }
}

UpdateLanguageSelect();
SetupRadioButtonCallbacks();
