import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../models/user';
import {Message} from '../../../models/message';
import {Conversation} from '../../../models/conversation';
import {AuthenticationService, UserService} from '../../../services';
import {MessageService} from '../../../services/message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {first} from 'rxjs/operators';
import {DialogMdpOublieComponent} from '../../user/mdp-oublie/mdp-oublie.component';
import {Role} from '../../../models';

@Component({
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.scss']
})
export class ListMessageComponent implements OnInit {

  @Input() currentUser$;
  @Output() oninitOutput: EventEmitter<string> = new EventEmitter<string>();

  searchForm: FormGroup;
  userFromSearch: User[] = [];
  conversationsList: Message[] = [];
  public conversationSalectedId: Conversation;

  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
    this.searchForm = this.fb.group({
      textSearch: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.messageService.getAllConversations(this.currentUser$._id)
      .pipe(first()).subscribe((messages) => {
      this.conversationsList = Object.values(messages);
      console.log('conversationList', this.conversationsList);
    });
  }

  searchItem() {
    if (this.searchForm.valid) {
      console.log(typeof(this.searchForm.value));
      const obj = this.searchForm.value;
      this.userService.searchItem(obj)
        .pipe(first()).subscribe((items) => {
        console.log('searchItem', items, items.length);
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

  get isAdmin() {
    return this.currentUser$ && this.currentUser$.role === Role.Admin;
  }

  displayConversationId(convId) {
    // this.oninitOutput.emit(convId);
  }

}
