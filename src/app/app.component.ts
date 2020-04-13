import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './core/auth.service';
import { tap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from './core/unsubscribe-on-destroy-adapter';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends UnsubscribeOnDestroyAdapter {
  title = 'send-emails';
  isLoading = false;
  constructor(public auth: AuthService, public spinner: NgxSpinnerService) {
    super();
    this.subs.sink = this.auth.isLoading
      .pipe(
        tap((message) => {
          this.isLoading = message;
          this.isLoading ? this.spinner.show() : this.spinner.hide();
        })
      ).subscribe();

  }
}
