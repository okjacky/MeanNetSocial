import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, UserService} from '../../services';
import {User} from '../../models/user';
import {Role} from '../../models';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
})
export class UserLayoutComponent implements OnInit {
  isAddUser: Boolean;
  isDetailsUser: Boolean;
  isMdpOublie: Boolean;
  isEditUser: Boolean;
  isArticle: Boolean;
  currentUser: User;
  tokenUser: User;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    if (this.router.url.includes('addUser')) {
      this.isAddUser = true;
      this.isDetailsUser = false;
      this.isMdpOublie = false;
      this.isEditUser = false;
      this.isArticle = false;
    } else if (this.router.url.includes('detailsUser')) {
      this.isAddUser = false;
      this.isDetailsUser = true;
      this.isMdpOublie = false;
      this.isEditUser = false;
      this.isArticle = false;
    } else if (this.router.url.includes('mdpOublie')) {
      this.isAddUser = false;
      this.isDetailsUser = false;
      this.isMdpOublie = true;
      this.isEditUser = false;
      this.isArticle = false;
    } else if (this.router.url.includes('editUser')) {
      this.isAddUser = false;
      this.isDetailsUser = false;
      this.isMdpOublie = false;
      this.isEditUser = true;
      this.isArticle = false;
    } else if (this.router.url.includes('article')) {
      this.isAddUser = false;
      this.isDetailsUser = false;
      this.isMdpOublie = false;
      this.isEditUser = false;
      this.isArticle = true;
    }
  }


  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

}
