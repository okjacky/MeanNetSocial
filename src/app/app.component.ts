import { Component, Input } from '@angular/core';
import {User} from './models/user';
import {Role} from './models';
import {Router} from '@angular/router';
import {AuthenticationService} from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'netSocial';
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
    logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
