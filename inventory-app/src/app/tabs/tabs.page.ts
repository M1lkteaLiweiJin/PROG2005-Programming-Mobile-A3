/**
 * TabsPage - Host component for the strict Ionic "Tabs" template.
 * Defines the four bottom tabs that make up the app shell.
 *
 * Author: abc
 */
import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Inventory</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2">
          <ion-icon name="add-circle-outline"></ion-icon>
          <ion-label>Add / Featured</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3">
          <ion-icon name="create-outline"></ion-icon>
          <ion-label>Edit / Delete</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4">
          <ion-icon name="shield-checkmark-outline"></ion-icon>
          <ion-label>Privacy</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsPage {}
