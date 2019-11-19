import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services';
import {first} from 'rxjs/operators';
import {ErrorStateMatcher, MatDialog} from '@angular/material';
import {DialogMdpOublieComponent} from '../user/mdp-oublie/mdp-oublie.component';
import {ChatService} from '../../services/chat.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  returnUrl: string;
  matcher = new MyErrorStateMatcher();
  constructor(
    public userService: UserService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/detailsUser']);
    }
  }
  ngOnInit() {
  }
  // convenience getter for easy access to form fields
  // get f() { return this.loginForm.controls; }

  onSubmit() {
    const loginData = this.userService.loginForm.value;
    // stop here if form is invalid
    if (this.userService.loginForm.valid) {
      this.authenticationService.login(loginData)
        .pipe(first())
        .subscribe(
          data => {
            if (data) {
               const wsUser = {nom: data.nom, image: data.image, userId: data._id};
              // socketIo emit user Online
              this.chatService.connect(wsUser);
              this.router.navigate(['detailsUser']);
            } else {
              this.dialog.open(DialogMdpOublieComponent, {
                height: '300px',
                width: '400px',
                data: {
                  error: 'Login Failed',
                  msg: 'email ou mot de passe incorrect !'
                }
              });
              this.router.navigate(['login']);
            }
          },
          error => {
            console.log('login error: ', error);
          });
      this.userService.loginForm.reset();
    }
  }
}
