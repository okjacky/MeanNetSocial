import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/user';
import {first} from 'rxjs/operators';
import {DialogMdpOublieComponent} from '../mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-changer-mdp',
  templateUrl: './changer-mdp.component.html',
  styleUrls: ['./changer-mdp.component.scss']
})
export class ChangerMdpComponent implements OnInit {

  nouveauMdpForm: FormGroup;
  token: string;
  tokenUser: User;

  @Output() outputNouveauMdp: EventEmitter<string> = new EventEmitter<string>();
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private userService: UserService) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.userService.confirmationToken(this.token)
        .pipe(first()).subscribe((user) => {
        if (user) {
          this.tokenUser = user;
          console.log('ngtokenuser', this.tokenUser);
        }
      });
    }
    this.nouveauMdpForm = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmerPassword: new FormControl('', Validators.required)},
      {validator: this.checkPassword('password', 'confirmerPassword')}
    );
  }

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.checkPassword) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ checkPassword: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  public envoyerNouveauMdp() {
    if (this.nouveauMdpForm.valid) {
      this.tokenUser.password =  this.nouveauMdpForm.get('password').value;
      console.log('this.nvxpp', this.tokenUser);
      this.userService.updateUser(this.tokenUser._id,  this.tokenUser)
        .pipe(first()).subscribe((msg) => {
          if (msg) {
            this.dialog.open(DialogMdpOublieComponent, {
              height: '300px',
              width: '400px',
              data: {
                error : 'C\'est Bon !',
                msg: 'Mise à jour réussi ...'
              }
            });
            this.router.navigate(['login']);
          }
      });
    }
    this.nouveauMdpForm.reset();
  }
}
