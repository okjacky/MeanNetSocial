import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, UserService} from '../../../services';
import {User} from '../../../models/user';
import {first} from 'rxjs/operators';
import {Role} from '../../../models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogMdpOublieComponent} from '../mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss']
})
export class DetailsUserComponent implements OnInit {
  @Input() currentUser: User;

  articleForm: FormGroup;
  mesAmis: User[];

  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private dialog: MatDialog,
              ) {}
  ngOnInit() {
    this.articleForm = this.fb.group({
      titre: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      article: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });

    this.userService.getAll()
      .pipe(first()).subscribe((users) => {
        this.mesAmis = users;
      // users.forEach((user => {this.mesAmis.push(user); }));
    });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  modifier() {
    this.router.navigate(['editUser']);
  }

  publierArticle () {
    if (this.articleForm.valid) {
      console.log('articles', this.articleForm.value);
    }
  }

  deleteUser(user) {
    const userId = user._id;
    this.userService.deleteUser(userId)
      .pipe(first()).subscribe((success) => {
      if (success) {
        this.dialog.open(DialogMdpOublieComponent, {
          height: '300px',
          width: '400px',
          data: {
            error: 'Bonjour  ' + this.currentUser.nom,
            msg: 'L\'utilisateur: ' + user.nom + ' est supprimé !'
          }
        });
        this.ngOnInit();
      }
    });
  }
}
