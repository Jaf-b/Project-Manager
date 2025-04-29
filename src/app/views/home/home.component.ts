import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { APP_NAME } from '../../constant';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../core/services/firebase/authentication.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-home',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
  ],
  template: `
    <mat-toolbar>
      <div>
        <button mat-icon-button (click)="drawer.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>{{ title }}</span>
      </div>
      <div>
        <button mat-icon-button>
          <mat-icon class="mat-18">notifications</mat-icon>
        </button>
        <img
          [matMenuTriggerFor]="menuRef"
          width="35px"
          height="35px"
          [src]="User() ? User()?.photoURL : 'assets/img/avatar.png'"
          alt=""
        />
      </div>
    </mat-toolbar>
    <mat-divider />
    <mat-menu #menuRef="matMenu">
      <button mat-menu-item>
        <mat-icon class="">logout</mat-icon>
        Deconnexion
      </button>
    </mat-menu>

    <mat-drawer-container>
      <mat-drawer #drawer mode="over">
        <a
          mat-menu-item
          routerLink="/home/acceuil"
          routerLinkActive="router-link-active"
        >
          <mat-icon class="mat-18">home</mat-icon>
          Home
        </a>
      </mat-drawer>
      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: `
  mat-toolbar{
    align-items:center;
    justify-content:space-between;
    div{
      display:flex;
      justify-content:center;
      align-items:center;
      gap:1rem;
    }
  }
  img{
    object-fit:cover;
    border-radius:100%;
  }
  mat-divider{
    color:var(--mat-sys-outline)
  }
  mat-icon,img{
    cursor:pointer;
  }
  mat-drawer-container {
      height: calc(100vh - 65px);
      display: flex;
      flex-direction: column;
    }
  mat-drawer{
    width:250px;
    border-right: 1px solid var(--mat-sys-outline-variant);
    border-radius:0px;
  }
  .router-link-active{
    background-color: var(--mat-sys-outline-variant);
  }
  `,
})
export default class HomeComponent {
  title = APP_NAME;
  AuthService = inject(AuthenticationService);
  User = toSignal(this.AuthService.user);
}
