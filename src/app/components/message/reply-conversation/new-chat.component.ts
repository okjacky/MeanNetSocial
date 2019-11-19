import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Role} from '../../../models';
import {User} from '../../../models/user';
import {AuthenticationService} from '../../../services';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {MessageService} from '../../../services/message.service';
import {Message} from '../../../models/message';
import {Observable, Subscription} from 'rxjs';
import {ChatService} from '../../../services/chat.service';

@Component({
  selector: 'app-new-chat-conversation',
  templateUrl: './new-chat.component.html'
})
export class NewChatComponent implements OnInit, OnDestroy {

  // currentUser: User;
  chatWith: string;
  chatWithId: string;
  chatMessageForm: FormGroup;
  subscription: Subscription [] = [];
  messagesList: Message[] = [];

  @Input() currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private chatService: ChatService,
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.chatWith = params.get('chatWith');
      this.chatWithId = params.get('userId');
    });
  }

  ngOnInit() {
    this.chatMessageForm = this.fb.group({
      participants: new FormControl(''),
      content: new FormControl('', Validators.required),
      author: new FormControl(''),
    });
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  onNewConversation() {
    const participants = [this.currentUser._id, this.chatWithId];

    if (this.chatMessageForm.valid) {
      this.chatMessageForm.get('participants').setValue(participants);
      this.chatMessageForm.get('author').setValue(this.currentUser._id);
      this.subscription.push(this.messageService.newConversation(this.chatMessageForm.value)
        .pipe(first()).subscribe((success) => {
          console.log('success', success);
          this.router.navigate(['/chat', success.conversationId, this.chatWith]);
        }));
      this.chatMessageForm.reset();
    }
  }

}
