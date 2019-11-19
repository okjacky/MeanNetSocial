import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {AuthenticationService, UserService} from '../../services';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Time} from '@angular/common';
import {DialogMdpOublieComponent} from '../user/mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';
import {Role} from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  userFromApi: User[];
  isLoading: Boolean = true;

  constructor( private userService: UserService,
               private authenticationService: AuthenticationService,
               private router: Router,
               private dialog: MatDialog) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit() {
    /**const a = new Date(this.currentUser.date);
    const aTime = a.getTime();
    const bTimeNow  = new Date().getTime();
    const cdif = bTimeNow - aTime;
    const timedepuis = new Date(cdif).getDate();
    console.log('home:', cdif);
    console.log('timedepuis:', timedepuis);**/
    this.userService.getAll()
      .pipe(first()).subscribe(users => {
      this.isLoading = false;
      this.userFromApi = users;
      });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  friendRequest(receiver) {
    const request = {
      senderId: this.currentUser._id,
      receiver: { receiverId: receiver._id, receiverNom: receiver.nom, image: receiver.image},
    };
    this.userService.connexionRequest(request)
      .pipe(first()).subscribe((success) => {
        if (success) {
          console.log('home', receiver);
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error: 'Bonjour  ' + this.currentUser.nom,
              msg: 'Votre demande de connexion est envoyé à ' + receiver.nom
            }
          });
        }
        console.log('resquestConnexion', success);
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
