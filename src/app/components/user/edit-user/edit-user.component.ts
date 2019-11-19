import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService, UserService} from '../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/user';
import {FormGroup} from '@angular/forms';
import {Role} from '../../../models';
import {first} from 'rxjs/operators';
import {SnackBarAddUserComponent} from '../add-user/add-user.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DialogMdpOublieComponent} from '../mdp-oublie/mdp-oublie.component';
import { Location } from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  title = 'Modifier votre profil';
  currentUser: User;
  memberId: string;
  memberUser: User;
  editForm: FormGroup;
  isAdmin: Boolean;
  avatarFile: any;
  isAvatarFile: Boolean = false;
  error: string;
  subscription: Subscription[] = [];

  constructor(private userService: UserService,
              private dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.subscription.push(this.userService.getById(this.memberId)
      .pipe(first()).subscribe(member => {
      this.memberUser = member;
        this.editForm.get('genre').setValue(member.genre);
        this.editForm.get('prenom').setValue(member.prenom);
        this.editForm.get('nom').setValue(member.nom);
        this.editForm.get('email').setValue(member.email);
        this.editForm.get('pseudo').setValue(member.pseudo);
        this.editForm.get('adresse').setValue(member.adresse);
        this.editForm.get('age').setValue(member.age);
        this.editForm.get('presentation').setValue(member.presentation);
        this.editForm.get('preferences').setValue(member.preferences);
        this.editForm.get('role').setValue(member.role);
    }));
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser.role === Role.Admin) {
      this.isAdmin = true;
    }
    if (this.currentUser.role === Role.Admin) {
      this.isAdmin = true;
    }
  }

  ngOnInit() {
    console.log('memberUser:', this.memberUser);
    this.editForm = this.userService.editForm;
    // console.log(this.currentUser);

  }

  uploadImage(event) {
    if (event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
      this.editForm.get('image').setValue(this.avatarFile);
      this.isAvatarFile = true;
    }
  }
  updateAvatar () {
    const formData = new FormData();
    formData.append('avatar', this.avatarFile);
    this.userService.updateAvatar(this.memberUser._id, formData)
      .subscribe(
        updateSuccess => {
          if (updateSuccess !== undefined) {
            console.log('updateSuccess', updateSuccess);
            this.authenticationService.updateCurrentUser(updateSuccess);
            this.router.navigate(['/detailsUser']);
          }
          },
        (err) => console.log('updateSuccess error', err),
      );
  }
  goBack () {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/login']);
    }
  }
  onSummit () {
    const userUpdateData: User = this.editForm.value;
    if (this.editForm.valid) {
      this.userService.updateUser(this.memberUser._id, userUpdateData)
        .pipe(first()).subscribe(updateSuccess => {
        if (updateSuccess) {
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error : 'C\'est Bon !',
              msg: 'Mise à jour réussi ...'
            }
          });
          if (this.currentUser._id === this.memberUser._id) {
            this.authenticationService.updateCurrentUser(updateSuccess);
            this.router.navigate(['/home']);
          }
          this.router.navigate(['/home']);
        }
      });
    }
  }
}
