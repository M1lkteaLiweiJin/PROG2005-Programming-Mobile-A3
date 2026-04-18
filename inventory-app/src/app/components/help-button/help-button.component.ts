/**
 * HelpButtonComponent
 *
 * Re-usable help widget rendered as a Floating Action Button (FAB)
 * pinned to the bottom-right of the host page. Tapping it opens an
 * Ionic AlertController dialog with a context-specific message.
 *
 * Usage:
 *   Drop `<app-help-button [message]="helpText"></app-help-button>`
 *   INSIDE the page's `<ion-content>` (the FAB uses `slot="fixed"`
 *   so it floats over the content and stays in view while scrolling).
 *
 * Author: Kangzhe Zhao
 */
import { Component, Input } from '@angular/core';
import {
  IonFab,
  IonFabButton,
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [IonFab, IonFabButton, IonIcon],
  template: `
    <ion-fab slot="fixed" vertical="center" horizontal="end" edge="true">
      <ion-fab-button
        color="warning"
        (click)="showHelp()"
        aria-label="Open help dialog">
        <ion-icon name="help-circle-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [`
    ion-fab {
      /* Pin to the right edge, vertically centred; the "edge" attribute
         lets half of the button overhang the viewport so it reads as a
         side-mounted handle. */
    }
    ion-fab-button {
      --box-shadow: 0 6px 18px rgba(0, 0, 0, 0.32);
      --background: var(--ion-color-warning, #f5a623);
      --color: #fff;
    }
  `]
})
export class HelpButtonComponent {
  /** Page-specific help text to display inside the alert. */
  @Input() public message: string =
    'This screen helps you manage inventory records.';

  /** Optional title override. */
  @Input() public header: string = 'Help';

  /** Optional sub-header rendered above the message. */
  @Input() public subHeader: string = 'Quick guide';

  constructor(private readonly alertCtrl: AlertController) {}

  /** Open an Ionic alert with the current help message. */
  public async showHelp(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.header,
      subHeader: this.subHeader,
      message: this.message,
      cssClass: 'app-help-alert',
      buttons: [{ text: 'Got it', role: 'cancel' }]
    });
    await alert.present();
  }
}
