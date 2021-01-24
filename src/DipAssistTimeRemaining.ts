class DipAssistTimeRemaining{
  public readonly days: number;
  public readonly hours: number;
  public readonly minutes: number;
  public readonly seconds: number;
  public readonly timeRemainingDisplay: HTMLElement | null;
  public readonly language: string;

  public constructor(milliseconds : number, language : string = "English")
  {
    this.milliseconds = milliseconds;
    this.days = this.DaysFromMilliseconds();
    this.hours = this.HoursFromMilliseconds();
    this.minutes = this.MinutesFromMilliseconds();
    this.seconds = this.SecondsFromMilliseconds();
  }

  public GetSpanStylePartFromTimeRemaining() : string
  {
    var fontSize = GetCountdownStyleFontSize();
    var color = GetCountdownStyleColor();
    return fontSize+color;
  }

  public GetTimeRemainingDisplayValue() : string 
  {
      var daysPart = this.days + " " + this.GetDaysDisplayValueByLanguage() + ", ";
      var hoursPart = this.hours + " " + this.GetHoursDisplayValueByLanguage() + ", ";
      var minutesPart = this.minutes + " " + this.GetMinutesDisplayValueByLanguage() + ", ";
      var secondsPart = this.seconds + " " + this.GetSecondsDisplayValueByLanguage();

      var displayValue;

      if (this.days > 0)
      {
        displayValue = daysPart + hoursPart + minutesPart + secondsPart;
      }
      else if (this.hours > 0)
      {
        displayValue = hoursPart + minutesPart + secondsPart;
      }
      else if (this.minutes > 0)
      {
        displayValue = minutesPart + secondsPart;
      }
      else if (this.seconds > 0)
      {
        displayValue = secondsPart;
      }
      else
      {
        displayValue = "The deadline has passed.";
      }

      return displayValue;
  }

  private DaysFromMilliseconds() : number
  {
    if (this.milliseconds == null) return 0;

    return Math.floor(this.milliseconds / this.MILLISECONDS_PER_DAY);
  }

  private HoursFromMilliseconds() : number
  {
    if (this.milliseconds == null) return 0;

    var days = this.DaysFromMilliseconds();
    var millisecondsAfterDays = this.milliseconds - (days * this.MILLISECONDS_PER_DAY);

    return Math.floor(millisecondsAfterDays / this.MILLISECONDS_PER_HOUR );
  }

  private MinutesFromMilliseconds() : number
  {
    if (this.milliseconds == null) return 0;

    var hours = this.HoursFromMilliseconds();
    var millisecondsAfterHours = this.milliseconds - (hours * this.MILLISECONDS_PER_HOUR);

    return Math.floor(millisecondsAfterHours /  this.MILLISECONDS_PER_MINUTE);
  }

  private SecondsFromMilliseconds() : number
  {
    if (this.milliseconds == null) return 0;

    var minutes = this.MinutesFromMilliseconds();
    var millisecondsAfterMinutes = this.milliseconds - (minutes *  this.MILLISECONDS_PER_MINUTE);

    return Math.floor(millisecondsAfterMinutes / this.MILLISECONDS_PER_SECOND);
  }

  private GetDaysDisplayValueByLanguage()
  {
    let displayValue : string;
    switch(this.language)
    {
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

  private GetHoursDisplayValueByLanguage()
  {
    let displayValue : string;
    switch(this.language)
    {
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

  private GetMinutesDisplayValueByLanguage()
  {
    let displayValue : string;
    switch(this.language)
    {
      case "English":
        displayValue = this.minutes == 1 || this.minutes == -1 ? "minute" : "minutes";
        break;
      case "French":
        displayValue = this.minutes == 1 || this.minutes == -1 ? "minute" : "minutes";
        break;
      default:
          throw new Error("unsupported language in DipAssistTimeRemaining: " + this.language);
    }
    return displayValue;
  }

  private GetSecondsDisplayValueByLanguage()
  {
    let displayValue : string;
    switch(this.language)
    {
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

  private milliseconds: number;
  private MILLISECONDS_PER_DAY : number = 1000 * 60 * 60 * 24;
  private MILLISECONDS_PER_HOUR : number = 1000 * 60 * 60;
  private MILLISECONDS_PER_MINUTE : number = 1000 * 60;
  private MILLISECONDS_PER_SECOND : number = 1000;
}