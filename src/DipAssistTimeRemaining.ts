
function IniatializeDipAssistTimeRemainingLanguageTracking() {

  chrome.storage.sync.get(['DipAssistLanguage'], function (result) {
    const val = result.DipAssistLanguage;
    if (val === undefined) return;
    switch (val) {
      case "English":
      case "French":
        DipAssistLanguage = val;
        break;
      default:
    }

  });

  chrome.storage.onChanged.addListener(function (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) {

    for (const key in changes) {
      if (key == "DipAssistLanguage") {
        const val = changes[key].newValue;
        if (val != null) DipAssistLanguage = val;
      }
    }
 
  })
}

let DipAssistLanguage = "English";
IniatializeDipAssistTimeRemainingLanguageTracking();

export class DipAssistTimeRemaining {

  public constructor(totalMilliseconds = 0) {
    this.totalMilliseconds = totalMilliseconds;
  }

  private _days: number;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;

  public get days(): number { return this._days; }
  public get hours(): number { return this._hours; }
  public get minutes(): number { return this._minutes; }
  public get seconds(): number { return this._seconds; }

  private _totalMilliseconds: number;
  public get totalMilliseconds(): number {
    return this._totalMilliseconds;
  }
  public set totalMilliseconds(value: number) {
    this._totalMilliseconds = value;
    this._days = this.DaysFromMilliseconds();
    this._hours = this.HoursFromMilliseconds();
    this._minutes = this.MinutesFromMilliseconds();
    this._seconds = this.SecondsFromMilliseconds();
  }

  public get language(): string {
    return DipAssistLanguage;
  }

  public Duplicate(): DipAssistTimeRemaining {
    return new DipAssistTimeRemaining(this.totalMilliseconds) ;
  }

  public IsInitialized(): boolean {
    return !this.CountdownIsNotInitialized();
  }

  public IsEqualTo(pTimeRemaining: DipAssistTimeRemaining): boolean {
    return this.totalMilliseconds == pTimeRemaining.totalMilliseconds;
  }
  public IsLargerThan(pTimeRemaining: DipAssistTimeRemaining): boolean {
    return this.totalMilliseconds > pTimeRemaining.totalMilliseconds;
  }
  public IsLargerThanOrEqualTo(pTimeRemaining: DipAssistTimeRemaining): boolean {
    return this.totalMilliseconds >= pTimeRemaining.totalMilliseconds;
  }
  public IsSmallerThan(pTimeRemaining: DipAssistTimeRemaining): boolean {
    return this.totalMilliseconds < pTimeRemaining.totalMilliseconds;
  }
  public IsSmallerThanOrEqualTo(pTimeRemaining: DipAssistTimeRemaining): boolean {
    return this.totalMilliseconds <= pTimeRemaining.totalMilliseconds;
  }

  private DoValidationCheck() {
    if (this.CountdownIsNotInitialized()) {
      throw new Error("dipAssistTimeRemaining countdown has not be initialized. call InitialitizeCountdown(totalMilliseconds : number)");
    }
  }

  private CountdownIsNotInitialized(): boolean {
    return this.totalMilliseconds == null;
  }

  public GetSpanStylePartFromTimeRemaining(): string {
    this.DoValidationCheck();
    const fontSize = this.GetCountdownStyleFontSize();
    const color = this.GetCountdownStyleColor();
    return fontSize + color;
  }

  public GetTimeRemainingDisplayValue(): string {
    this.DoValidationCheck();
    const daysPart = this.days + " " + this.GetDaysDisplayValueByLanguage() + ", ";
    const hoursPart = this.hours + " " + this.GetHoursDisplayValueByLanguage() + ", ";
    const minutesPart = this.minutes + " " + this.GetMinutesDisplayValueByLanguage() + ", ";
    const secondsPart = this.seconds + " " + this.GetSecondsDisplayValueByLanguage();

    let displayValue;

    if (this.days > 0) {
      displayValue = daysPart + hoursPart + minutesPart + secondsPart;
    }
    else if (this.hours > 0) {
      displayValue = hoursPart + minutesPart + secondsPart;
    }
    else if (this.minutes > 0) {
      displayValue = minutesPart + secondsPart;
    }
    else if (this.seconds > 0) {
      displayValue = secondsPart;
    }
    else {
      displayValue = this.GetDeadlinePassedTextByLanguage();
    }

    return displayValue;
  }

