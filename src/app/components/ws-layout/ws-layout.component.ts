import {Component, ElementRef, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Chat} from '../../models/chat';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ChatService} from '../../services/chat.service';
import {AuthenticationService} from '../../services';

@Component({
  selector: 'app-ws-layout',
  templateUrl: './ws-layout.component.html',
  styleUrls: ['./ws-layout.component.scss']
})
export class WsLayoutComponent implements OnInit {

  currentUser: User;
  userOnline: User[];
  // messageList: Chat[];
  userList: Array<any>;
  showActive: boolean;
  sendForm: FormGroup;
  username: string;
  chatWith: string;
  currentOnline: boolean;
  receiveMessageObs: any;
  receiveActiveObs: any;
  noMsg: boolean;
  conversationId: string;
  notify: boolean;
  notification: any = { timeout: null };
  constructor(private router: Router,
              public route: ActivatedRoute,
              public formBuilder: FormBuilder,
              public el: ElementRef,
              private chatService: ChatService,
              private authenticationService: AuthenticationService,
              ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }
  /**
  getMessages(name: string): void {
    this.chatService.getConversation(this.currentUser, name).subscribe(data => {
      if (data.success == true) {
        this.conversationId =
          data.conversation._id || data.conversation._doc._id;
        let messages = data.conversation.messages || null;
        if (messages && messages.length > 0) {
          for (let message of messages) {
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
    });
  }

  onNewConv(username: string) {
    if (this.chatWith !== username) {
      this.router.navigate(['/chat', username]);
      this.getMessages(username);
    } else {
      this.getMessages(username);
    }
    this.currentOnline = this.checkOnline(username);
    this.showActive = false;
  }
**/
}
