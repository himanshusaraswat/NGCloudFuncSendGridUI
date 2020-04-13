import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
@Component({
  selector: 'app-notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent {
  constructor(public snackBarRef: MatSnackBarRef<NotificationMessageComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
