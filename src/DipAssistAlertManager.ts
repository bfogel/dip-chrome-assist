import { DipAssistTimeRemaining } from "./DipAssistTimeRemaining";
import UserSettings from "./DipAssistUserSettings";

export class DipAssistAlertManager {
 
    constructor() {
        this.AddAlert(10 * 60000);
        this.AddAlert(5 * 60000);
        this.AddAlert(2 * 60000);
        this.AddAlert(1 * 60000);
        this.AddAlert(0.5 * 60000);
        this.AddAlert(15000);
        this.AddAlert(10000);
        this.AddAlert(5000);
        this.AddAlert(0);
    }

    LastTimeRemaining: DipAssistTimeRemaining | null = null;
    AlertsAt :  DipAssistTimeRemaining[] = [];
    CheckCount = 0;

    /**
     * Causes an alert to be raised when the time remaining passes pMinutes 
     */
    public AddAlert(pTimeRemainingInMilliseconds: number) : void {
        const timeRemaining = new DipAssistTimeRemaining(pTimeRemainingInMilliseconds);
        this.AlertsAt.push( timeRemaining );
        this.AlertsAt.sort();
        this.AlertsAt.reverse();
    }

    /**
     * Checks to see if an alert is needed
     */
    public CheckForAlert(pTimeRemaining : DipAssistTimeRemaining) : void {
 
        this.CheckCount++;
 
        if (this.LastTimeRemaining != null) {
            this.AlertsAt.forEach(alerttime => {            
                if (alerttime != null && this.LastTimeRemaining != null && alerttime.IsLargerThanOrEqualTo(pTimeRemaining) && alerttime.IsSmallerThan(this.LastTimeRemaining) ) {
                    this.RaiseAlert(alerttime);
                }
            })
        }

        this.LastTimeRemaining = pTimeRemaining.Duplicate();

    }

    private RaiseAlert(pTimeRemaining : DipAssistTimeRemaining) {
        if(UserSettings.VoiceAlertsEnabled) this.Speak(pTimeRemaining.GetTimeRemainingSpokenText());
    }

    public Speak(sText: string) : void {
        chrome.runtime.sendMessage({ toSay: sText });
    }      

}