  public GetTimeRemainingSpokenText(): string {
    this.DoValidationCheck();
    const daysPart = this.days + " " + this.GetDaysDisplayValueByLanguage() + ", ";
    const hoursPart = this.hours + " " + this.GetHoursDisplayValueByLanguage() + ", ";
    const minutesPart = this.minutes + " " + this.GetMinutesDisplayValueByLanguage() + ", ";
    const secondsPart = this.seconds + " " + this.GetSecondsDisplayValueByLanguage() + ", ";

    let spokentext = "";

    if (this.days > 0) {
      spokentext += daysPart;
    }
    else if (this.hours > 0) {
      spokentext += hoursPart;
    }
    else if (this.minutes > 0) {
      spokentext += minutesPart;
    }
    else if (this.seconds > 0) {
      spokentext += secondsPart;
    }

    if (spokentext != "") {
      spokentext = spokentext.substring(0, spokentext.length - 2);
      spokentext += this.GetCountdownClosingTextByLanguage();
    }
    else {
      spokentext = this.GetDeadlinePassedTextByLanguage();
    }

    return spokentext;
  }

  private DaysFromMilliseconds(): number {
    if (this.totalMilliseconds == null) return 0;

    return Math.floor(this.totalMilliseconds / this.MILLISECONDS_PER_DAY);
  }

  private HoursFromMilliseconds(): number {
    if (this.totalMilliseconds == null) return 0;

    // let days = this.DaysFromMilliseconds();
    // let millisecondsAfterDays = this.totalMilliseconds - (days * this.MILLISECONDS_PER_DAY);

    return Math.floor(this.totalMilliseconds / this.MILLISECONDS_PER_HOUR);
  }

  private MinutesFromMilliseconds(): number {
    if (this.totalMilliseconds == null) return 0;

    const hours = this.HoursFromMilliseconds();
    const millisecondsAfterHours = this.totalMilliseconds - (hours * this.MILLISECONDS_PER_HOUR);

    return Math.floor(millisecondsAfterHours / this.MILLISECONDS_PER_MINUTE);
  }

  private SecondsFromMilliseconds(): number {
    if (this.totalMilliseconds == null) return 0;

    const minutes = this.MinutesFromMilliseconds();
    const millisecondsAfterMinutes = this.totalMilliseconds - (this.hours * this.MILLISECONDS_PER_HOUR) - (minutes * this.MILLISECONDS_PER_MINUTE);

    return Math.floor(millisecondsAfterMinutes / this.MILLISECONDS_PER_SECOND);
  }

  private GetDaysDisplayValueByLanguage() {
    let displayValue: string;
    switch (this.language) {
      case "English":
        displayValue = this.hours == 1 || this.hours == -1 ? "day" : "days";
        break;
      case "French":
        displayValue = this.hours == 1 || this.hours == -1 ? "journée" : "journées";
        break;
      default:
        throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetHoursDisplayValueByLanguage() {
    let displayValue: string;
    switch (this.language) {
      case "English":
        displayValue = this.hours == 1 || this.hours == -1 ? "hour" : "hours";
        break;
      case "French":
        displayValue = this.hours == 1 || this.hours == -1 ? "heure" : "heures";
        break;
      default:
        throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetMinutesDisplayValueByLanguage() {
    let displayValue: string;
    switch (this.language) {
      case "English":
      case "French":
        displayValue = this.minutes == 1 || this.minutes == -1 ? "minute" : "minutes";
        break;
      default:
        throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetSecondsDisplayValueByLanguage() {
    let displayValue: string;
    switch (this.language) {
      case "English":
        displayValue = this.seconds == 1 || this.seconds == -1 ? "second" : "seconds";
        break;
      case "French":
        displayValue = this.seconds == 1 || this.seconds == -1 ? "seconde" : "secondes";
        break;
      default:
        throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetDeadlinePassedTextByLanguage() {
    let displayValue: string;
    switch (this.language) {
      case "English":
        displayValue = "The deadline has passed";
        break;
      case "French":
        displayValue = "La limite de temps est passée";
        break;
      default:
        throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetCountdownClosingTextByLanguage() {
    let lastIsPlural = true;
    const arr = [this.seconds, this.minutes, this.hours, this.days];
    for (const elm of arr) {
      lastIsPlural = (elm != 1);
      if (elm > 0) break;
    }

    let displayValue: string;
    switch (this.language) {
      case "English":
        displayValue = "remaining";
        break;
      case "French":
        displayValue = "restante";
        if (lastIsPlural) displayValue += "s";
        break;
      default:
        throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetCountdownStyleColor() {
    if (this.days == 0 && this.hours == 0 && this.minutes == 0) {
      return "color : red;";
    }
  }

  private GetCountdownStyleFontSize() {
    return "font-Size : 250%;";
  }

  private MILLISECONDS_PER_DAY: number = 1000 * 60 * 60 * 24;
  private MILLISECONDS_PER_HOUR: number = 1000 * 60 * 60;
  private MILLISECONDS_PER_MINUTE: number = 1000 * 60;
  private MILLISECONDS_PER_SECOND = 1000;
}