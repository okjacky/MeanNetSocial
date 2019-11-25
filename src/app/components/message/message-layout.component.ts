import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Role} from '../../models';
import {User} from '../../models/user';
import {AuthenticationService, UserService} from '../../services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {DialogMdpOublieComponent} from '../user/mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';
import {MessageService} from '../../services/message.service';
import {Message} from '../../models/message';
import {Conversation} from '../../models/conversation';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ChatService} from '../../services/chat.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message-layout.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageLayoutComponent implements OnInit, OnDestroy {

  isGetConversation: Boolean;
  isNewConversation: Boolean;
  isNewChat: Boolean;
  isChatWith: Boolean;
  currentUser: User;

  searchForm: FormGroup;
  conversationsList: any;
  subscription: Subscription[] = [];

  // webSocket Io
  userOnline: any;
  userFromApi: User[];
  messageList: Message[];
  showActive: boolean;
  sendForm: FormGroup;
  chatWith: string;
  currentOnline: boolean;
  receiveMessageObs: any;
  receiveActiveObs: any;
  noMsg: boolean;
  noUserOnline: Boolean;
  conversationId: string;
  notify: boolean;
  notification: any = { timeout: null };

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.searchForm = this.fb.group({
      textSearch: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    if (this.router.url.includes('getConversation')) {
      this.isGetConversation = true;
      this.isNewConversation = false;
      this.isChatWith = false;
      this.isNewChat = false;
    } else if (this.router.url.includes('newConversation')) {
      this.isGetConversation = false;
      this.isNewConversation = true;
      this.isChatWith = false;
      this.isNewChat = false;
    } else if (this.router.url.includes('chat')) {
      this.isGetConversation = false;
      this.isNewConversation = false;
      this.isChatWith = true;
      this.isNewChat = false;
    } else if (this.router.url.includes('newChat')) {
      this.isGetConversation = false;
      this.isNewConversation = false;
      this.isChatWith = false;
      this.isNewChat = true;
    }
    this.connectToChat();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  // WebSocket io
  connectToChat(): void {
    const connected = this.chatService.isConnected();
    if (connected === true) {
      console.log('chat connected');
      this.getUserList();
      this.getConversationList();
    } else {
      console.log('chat not connected');
      this.chatService.connect(
        this.currentUser.nom,
        () => {
          this.getUserList();
          this.getConversationList();
        }
      );
    }
  }

  getConversationList(): void {
    this.subscription.push(this.chatService.receiveConversationList()
      .pipe(first()).subscribe((conversationList) => {
        if (conversationList) {
          this.conversationsList = conversationList;
          this.noMsg = false;
        } else {
          this.noMsg = false;
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error : 'webSocket Bot vous informe: ',
              msg: 'Pas de Conversation pour le moment ...'
            }
          });
        }
    }));
    this.chatService.getConversationList(this.currentUser._id);
  }

  getUserList(): void {
    this.subscription.push(this.chatService
      .receiveActiveList()
      .pipe(first()).subscribe((activesUsers) => {
        if (activesUsers) {
          console.log('activesUsers1', activesUsers);
          this.userOnline = activesUsers;
          /**for (let i = 0; i < activesUsers.length; i++) {
            if (activesUsers[i].nom === this.currentUser.nom) {
              activesUsers.splice(i, 1);
              this.userOnline = activesUsers;
              console.log('userOnline', this.userOnline);
              if (activesUsers.length === 0) {
                this.noUserOnline = true;
              } else {
                this.noUserOnline = false;
              }
            }
          }**/
        } else {
          this.noUserOnline = true;
          this.dialog.open(DialogMdpOublieComponent, {
            height: '300px',
            width: '400px',
            data: {
              error : 'webSocket Bot vous informe: ',
              msg: 'Pas d\'utilisateur connecté ...'
            }
          });
        }
    }));
    this.chatService.getActiveList();
  }

  deleteConversation(convId) {
    const conversationData = {
      conversationId: convId,
      userId: this.currentUser._id,
    };
    this.chatService.deleteConversation(conversationData)
      .pipe(first()).subscribe((success) => {
      if (success) {
        this.dialog.open(DialogMdpOublieComponent, {
          height: '300px',
          width: '400px',
          data: {
            error: 'C\'est Bon !',
            msg: 'la conversation est supprimée ...'
          }
        });
        this.chatService.getConversationList(this.currentUser._id);
        // this.router.navigate(['/message']);
      }
    });
  }
  compareByUsername(a, b): number {
    if (a.nom < b.nom) {
      return -1;
    }
    if (a.nom > b.nom) {
      return 1;
    }
    return 0;
  }
}
