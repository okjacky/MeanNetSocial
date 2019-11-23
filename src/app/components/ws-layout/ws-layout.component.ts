import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Chat} from '../../models/chat';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../../services/chat.service';
import {AuthenticationService} from '../../services';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {DialogMdpOublieComponent} from '../user/mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';
import {Role} from '../../models';

@Component({
  selector: 'app-ws-layout',
  templateUrl: './ws-layout.component.html',
  styleUrls: ['./ws-layout.component.scss']
})
export class WsLayoutComponent implements OnInit, OnDestroy {

  replyMessageForm: FormGroup;
  subscription: Subscription[] = [];
  currentUser: User;
  userOnline: User[];
  messageList: Chat[] = [];
  userList: Array<any>;
  showActive: boolean;
  username: string;
  chatWith: string;
  currentOnline: boolean;
  receiveMessageObs: any;
  receiveActiveObs: any;
  noMsg: boolean;
  noUserOnline: Boolean;
  conversationId: string;
  notify: boolean;
  notification: any = { timeout: null };
  constructor(private router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              public el: ElementRef,
              private chatService: ChatService,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.replyMessageForm = this.fb.group({
      author: new FormControl(''),
      authorId: new FormControl(''),
      created: new FormControl(''),
      image: new FormControl(''),
      conversationId: new FormControl(''),
      body: new FormControl('', Validators.required),
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.chatWith = params.get('chatWith');
    });

    this.getMessages(this.chatWith);
    this.connectToChat();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  connectToChat(): void {
    const connected = this.chatService.isConnected();
    if (connected === true) {
      this.initReceivers();
    } else {
      this.chatService.connect(
        this.currentUser.nom,
        () => {
          this.initReceivers();
        }
      );
    }
  }

  initReceivers(): void {
    this.getUserList();
    this.subscription.push(this.chatService.receiveMessage()
      .subscribe(message => {
        this.checkMine(message);
        if (message.conversationId === this.conversationId) {
          this.noMsg = false;
          this.messageList.push(message);
          this.scrollToBottom();
          // this.msgSound();
        } else if (message.mine !== true) {
          if (this.notification.timeout) {
            clearTimeout(this.notification.timeout);
          }
          this.notification = {
            from: message.from,
            inChatRoom: message.inChatRoom,
            text: message.text,
            timeout: setTimeout(() => {
              this.notify = false;
            }, 4000),
          };
          this.notify = true;
          // this.notifSound();
        }
      }));

  }

  getUserList(): void {
    this.subscription.push(this.chatService
      .receiveActiveList()
      .pipe(first()).subscribe((activesUsers) => {
        console.log('activesUsers', activesUsers);
        if (activesUsers) {
          for (let i = 0; i < activesUsers.length; i++) {
            if (activesUsers[i].nom === this.currentUser.nom) {
              activesUsers.splice(i, 1);
              this.userOnline = activesUsers;
              if (activesUsers.length === 0) {
                this.noUserOnline = true;
              } else {
                this.noUserOnline = false;
              }
            }
          }
        } else {
          this.onNewConv('chat-room');
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
  getMessages(name: string): void {
    this.subscription.push(this.chatService.getOneConversationByName(this.currentUser.nom, name)
      .pipe(first()).subscribe((data) => {
        if (data.success === true) {
          console.log('getMessage ', data);
          this.conversationId = data.conversation._id || data.conversation._doc._id;
          const messages = data.messages || null;
          if (messages && messages.length > 0) {
            for (const message of messages) {
              this.checkMine(message);
            }
            this.noMsg = false;
            this.messageList = messages;
            this.scrollToBottom();
          } else {
            this.noMsg = true;
            this.messageList = [];
          }
        } else {
          this.onNewConv('chat-room');
        }
      }));
  }
  onNewConv (username: string ) {
    if (this.chatWith !== username) {
      this.router.navigate(['/chat', username]);
      this.getMessages(username);
    } else {
      this.getMessages(username);
    }
  }

  replyMessage() {
    this.replyMessageForm.get('author').setValue(this.currentUser.nom);
    this.replyMessageForm.get('authorId').setValue(this.currentUser._id);
    this.replyMessageForm.get('image').setValue(this.currentUser.image);
    this.replyMessageForm.get('conversationId').setValue(this.conversationId);
    if (this.replyMessageForm.valid) {
      console.log('this.chatWith', this.chatWith);
      this.chatService.sendMessage(this.replyMessageForm.value, this.chatWith);
      this.replyMessageForm.reset();
    }
  }

  checkMine(message: Chat): void {
    if (message.author === this.currentUser.nom) {
      message.mine = true;
    }
  }

  scrollToBottom(): void {
    const element: any = this.el.nativeElement.querySelector('.msg-container');
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  }
}
