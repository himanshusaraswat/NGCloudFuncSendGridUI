import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailPattern, onlyAlpha } from '../../core/constants/emailLoginHelpers';
import { SendEmail } from '../../core/models/email.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/core/unsubscribe-on-destroy-adapter';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent extends UnsubscribeOnDestroyAdapter  implements OnInit {
  sendEmail: FormGroup;
  invitedRealtor = false;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef < DialogComponent > ,
    private angularFireFunctions: AngularFireFunctions,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data) {
      super();
      if (!environment.production) {
      this.angularFireFunctions.functions.useFunctionsEmulator('http://localhost:5000');
    }
  }

  ngOnInit() {
    // Build the form
    this.sendEmail = this.formBuilder.group({
      senderName: ['', [
        Validators.required,
        Validators.pattern(onlyAlpha)
      ]],
      recipientName: ['', [
        Validators.required,
        Validators.pattern(onlyAlpha)
      ]],
      to: ['', [
        Validators.required,
        Validators.pattern(emailPattern)
      ]]
    });
  }
  onNoClick(): void {
    this.dialogRef.close('close');
  }
  sendEmailNow = () => {
    this.auth.setLoadingState(true);
    const callable = this.angularFireFunctions.httpsCallable(environment.functionName);
    const emailPayload: SendEmail = {
      delegateEmailDetails: {
        to: this.sendEmail.get('to').value,
        dynamic_template_data: {
          senderName: this.sendEmail.get('senderName').value,
          recipientName: this.sendEmail.get('recipientName').value
        }
      }
    };
    this.subs.sink = callable(emailPayload).pipe(catchError(err => of(null))).subscribe((result: any) => {
      if (result && result.success === true) {
        this.dialogRef.close(result.success);
      } else {
        this.dialogRef.close(null);
      }
    });
  }
}
