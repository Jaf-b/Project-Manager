import { Routes } from '@angular/router';
import { APP_NAME } from './constant';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  {
    title: `${APP_NAME} - login `,
    path: 'login',
    loadComponent: () => import('./views/login/login.component'),
    ...canActivate(redirectToHome),
  },
  {
    title: `${APP_NAME} - Home  `,
    path: 'home',
    loadComponent: () => import('./views/home/home.component'),
    ...canActivate(redirectToLogin),
    children: [
      // parametrage de route enfants pour la gestion de projet
      {
        title: `${APP_NAME} - Home  `,
        path: 'acceuil',
        loadComponent: () =>
          import('./views/home/project-list/project-list.component'),
      },
      //parametrage de la route qui est censé afficher en details le projet et son tableau kanban
      {
        title: '',
        path: 'projet/:id',
        loadComponent: () =>
          import('./views/home/project-details/project-details.component'),
      },
      //Fin du parametrage de la route qui est censé afficher en details le projet et son tableau kanban
      // Fin du parametrage de route enfants pour la gestion de projet

      //redirection des pages enfants
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'acceuil',
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'notfound',
      },
    ],
  },
  {
    title: `${APP_NAME} - 404 `,
    path: 'notfound',
    loadComponent: () => import('./views/not-found/not-found.component'),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'notfound',
  },
];
