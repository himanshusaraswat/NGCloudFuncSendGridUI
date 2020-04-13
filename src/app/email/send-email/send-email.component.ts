import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { AuthService } from 'src/app/core/auth.service';
import { SnackbarService } from 'src/app/core/snackbar.service';
import { snackBarMessage } from '../../core/constants/emailLoginHelpers';
@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent {
  invitedRealtor = false;
  constructor(
    private dialog: MatDialog,
    public auth: AuthService,
    private snackBarService: SnackbarService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'send-email-dialog',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data === true && data !== 'close') {
          this.snackBarService.openSnackBar(snackBarMessage.success, 'success');
        } else if (data === null) {
          this.snackBarService.openSnackBar(snackBarMessage.error, 'error');
        }
        this.auth.setLoadingState(false);
      }
    );
  }
}
