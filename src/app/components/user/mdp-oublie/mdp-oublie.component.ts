import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService, UserService} from '../../../services';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-mdp-oublie',
  templateUrl: './mdp-oublie.component.html',
  styleUrls: ['./mdp-oublie.component.scss']
})
export class MdpOublieComponent implements OnInit {
  constructor(
    public userService: UserService,
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

  retourLogin() {
    this.router.navigate(['/login']);
  }

  searchEmail() {
    // TODO: API find
    const ek = this.userService.mdpoublieForm.value;
    this.userService.getEmail(ek)
      .pipe(first())
      .subscribe((email) => {
        if (email) {
          console.log('rere', email);
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error : 'Nous vérifions qu\'il s\'agit bien de vous',
              msg: 'Nous avons envoyé un lien d\'activation par e-mail sur ' + email.email
            }
          });
          this.router.navigate(['/home']);
        }
      });
  }
}

@Component({
  selector: 'app-mdpoublie-dialog',
  templateUrl: 'dialog-mdpOublie.dialog.html'
})
export class DialogMdpOublieComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DialogMdpOublieComponent>) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
