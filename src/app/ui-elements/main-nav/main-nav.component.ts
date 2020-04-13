import { Component} from '@angular/core';
import { AuthService } from '../../core/auth.service';
@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  constructor(public auth: AuthService) {}
}

