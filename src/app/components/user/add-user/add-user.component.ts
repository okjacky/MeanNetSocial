import {Component, Inject, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../../../models/user';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {FormGroup, Validators, FormBuilder, FormControl, AbstractControl} from '@angular/forms';
import {AuthenticationService} from '../../../services';
import {Observable} from 'rxjs';
import {Role} from '../../../models';

const httpOption = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  signupFormValid: FormGroup;
  isAdmin: Boolean;

  currentUser: User;

  constructor(
    private _snackBar: MatSnackBar,
    public userService: UserService,
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.currentUser = this.authenticationService.currentUserValue;
      console.log('gfgfg:', this.currentUser);
      if (this.currentUser.role === Role.Admin) {
        this.isAdmin = true;
      }

      this.router.navigate(['/detailsUser']);
    }
  }
    ngOnInit() {
      this.signupFormValid = this.userService.form;
      this.signupFormValid.get('role').setValue('User');
      this.signupFormValid.get('genre').setValue('Monsieur');

  }

  onClear() {
    this.userService.form.reset();
    this.router.navigate(['/login']);
  }
  onSumit() {
    const userData: User = this.userService.form.value;
    if (this.userService.form.valid) {
      this.userService.addUser(userData)
        .pipe(first()).subscribe(isEmailUnique => {
          if (isEmailUnique) {
            if (isEmailUnique.email) {
              this._snackBar.openFromComponent(SnackBarAddUserComponent, {
                duration: 8000,
                data: {msg: 'Email "' + isEmailUnique.email + '" existe déjà !'}
              });
            } else {
              this._snackBar.openFromComponent(SnackBarAddUserComponent, {
                duration: 10000,
                data: {msg: 'Merci de vérifier votre boite email pour activer votre compte'}
              });
              this.userService.form.reset();
              this.router.navigate(['/home']);
            }
          }
      });
    }
  }
}
@Component({
  selector: 'app-snack-bar-adduser',
  template: '{{ data.msg }}',
})
export class SnackBarAddUserComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
