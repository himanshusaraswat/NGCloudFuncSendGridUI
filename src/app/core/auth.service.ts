import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { first } from 'rxjs/operators';
import { emailPattern, sendEmail, EmailMissing } from './constants/emailLoginHelpers';
import { signOutMsgs } from './constants/signOutMsgs';
import { SnackbarService } from './snackbar.service';
interface Error {
  code: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private triggerLoading = new BehaviorSubject < boolean > (false);
  isLoading = this.triggerLoading.asObservable();

  private isLoggedIn = new BehaviorSubject < any > (null);
  isUserFound = this.isLoggedIn.asObservable();

  private isEmailMissing = new BehaviorSubject <EmailMissing > (null);
  isEmailFoundStatus = this.isEmailMissing.asObservable();

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private snackBarService: SnackbarService) {

    this.setLoadingState(true);
    this.check();
  }
  async check() {
    const isLoggedIn = await this.getUserLogInStatus();
    if (!isLoggedIn) {
      await this.confirmSignIn(location.href);
    }
    // User is already signed-in, no need to check the url
    this.setLoadingState(false);
  }
  async getUserLogInStatus(): Promise < boolean > {
    const user = await this.getUser();
    const loggedIn = !!user;

    if (!loggedIn) {
      console.log('User data not found');
    } else {
      this.setLoggedInState({
        isLoggedIn: true,
        displayName: user.displayName,
        uid: user.uid,
        email: user.email
      });
    }
    return loggedIn;
  }

  setLoggedInState(state: any) {
    this.isLoggedIn.next(state);
  }

  getUser(): Promise < any > {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  private async getIdToken() {
    return await this.afAuth.auth.currentUser.getIdTokenResult(true);
  }

  getIdTokenObservable(): Observable < any > {
    return from(this.getIdToken());
  }

  setLoadingState(isLoading: boolean) {
    this.triggerLoading.next(isLoading);
  }

  setIsEmailFoundStatus(emailMissing: EmailMissing) {
    this.isEmailMissing.next(emailMissing);
  }
  validateEmail = (email) => {
    return emailPattern.test(String(email).toLowerCase());
  }

  async sendEmail(email: string) {
    const actionCodeSettings = {
      url: environment.redirectURL,
      handleCodeInApp: true
    };

    try {
      await this.afAuth.auth.sendSignInLinkToEmail(
        email,
        actionCodeSettings
      );
      window.localStorage.setItem('emailForSignIn', email);
      this.snackBarService.openSnackBar(sendEmail.welcome, 'welcome');
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoadingState(false);
    }
  }
  setStateAndEmail(result) {
    window.localStorage.removeItem('emailForSignIn');
    this.setLoggedInState({
      isLoggedIn: true,
      uid: result.user.uid,
      email: result.user.email
    });
    // Set the user email for future use
    window.localStorage.setItem('email', result.user.email);
    this.router.navigate(['./send-email']);
  }

  async confirmSignIn(receivedUrl) {
    try {
      // Confirm the link is a sign-in with email link.
      const isSignInWithEmailLink = await this.afAuth.auth.isSignInWithEmailLink(receivedUrl);
      if (isSignInWithEmailLink) {
        const email = window.localStorage.getItem('emailForSignIn');
        // If missing email, prompt user for it
        if (!email) {
          // let UI New handle this
          console.log('No Email Found');
          this.setIsEmailFoundStatus({
            emailMissing: true,
            url: receivedUrl
          });
        } else {
          // Have an email in local storage
          const result = await this.afAuth.auth.signInWithEmailLink(email, receivedUrl);
          this.setStateAndEmail(result);
        }
      }
    } catch (error) {
      console.log('caught error');
      this.signOut(signOutMsgs.emailLinkError, error.code);
      // this.setLoadingState(false);
    }
  }

  async getEmailAndSignIn(email: string, url: string) {
    // Sign in user and remove the email localStorage
    try {
      const result = await this.afAuth.auth.signInWithEmailLink(email, url);
      this.setStateAndEmail(result);
    } catch (error) {
      console.log('caught error in getEmailAndSignIn');
      // Allow user to enter email to get new link
      this.setIsEmailFoundStatus({
        emailMissing: false,
        url: null
      });
      this.signOut(signOutMsgs.emailLinkError, error.code);
    } finally {
      this.setLoadingState(false);
    }
  }
  // If error, console log and notify user
  private handleError(error: Error) {
    this.snackBarService.openSnackBar(error.message, 'error');
  }

  signOut(isAuthenticated ? , errorCode ? ) {
    this.afAuth.auth.signOut().then(() => {
      this.setLoggedInState(null);
      window.localStorage.clear();
      switch (isAuthenticated) {
        case signOutMsgs.emailLinkError:
          console.log(errorCode);
          this.snackBarService.openSnackBar(signOutMsgs.emailLinkError, 'error');
          this.router.navigate(['/']);
          break;
        default:
          this.snackBarService.openSnackBar(signOutMsgs.signOut, 'success');
          this.router.navigate(['/']);
      }
    });
  }

}
