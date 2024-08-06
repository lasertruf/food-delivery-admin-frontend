import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyASAXhmxL_6okwdjpu_qoExuxFhdRPrSik",
  authDomain: "food-delivery-app-admin.firebaseapp.com",
  projectId: "food-delivery-app-admin",
  storageBucket: "food-delivery-app-admin.appspot.com",
  messagingSenderId: "222902932405",
  appId: "1:222902932405:web:6a1e4cf34e8149d024bffc"
};


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ]
};
