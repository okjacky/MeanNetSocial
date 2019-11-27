import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, UserService} from '../../../services';
import {User} from '../../../models/user';
import {first} from 'rxjs/operators';
import {Role} from '../../../models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogMdpOublieComponent} from '../mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';
import {WasteService} from '../../../services/waste.service';
import {Waste} from '../../../models/waste';
import * as moment from 'moment';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss']
})
export class DetailsUserComponent implements OnInit {
  @Input() currentUser: User;

  isArticle: Boolean;
  articleForm: FormGroup;
  commentForm: FormGroup;
  mesAmis: User[];
  wasteList: Waste[];
  wasteId$: string;
  subscription: Subscription[] = [];
  showComment: Boolean = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private wasteService: WasteService,
              private dialog: MatDialog,
              ) {
    if (this.router.url.includes('article')) {
      this.isArticle = true;
    }
  }
  ngOnInit() {
    this.articleForm = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      body: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      author: new FormControl(''),
    });
    this.commentForm = this.fb.group({
      body: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      author: new FormControl(''),
    });

    this.userService.getAll()
      .pipe(first()).subscribe((users) => {
        this.mesAmis = users;
        console.log('mesAmis', this.mesAmis);
      // users.forEach((user => {this.mesAmis.push(user); }));
    });
    this.getAllUserWaste();

  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  getAllUserWaste() {
    this.subscription.push(this.wasteService.getAllUserWaste(this.currentUser._id)
      .pipe(first()).subscribe(wastes => {
        this.wasteList = wastes.content;
        console.log('getAllUserWaste', this.wasteList);
      }));
  }

  publierArticle () {
    if (this.articleForm.valid) {
      this.articleForm.get('author').setValue(this.currentUser._id);
      const articleRequest = {like: 0, data: this.articleForm.value};
      this.wasteService.newWaste(articleRequest)
        .pipe(first()).subscribe(newWaste => {});
      this.articleForm.reset();
      this.ngOnInit();
    }
  }

  getAllComments(wasteId): void {
    this.subscription.push(this.wasteService.getComment(wasteId)
      .pipe(first()).subscribe(comments => {
        return 4;
        console.log('getAllComments', comments);
      }));
  }

  onClickComment(articleId) {
    console.log('onClickComment');
    this.isArticle = true;
    this.wasteId$ = articleId;
    if (this.showComment === false) {
      this.showComment = true;
    } else {this.showComment = false; }

  }
  onClickLike(wasteId) {
    const articleRequest = {like: 1, userId: this.currentUser._id, userNom: this.currentUser.nom, wasteId: wasteId};
    this.wasteService.newWaste(articleRequest)
      .pipe(first()).subscribe(newWaste => {});
    this.ngOnInit();
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

  updateFromNow(date: Date) {
    return moment(date).fromNow();
  }
}
