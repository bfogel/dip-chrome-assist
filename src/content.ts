import { DipAssistTimeRemaining } from "./DipAssistTimeRemaining";
import { DipAssistAlertManager } from "./DipAssistAlertManager";
 
let mDeadline: number;
 
let timeAssist: DipAssistTimeRemaining;
const mAlertManager = new DipAssistAlertManager();

function SetupCountdownTimer() {
  const AdjudicationInfoSpan = document.getElementById("adjudication-info");
  if (AdjudicationInfoSpan == null) return;

  const deadline = GetDeadlineFromAdjudicationInfoText(AdjudicationInfoSpan.innerHTML);
  if (deadline === undefined) return;

  mDeadline = Number(deadline);

  //Uncomment the line below to set a nearby deadline for testing
  //mDeadline = Date.now() + 0 * 60000 + 17 * 1000;

  const DeadlineDate = new Date(mDeadline);

  //NOTE: This is language-specific and will need to be modified for support beyond English
  AdjudicationInfoSpan.innerHTML = "Next adjudication: " + DeadlineDate.toString();
  AdjudicationInfoSpan.innerHTML += "<br><span id='dipCountdownSpan'>iguana</span>";

  timeAssist = new DipAssistTimeRemaining(mDeadline - Date.now());

  //mAlertManager.AddAlert(mDeadline - Date.now() - 10 * 1000);

}

function GetDeadlineFromAdjudicationInfoText(pText: string): number | undefined {
  let iSearch = pText.indexOf("(");
  if (iSearch == -1) undefined;

  let sDeadlineTimeAndDate = pText.substring(iSearch + 1).trim();

  iSearch = sDeadlineTimeAndDate.indexOf(")");
  if (iSearch == -1) return undefined;
  sDeadlineTimeAndDate = sDeadlineTimeAndDate.substring(0, iSearch).trim();

  //NOTE: This is language-specific and will need to be modified for support beyond English
  if (sDeadlineTimeAndDate.substring(0, 2) == "at") sDeadlineTimeAndDate = sDeadlineTimeAndDate.substring(2).trim();

  const sTimeZone = sDeadlineTimeAndDate.substring(sDeadlineTimeAndDate.length - 4, sDeadlineTimeAndDate.length).trim();
  sDeadlineTimeAndDate = sDeadlineTimeAndDate.substring(0, sDeadlineTimeAndDate.length - 4).trim();

  iSearch = sDeadlineTimeAndDate.indexOf(",");
  if (iSearch == -1) return undefined;
  const sTime = sDeadlineTimeAndDate.substring(0, iSearch).trim();
  const sDate = sDeadlineTimeAndDate.substring(iSearch + 1).trim();

  sDeadlineTimeAndDate = sDate + " " + sTime + " " + sTimeZone;

  return Date.parse(sDeadlineTimeAndDate);

}

function UpdateCountdown() {

  const countdownSpan = document.getElementById("dipCountdownSpan");

  if (mDeadline == null) return;
  if (countdownSpan == null) return;
  if (timeAssist == null || !timeAssist.IsInitialized()) return;

  let totalms = Math.max(0, mDeadline - Date.now());
  totalms = 1000 * Math.floor(totalms / 1000);
  timeAssist.totalMilliseconds = totalms;

  countdownSpan.innerHTML = timeAssist.GetTimeRemainingDisplayValue();
  countdownSpan.setAttribute("style", timeAssist.GetSpanStylePartFromTimeRemaining());

  mAlertManager.CheckForAlert(timeAssist);

  setTimeout(UpdateCountdown, 1000);
}

SetupCountdownTimer();
UpdateCountdown();

