import { inject, Injectable, signal } from '@angular/core';
import { Auth, authState, user } from '@angular/fire/auth';
import {
  signInWithPopup,
  GoogleAuthProvider,
  ActionCodeSettings,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private auth = inject(Auth);
  authsTate = authState(this.auth);
  user = user(this.auth);
  IsAdmin = signal(false);

  loginWithgoogle = () => signInWithPopup(this.auth, new GoogleAuthProvider());
  sendAuthLink(email: string, acs: ActionCodeSettings) {
    return sendSignInLinkToEmail(this.auth, email, acs);
  }
  LoginWithEmailLink() {
    if (isSignInWithEmailLink(this.auth, location.href)) {
      let email = localStorage.getItem('emailForSignIn');
      if (!email) {
        email = prompt('veuillez fournir votre e-mail pour la confirmation');
      }
      signInWithEmailLink(this.auth, email!, location.href);
    }
  }

  logout = () => signOut(this.auth);
}
