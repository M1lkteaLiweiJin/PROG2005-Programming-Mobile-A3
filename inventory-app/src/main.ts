/**
 * main.ts - Application entry point
 * Bootstraps the standalone AppComponent with Ionic, HTTP client and routing.
 * Author: Kangzhe Zhao
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch((err: unknown) => console.error(err));
