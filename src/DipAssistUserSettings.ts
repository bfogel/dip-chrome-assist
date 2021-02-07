
class UserSettingProperty {

    public constructor(key: string, defaultvalue: any, setvalue: (value: any) => void) {
        this.key = key;
        this.defaultvalue = defaultvalue;
        this.setvalue = setvalue;
    }
    public key: string;
    public defaultvalue: any;
    private setvalue: (value: any) => void;

    public SetValue(value: any) {
        this.setvalue(value === undefined ? this.defaultvalue : value);
    }
}

export class DipAssistUserSettings {

    public constructor() {
        console.log("DipAssistUserSettings constructed");

        this._properties.push(new UserSettingProperty("DipAssistLanguage", "English", (value) => this.Language_Validate(value)));
        this._properties.push(new UserSettingProperty("DipAssistVoiceAlertsEnabled", true, (value) => this._VoiceAlertsEnabled = value));
        this._properties.push(new UserSettingProperty("DipAssistVoiceAlertsVolume", 0.5, (value) => this._VoiceAlertsVolume = value));
        this._properties.push(new UserSettingProperty("DipAssistShowOriginalText", false, (value) => this._ShowOriginalText = value));

        this.EnsureValuesAreLoaded();
        this.SinkOnChangedWatch();
    }

    private _properties: UserSettingProperty[] = [];

    public OnPropertyChanged? : () =>void;

    private _language: string;
    public get Language(): string {
        return this._language;
    }
    public set Language(value: string) {
        this.Language_Validate(value);
        chrome.storage.sync.set({ 'DipAssistLanguage': this._language });
    }
    private Language_Validate(value: string) {
        switch (value) {
            case "English":
            case "French":
                this._language = value;
                break;
            default:
        }
    }

    private _ShowOriginalText: boolean;
    public get ShowOriginalText(): boolean { return this._ShowOriginalText; }
    public set ShowOriginalText(value: boolean) {
        this._ShowOriginalText = value;
        chrome.storage.sync.set({ 'DipAssistShowOriginalText': this._ShowOriginalText });
    }

    private _VoiceAlertsEnabled: boolean;
    public get VoiceAlertsEnabled(): boolean { return this._VoiceAlertsEnabled; }
    public set VoiceAlertsEnabled(value: boolean) {
        this._VoiceAlertsEnabled = value;
        chrome.storage.sync.set({ 'DipAssistVoiceAlertsEnabled': this._VoiceAlertsEnabled });
    }

    private _VoiceAlertsVolume: number;
    public get VoiceAlertsVolume(): number { return this._VoiceAlertsVolume; }
    public set VoiceAlertsVolume(value: number) {
        this._VoiceAlertsVolume = value;
        chrome.storage.sync.set({ 'DipAssistVoiceAlertsVolume': this._VoiceAlertsVolume });
    }

    public Initialized = false;

    public EnsureValuesAreLoaded(callback?: () => void): void {
        if (this.Initialized) {
            if (callback !== undefined) callback();
            return;
        }

        const keys = this._properties.map(x => x.key);
        chrome.storage.sync.get(keys, function (result) {
            keys.forEach(key => {
                const src = UserSettings._properties.find((x) => x.key == key);
                if (src !== undefined) {
                    src.SetValue(result[key]);
                };
            });
            if (callback !== undefined) callback();
            UserSettings.Initialized = true;
        });
    }

    private SinkOnChangedWatch() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        chrome.storage.onChanged.addListener(function (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) {
            for (const key in changes) {
                const src = UserSettings._properties.find(x => x.key == key);
                if (src !== undefined) src.SetValue(changes[key].newValue);
            }
            if(UserSettings.OnPropertyChanged) UserSettings.OnPropertyChanged();
        })
    }

}

const UserSettings = new DipAssistUserSettings;
//Object.freeze(UserSettings);
export default UserSettings;

