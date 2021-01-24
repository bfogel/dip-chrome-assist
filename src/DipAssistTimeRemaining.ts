class DipAssistTimeRemaining{
  public days: number;
  public hours: number;
  public minutes: number;
  public seconds: number;
  public timeRemainingDisplay: HTMLElement | null;

  public constructor(milliseconds : number)
  {
    this.milliseconds = milliseconds;
    this.InitializeFromMilliseconds();
  }

  public GetSpanStylePartFromTimeRemaining() : string
  {
    var fontSize = GetCountdownStyleFontSize();
    var color = GetCountdownStyleColor();
    return fontSize+color;
  }

  public GetTimeRemainingDisplayValue() : string 
  {
      var daysPart = this.days + " days, ";
      var hoursPart = this.hours + " hours, ";
      var minutesPart = this.minutes + " minutes, ";
      var secondsPart = this.seconds + " seconds";

      var report;

      if (this.days > 0)
      {
        report = daysPart + hoursPart + minutesPart + secondsPart;
      }
      else if (this.hours > 0)
      {
        report = hoursPart + minutesPart + secondsPart;
      }
      else if (this.minutes > 0)
      {
        report = minutesPart + secondsPart;
      }
      else if (this.seconds > 0)
      {
        report = secondsPart;
      }
      else
      {
        report = "DEADLINE PASSED!";
      }

      return report;
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

  private milliseconds: number;
  private MILLISECONDS_PER_DAY : number = 1000 * 60 * 60 * 24;
  private MILLISECONDS_PER_HOUR : number = 1000 * 60 * 60;
  private MILLISECONDS_PER_MINUTE : number = 1000 * 60;
  private MILLISECONDS_PER_SECOND : number = 1000;
  
  private InitializeFromMilliseconds()
  {
    this.days = this.DaysFromMilliseconds();
    this.hours = this.HoursFromMilliseconds();
    this.minutes = this.MinutesFromMilliseconds();
    this.seconds = this.SecondsFromMilliseconds();
  }
}