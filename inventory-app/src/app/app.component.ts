/**
 * AppComponent - Standalone root component that hosts the Ionic
 * router-outlet. Also registers ionicons used throughout the app.
 * Author: Shihao Yang
 */
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  addCircleOutline,
  createOutline,
  shieldCheckmarkOutline,
  searchOutline,
  starOutline,
  star,
  helpCircleOutline,
  trashOutline,
  saveOutline,
  cubeOutline,
  pricetagOutline,
  businessOutline,
  listOutline,
  refreshOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  constructor() {
    // Register all icons used across the app so they can be referenced by name.
    addIcons({
      homeOutline,
      addCircleOutline,
      createOutline,
      shieldCheckmarkOutline,
      searchOutline,
      starOutline,
      star,
      helpCircleOutline,
      trashOutline,
      saveOutline,
      cubeOutline,
      pricetagOutline,
      businessOutline,
      listOutline,
      refreshOutline
    });
  }
}
