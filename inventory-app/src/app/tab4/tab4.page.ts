/**
 * Tab4Page - Privacy & Security Information
 *
 * Static informational screen explaining how the app handles user
 * data, secure communications, and permitted operations.
 *
 * Author: Kangzhe Zhao
 */
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';

import { HelpButtonComponent } from '../components/help-button/help-button.component';

@Component({
  selector: 'app-tab4',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    HelpButtonComponent
  ],
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss']
})
export class Tab4Page {
  public readonly helpText: string =
    'This page lists the privacy and security guarantees the app ' +
    'provides and the practical steps you should follow to keep your ' +
    'inventory data safe.';
}
