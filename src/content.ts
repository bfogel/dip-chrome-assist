let mDeadline: number;
let mCountdownSpan: HTMLElement | null;
let timeAssist: DipAssistTimeRemaining; 

function SetupCountdownTimer() {
  const elm = document.getElementById("adjudication-info");
  if (elm == null) return;

  let s = elm.innerHTML;
  elm.innerHTML += "<br><span id='dipCountdownSpan'>poop</span>";
  mCountdownSpan = document.getElementById("dipCountdownSpan");

  let ss = s.split("(");
  if (ss.length < 2) return;

  s = ss[1];
  if (s.length < 3) return;
  s = s.slice(3);

  ss = s.split(")");
  if (ss.length < 1) return;
  s = ss[0];

  mDeadline = Date.parse(s);

}

function UpdateCountdown() {
  if (mDeadline == null) return;
  if (mCountdownSpan == null) return;

  let countdown = mDeadline - Date.now();

  timeAssist = new DipAssistTimeRemaining(countdown);
  mCountdownSpan.innerHTML = timeAssist.GetTimeRemainingDisplayValue();

  var style = GetCountdownStyle();
  mCountdownSpan.setAttribute("style", style);

  //  TODO: more informed shouldSpeakNow logic
  if (this.shouldSpeakNow()) {
      if (timeAssist.minutes != 0)
      {
        Speak(timeAssist.minutes.toString() + " minutes left");
      }
      else
      {
        Speak(timeAssist.seconds.toString() + " seconds left");
      }
      
    setTimeout(UpdateCountdown, 1000);
  }
}

function Speak(sText: string) {
  chrome.runtime.sendMessage({ toSay: sText });
}

function ShouldSpeakNow() : Boolean
{
  var shouldSpeakNow : Boolean;

  //  TODO: flesh out content.ts determining when to speak
  if (timeAssist.days == 0 && timeAssist.hours == 0 && timeAssist.minutes % 5 == 0  && timeAssist.seconds == 0)
  {
    shouldSpeakNow = true;
  }
  else
  {
   shouldSpeakNow = false; 
  }

  return shouldSpeakNow;
}

function GetCountdownStyle()
{
  var fontSize = GetCountdownStyleFontSize();
  var color = GetCountdownStyleColor();
  return fontSize+color;
}

function GetCountdownStyleFontSize()
{
  return "font-Size : 250%;";
}

function GetCountdownStyleColor()
{
  if (this.days == 0 && this.hours == 0 && this.minutes == 0)
  {
    return "color : red;";
  }
  else
  {
    return "";
  }
}

SetupCountdownTimer();
UpdateCountdown();

