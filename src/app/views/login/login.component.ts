import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { APP_NAME } from '../../constant';
import { AuthenticationService } from '../../core/services/firebase/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  template: `
    <div class="container">
      <mat-card appearance="outlined">
        <mat-card-header style="margin-bottom: 1.5rem;">
          <mat-card-title>
            <span style="font-size:28px">{{ appname }}</span>
          </mat-card-title>
          <mat-card-subtitle
            ><span style="font-size:14px"
              >gerer vos projet facilement et en un clic</span
            ></mat-card-subtitle
          >
        </mat-card-header>
        @if(emailSet()){
        <mat-card-content style="padding: 2rem;">
          <span
            ><b>l'email à été envoyé à l'adresse {{ emailSet() }}</b></span
          ><br />
          <br />
          <button mat-button (click)="resetState()">
            email non reçus ? cliquez ici
          </button>
        </mat-card-content>
        } @else{
        <mat-card-content>
          <form #EmailForm="ngForm" (ngSubmit)="emailFormSubmit(EmailForm)">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input
                ngModel
                #emails="ngModel"
                required
                email
                placeholder="ex:jafred@gmail.com"
                type="email"
                name="email"
                matInput
              />
            </mat-form-field>
            <button
              [disabled]="EmailForm.invalid"
              type="submit"
              style="height:50px"
              mat-flat-button
            >
              Connectez-vous avec Email
            </button>
          </form>
          <div
            style="display: flex;gap:0.5rem;justify-content:center;align-items:center;margin:1rem"
          >
            <mat-divider />
            Or
            <mat-divider />
          </div>
          <button
            (click)="loginWithGoogle()"
            style="text-align: center;"
            mat-stroked-button
          >
            <mat-icon svgIcon="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            </mat-icon>
            Se connecter avec Google
          </button>
        </mat-card-content>
        }
      </mat-card>
    </div>
  `,
  styles: `
      mat-card{
        width:22rem;
        padding:1rem;
        margin-top:1rem;
      }
      mat-card-content,form{
        display:flex;
        flex-direction:column;
        gap:0.5rem;
      }
      button{
        border-radius:5px;
      }
      mat-divider{
        width:50%;
        height:1px;
        box-shadow:none;
      }
      .container{
        display:flex;
        justify-content:center;
        align-items:center;
      }
  `,
})
export default class LoginComponent {
  appname = APP_NAME;
  router = inject(Router);
  auth = inject(AuthenticationService);
  isAuthenticated = toSignal(this.auth.authsTate);
  snackBar = inject(MatSnackBar);
  emailSet = signal('');
  loginWithGoogle = async () => {
    try {
      await this.auth
        .loginWithgoogle()
        .then((e) => this.router.navigate(['/home/acceuil']));
    } catch (e) {
      this.snackBar.open("Une erreur s'est produite", 'fermer', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }
  };
  emailFormSubmit(form: NgForm) {
    const email = form.value.email;
    this.emailSet.set(email);
    const ActionCodeSettings = {
      url: `${location.origin}${this.router.url}`,
      handleCodeInApp: true,
    };
    this.auth.sendAuthLink(email, ActionCodeSettings);
    localStorage.setItem('emailForSignIn', email);

    form.reset();
  }
  resetState = () => this.emailSet.set('');

  ngOnInit(): void {
    const isAuthenticatedWithEmail = this.router.url.includes('?apiKey=');
    if (isAuthenticatedWithEmail) return this.auth.LoginWithEmailLink();
    if (this.isAuthenticated()) {
      this.router.navigate(['/home/acceuil']);
    }
  }
}
