let mDeadline: number;
let mCountdownSpan: HTMLElement | null;

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

  if (countdown < 0) countdown = 0;

  const hours = Math.floor(countdown / 3600000);
  countdown -= 3600000 * hours;

  const minutes = Math.floor(countdown / 60000);
  countdown -= 60000 * minutes;

  const seconds = Math.floor(countdown / 1000);

  const s = hours.toString() + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
  mCountdownSpan.innerHTML = s;

  var style = GetCountdownStyle(hours, minutes);
  mCountdownSpan.setAttribute("style", style);

  if (countdown > 0) {
    if (seconds == 0) {
      Speak(minutes.toString() + " minutes left");
    }
    setTimeout(UpdateCountdown, 1000);
  }
}

function Speak(sText: string) {
  chrome.runtime.sendMessage({ toSay: sText });
}

function GetCountdownStyle(hours : number, minutes : number)
{
  var fontSize = GetCountdownStyleFontSize();
  var color = GetCountdownStyleColor(hours, minutes);
  return fontSize+color;
}

function GetCountdownStyleFontSize()
{
  return "font-Size : 250%;";
}

function GetCountdownStyleColor(hours : number, minutes : number)
{
  if (hours == 0 && minutes == 0)
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

