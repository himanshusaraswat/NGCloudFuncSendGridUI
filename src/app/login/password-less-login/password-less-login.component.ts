import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { emailPattern, validationMessagesExistingEmail, EmailMissing } from '../../core/constants/emailLoginHelpers';
import { tap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'src/app/core/unsubscribe-on-destroy-adapter';

type ExistingUserFields = 'existingEmail';
type ExistingFormErrors = { [u in ExistingUserFields]: string };

@Component({
  selector: 'app-password-less-login',
  templateUrl: './password-less-login.component.html',
  styleUrls: ['./password-less-login.component.scss']
})

export class PasswordLessLoginComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public loading: boolean;
  userRole: string = null;
  user: Observable<any>;
  setTrue: boolean;
  existingUserForm: FormGroup;
  allowedEmailPattern = emailPattern;
  isEmailMissingInfo: EmailMissing;

  existingFormErrors: ExistingFormErrors = {
    existingEmail: ''
  };
  validationMessages = {
    existingEmail: {
      ...validationMessagesExistingEmail
    }

  };

  subscription: any;
  isUserFound: any;

  constructor(private fb: FormBuilder, public auth: AuthService, public afAuth: AngularFireAuth) {
    super();
    this.subs.sink = this.auth.isEmailFoundStatus
      .pipe(
        tap((message: EmailMissing) => { this.isEmailMissingInfo = message; console.log(message); })
      ).subscribe();
  }

  ngOnInit() {
    this.buildSignInForm();
  }

async login() {
    this.auth.setLoadingState(true);
    window.scroll(0, 0);
    if (this.existingUserForm.value.existingEmail !== null) {
      const email = this.existingUserForm.value.existingEmail.toLowerCase();
      if (this.isEmailMissingInfo && this.isEmailMissingInfo.emailMissing) {
        await this.auth.getEmailAndSignIn(email, this.isEmailMissingInfo.url);
      } else {
        await this.auth.sendEmail(email);
      }
      // Disable the form here & show the loading spinner
      this.existingUserForm.reset();
    }
  }

logout() {
    this.auth.setLoadingState(true);
    return this.auth.signOut;
  }

buildSignInForm() {
    this.existingUserForm = this.fb.group({
      existingEmail: ['', [
        Validators.required,
        Validators.pattern(this.allowedEmailPattern)
      ]]
    });

    this.subs.sink = this.existingUserForm.valueChanges.subscribe((data) => this.onExistingValueChanged(data));
    this.onExistingValueChanged(); // reset validation messages
  }

onExistingValueChanged(data ?: any) {
    if (!this.existingUserForm) { return; }
    const form = this.existingUserForm;
    for (const field in this.existingFormErrors) {
      if (Object.prototype.hasOwnProperty.call(this.existingFormErrors, field) && (field === 'existingEmail')) {
        // clear previous error message (if any)
        this.existingFormErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.existingFormErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
