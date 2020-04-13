import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationMessageComponent } from '../ui-elements/notification-message/notification-message.component';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private durationInSeconds = 5;
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}
  openSnackBar(message, action) {
    this.zone.run(() => {
      this.snackBar.openFromComponent(NotificationMessageComponent, {
        data: {
          _message: message,
          _action: action
        },
        duration: this.durationInSeconds * 1000,
      });
    });
  }
}
