var mDeadline;
var mCountdownSpan;

function SetupCountdownTimer(){
  dtDeadline = null;

  var elm = document.getElementById("adjudication-info");
  if (elm==null) return;

  var s = elm.innerHTML;
  elm.innerHTML += "<br><span id='dipCountdownSpan'>poop</span>";
  mCountdownSpan = document.getElementById("dipCountdownSpan");

  var ss = s.split("(");
  if (ss.length<2) return;
  
  s = ss[1];
  if(s.length<3) return;
  s = s.slice(3);
  
  ss = s.split(")");
  if (ss.length<1) return;
  s = ss[0];

  mDeadline = Date.parse(s);

}

function UpdateCountdown() {
  if (mDeadline == null) return;
  if (mCountdownSpan == null) return;

  var countdown = mDeadline - Date.now();

  if (countdown<0) countdown=0;

  var hours = Math.floor(countdown / 3600000);
  countdown -= 3600000 * hours;
  
  var minutes = Math.floor(countdown / 60000);
  countdown -= 60000 * minutes;
  
  var seconds = Math.floor(countdown / 1000);

  var s = hours.toString() + ":" + minutes.toString().padStart(2,"0") + ":" + seconds.toString().padStart(2,"0");
  mCountdownSpan.innerHTML = s;

  if(countdown > 0) {
    if (seconds==0) {
      Speak(minutes.toString() + " minutes left");
    }
    setTimeout(UpdateCountdown, 1000);
  }
}

function Speak(sText){
  chrome.runtime.sendMessage({toSay: sText}, function() {});
}

SetupCountdownTimer();
UpdateCountdown();

