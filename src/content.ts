import { DipAssistTimeRemaining } from "./DipAssistTimeRemaining";
import { DipAssistAlertManager } from "./DipAssistAlertManager";
import UserSettings from "./DipAssistUserSettings";

let mDeadline: number;
let mOriginalAdjudicationInfoText: string;
let mGameIsWaitingForAdjudication: boolean;
let mGameIsInGrace: boolean;

let timeAssist: DipAssistTimeRemaining;
const mAlertManager = new DipAssistAlertManager();

function SetupCountdownTimer() {
  const AdjudicationInfoSpan = document.getElementById("adjudication-info");
  if (AdjudicationInfoSpan == null) return;

  mOriginalAdjudicationInfoText = AdjudicationInfoSpan.innerHTML;

  mGameIsWaitingForAdjudication = mOriginalAdjudicationInfoText.includes("Waiting for adjudication");
  mGameIsInGrace = mOriginalAdjudicationInfoText.includes("grace period");

  const deadline = GetDeadlineFromAdjudicationInfoText(mOriginalAdjudicationInfoText);
  if (deadline === undefined || deadline == null) return;

  mDeadline = Number(deadline);

  //Uncomment the line below to set a nearby deadline for testing
  //mDeadline = Date.now() + 0 * 60000 + 17 * 1000;

  timeAssist = new DipAssistTimeRemaining(mDeadline - Date.now());

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

  let iOffsetFromUTC: number | undefined = undefined;
  switch (sTimeZone) {
    case "GMT": iOffsetFromUTC = 0; break;
    case "BST":
    case "CET": iOffsetFromUTC = 1; break;
    case "CEST": 
    case "EET": iOffsetFromUTC = 2; break;
    case "MSK": 
    case "FET": 
    case "EEST": iOffsetFromUTC = 3; break;
    case "AWST": iOffsetFromUTC = 8; break;
    case "ACST": iOffsetFromUTC = 9.5; break;
    case "AEST": iOffsetFromUTC = 10; break;
    case "ACDT": iOffsetFromUTC = 10.5; break;
    case "AEDT": iOffsetFromUTC = 11; break;
    default: break;
  }

  sDeadlineTimeAndDate = sDate + " " + sTime + ((iOffsetFromUTC === undefined) ? " " + sTimeZone : "");

  let ret = Date.parse(sDeadlineTimeAndDate);
  if(isNaN(ret)) return undefined;

  if (iOffsetFromUTC !== undefined) {
    iOffsetFromUTC += new Date().getTimezoneOffset() / 60;
    ret -= iOffsetFromUTC * 60 * 60 * 1000;
  }

  return ret;
}

function SetupDisplay() {

  const AdjudicationInfoSpan = document.getElementById("adjudication-info");
  if (AdjudicationInfoSpan == null) return;

  //NOTE: This is language-specific and will need to be modified for support beyond English
  let s = "<span id ='dipAdjudicationInfo'></span>";
  s += "<br><span id = 'dipCountdownSpan'>iguana</span>"
  AdjudicationInfoSpan.innerHTML = s;

}

function UpdateDisplay() {

  const countdownSpan = document.getElementById("dipCountdownSpan");
  if (countdownSpan == null) return;

  if (timeAssist == null || !timeAssist.IsInitialized()) {
    countdownSpan.innerHTML = mOriginalAdjudicationInfoText + "<br>(DipAssist could not initialize countdown. Ask the GM to try a different time zone.)";
    return;
  }

  if (mDeadline == null) return;

  let sAdjudicationInfo: string;
  if (UserSettings.ShowOriginalText) {
    sAdjudicationInfo = mOriginalAdjudicationInfoText;
  } else {
    const DeadlineDate = new Date(mDeadline);
    sAdjudicationInfo = "Next adjudication: " + DeadlineDate.toString();
    if (mGameIsWaitingForAdjudication) sAdjudicationInfo += "<br><i>(Waiting for adjudication!)</i>";
    if (mGameIsInGrace) sAdjudicationInfo += "<br><i>(Game is in grace period)</i>";
  }
  const AdjudicationInfoSpan = document.getElementById('dipAdjudicationInfo');
  if (AdjudicationInfoSpan != null) AdjudicationInfoSpan.innerHTML = sAdjudicationInfo;

  let totalms = Math.max(0, mDeadline - Date.now());
  totalms = 1000 * Math.floor(totalms / 1000);
  timeAssist.totalMilliseconds = totalms;

  countdownSpan.innerHTML = timeAssist.GetTimeRemainingDisplayValue();
  countdownSpan.setAttribute("style", timeAssist.GetSpanStylePartFromTimeRemaining());

  mAlertManager.CheckForAlert(timeAssist);

  setTimeout(UpdateDisplay, 1000);
}

SetupCountdownTimer();
SetupDisplay();
UserSettings.EnsureValuesAreLoaded(UpdateDisplay);
UserSettings.OnPropertyChanged = UpdateDisplay;

