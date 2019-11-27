import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthenticationService, UserService} from '../../services';
import {first} from 'rxjs/operators';
import {Role} from '../../models';
import {Subscription} from 'rxjs';
import {WasteService} from '../../services/waste.service';
import {Waste} from '../../models/waste';
import * as moment from 'moment';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit, OnDestroy {

  memberId: string;
  member: User;
  currentUser: User;
  isAdmin: Boolean;
  mesAmis: User[];
  wasteList: Waste[];
  subscription: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private wasteService: WasteService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser.role === Role.Admin) {
      this.isAdmin = true;
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.memberId = params.get('id');
      this.userService.getById(this.memberId)
        .pipe(first()).subscribe(member => {
          this.member = member ;
        });
    });


    this.userService.getAll()
      .pipe(first()).subscribe((users) => {
      this.mesAmis = users;
      console.log('mesAmis', this.mesAmis);
      // users.forEach((user => {this.mesAmis.push(user); }));
    });
    this.getAllUserWaste();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  getAllUserWaste() {
    this.subscription.push(this.wasteService.getAllUserWaste(this.memberId)
      .pipe(first()).subscribe(wastes => {
        this.wasteList = wastes.content;
        console.log('getAllUserWaste', this.wasteList);
      }));
  }


  onClickLike(wasteId) {
    const articleRequest = {like: 1, userId: this.currentUser._id, userNom: this.currentUser.nom, wasteId: wasteId};
    this.wasteService.newWaste(articleRequest)
      .pipe(first()).subscribe(newWaste => {});
    this.ngOnInit();
  }

  updateFromNow(date: Date) {
    return moment(date).fromNow();
  }
}
