import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthenticationService, UserService} from '../../services';
import {WasteService} from '../../services/waste.service';
import {MatDialog} from '@angular/material';
import {Role} from '../../models';
import {User} from '../../models/user';
import * as moment from 'moment';
import {Waste} from '../../models/waste';
import {Comment} from '../../models/comment';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  articleForm: FormGroup;
  commentForm: FormGroup;
  wasteList: Waste[] = [];
  wasteNow: Waste;
  commentListe: Comment[];
  subscription: Subscription[] = [];
  showComment: Boolean = true;
  currentUser: User;

  @Input() wasteId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private wasteService: WasteService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.commentForm = this.fb.group({
      body: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      author: new FormControl(''),
    });
  }

  ngOnInit() {

    this.getOneWaste(this.wasteId);
    this.getAllComments(this.wasteId);
  }

  ngOnDestroy() {
    this.subscription.forEach((sub => sub.unsubscribe()));
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  getOneWaste(wasteId): void {
    this.subscription.push(this.wasteService.getOneWaste(wasteId)
      .pipe(first()).subscribe((watse) => {
        this.wasteNow = watse;
        console.log('getOneWaste', this.wasteNow );
      })
    );
  }

  getAllComments(wasteId): void {
    this.subscription.push(this.wasteService.getComment(wasteId)
      .pipe(first()).subscribe(comments => {
        this.commentListe = comments.content;
        console.log('getAllComments', this.commentListe);
      }));
  }

  sendComment(wasteId) {
    this.commentForm.get('author').setValue(this.currentUser._id);
    if (this.commentForm.valid) {
      console.log('sendComment', this.commentForm.value);
      this.wasteService.sendComment(wasteId, this.commentForm.value)
        .pipe(first()).subscribe(newComment => {
          if (newComment.success === true) {
            this.commentForm.reset();
            this.ngOnInit();
          }

      });
    }

  }

  onClickComment(articleId) {
    console.log('onClickComment');
    if (this.showComment === false) {
      this.showComment = true;
    } else {this.showComment = false; }

  }
  updateFromNow(date: Date) {
    return moment(date).fromNow();
  }
}
