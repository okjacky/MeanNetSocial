import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService, UserService} from '../../services';
import {first} from 'rxjs/operators';
import {Role} from '../../models';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  memberId: string;
  member: User;
  currentUser: User;
  isAdmin: Boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser.role === Role.Admin) {
      this.isAdmin = true;
    }
  }

  ngOnInit() {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.userService.getById(this.memberId)
      .pipe(first()).subscribe(member => {
      this.member = member ;
    });
    console.log('member', this.member);
    console.log('currenU ', this.currentUser, this.isAdmin);
  }

}
