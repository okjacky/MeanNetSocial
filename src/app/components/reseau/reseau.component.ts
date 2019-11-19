import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthenticationService, UserService} from '../../services';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {current} from 'codelyzer/util/syntaxKind';
import {Role} from '../../models';
import {DialogMdpOublieComponent} from '../user/mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-reseau',
  templateUrl: './reseau.component.html',
  styleUrls: ['./reseau.component.scss']
})
export class ReseauComponent implements OnInit {
  currentUser: User;
  userFromApi: User[];
  userFromSearch: User[] = [];
  isAdmin: Boolean;

  searchForm: FormGroup;
  itemResults: User[] = [];
  invitationRequest: any;


  constructor( private userService: UserService,
               private authenticationService: AuthenticationService,
               private fb: FormBuilder,
               private router: Router,
               private dialog: MatDialog) {
    this.authenticationService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (this.currentUser.role === Role.Admin) {
        this.isAdmin = true;
      }
    });

  }
  ngOnInit() {
    this.searchForm = this.fb.group({
      textSearch: new FormControl('', Validators.required)
    });

    console.log('home:', this.currentUser.request);
    this.userService.getAll()
      .pipe(first()).subscribe(users => {
        this.userFromApi = users;
      // users.forEach((user => {this.userFromApi.push(user); }));
      // this.userFromApi.push(user);
    });
  }

  searchItem() {
    if (this.searchForm.valid) {
      const obj = this.searchForm.value;
      this.userService.searchItem(obj)
        .pipe(first()).subscribe((items) => {
        if (items.length === 0) {
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error : 'Résultat de la recherche ',
              msg: 'oupss... nous avons 0 résultat'
            }
          });
        }
        this.userFromSearch = items;
      });
      if (this.searchForm.value === '') {
        this.userFromSearch = [];
      }
    }
  }

  acceptRequest(invitation) {
    console.log('this.invitationRequest$$', invitation._id);
    const request = {
      acceptRequest: {
        senderId: this.currentUser._id,
        receiverId: invitation.userId,
      }
    };
    this.userService.connexionRequest(request)
      .pipe(first()).subscribe((user) => {
        if (user) {
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error : 'C\'est Bon !',
              msg: invitation.userNom + ' est votre ami pour la vie ...'
            }
          });
          this.authenticationService.updateCurrentUser(user);
          this.ngOnInit();
        }
    });

  }

  deleteRequest(invitation) {
    console.log('this.invitationRequest$$', invitation._id);
    const request = {
      deleteRequest: {
        senderId: this.currentUser._id,
        receiverId: invitation.userId,
      }
    };
    this.userService.connexionRequest(request)
      .pipe(first()).subscribe((user) => {
      if (user) {
        this.dialog.open(DialogMdpOublieComponent, {
          height: '300px',
          width: '400px',
          data: {
            error : 'es tu sûre ?',
            msg: 'Trop tard, je l\'ai déjà rejecté ! Je suis triste pour ' + invitation.userNom
          }
        });
        this.authenticationService.updateCurrentUser(user);
        this.ngOnInit();
      }
    });

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
