import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'bigjagestionprojet',
        appId: '1:40278070570:web:a7249c7b0a0c18760f7a53',
        storageBucket: 'bigjagestionprojet.firebasestorage.app',
        apiKey: 'AIzaSyBUebD9owrdgJcZl5AjHU-CLIETY2kobI4',
        authDomain: 'bigjagestionprojet.firebaseapp.com',
        messagingSenderId: '40278070570',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    ),
  ],
};
