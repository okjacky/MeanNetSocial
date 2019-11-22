import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../../../models/user';
import {MessageService} from '../../../services/message.service';
import {Message} from '../../../models/message';
import {Subscription} from 'rxjs';
import {ChatService} from '../../../services/chat.service';

@Component({
  selector: 'app-chat-with',
  templateUrl: './chat-with.component.html',
  styleUrls: ['./chat-with.component.scss']
})
export class ChatWithComponent implements OnInit, OnDestroy {

  replyMessageForm: FormGroup;
  chatWith: string;
  conversationId: string;
  messagesList: Message[] = [];
  subscription: Subscription[] = [];
  noMsg: Boolean;
  @Input() currentUser$: User;
  @Input() userOnline: string;
  @Output() newMessgae: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public el: ElementRef,
    private messageService: MessageService,
    private chatService: ChatService,
  ) {
    this.replyMessageForm = this.fb.group({
      author: new FormControl(''),
      conversationId: new FormControl(''),
      content: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.chatWith = params.get('chatWith');
      this.conversationId = params.get('conversationId');
    });

    this.connectToChat();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  connectToChat(): void {
    const connected = this.chatService.isConnected();
    if (connected === true) {
      this.initReceivers();
    } else {
      this.chatService.connect(
        this.currentUser$.nom,
        () => {
          this.initReceivers();
        }
      );
    }
  }

  initReceivers() {
    this.getMessagesList();
    this.subscription.push(this.chatService
      .receiveMessage()
      .pipe(first())
      .subscribe(message => {
        console.log('msg receive:', message);
        // this.checkMine(message);
        if (message.conversationId === this.conversationId) {
          this.noMsg = false;
          this.messagesList.push(message);
          this.scrollToBottom();
          // this.msgSound();
        } /**else if (message.mine != true) {
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
          this.notifSound();
        }**/
      }));
  }

  getMessagesList() {
    this.subscription.push(this.chatService.receiveMessageList()
      .pipe(first()).subscribe(
        (messagesListInit) => {
          console.log('onMessageListe$', messagesListInit);
          if (messagesListInit) {
            messagesListInit.forEach((m) => {
              this.messagesList.push(m);
              this.noMsg = false;
              this.scrollToBottom();

            });
          } else {
            this.noMsg = true;
            this.messagesList = [];
          }
        }
      ));
    this.chatService.getMessage(this.conversationId);
  }
  replyMessage() {
    this.replyMessageForm.get('author').setValue(this.currentUser$._id);
    this.replyMessageForm.get('conversationId').setValue(this.conversationId);
    if (this.replyMessageForm.valid) {
      console.log('this.chatWith', this.chatWith);
      this.chatService.sendMessage(this.replyMessageForm.value, this.chatWith);
      this.replyMessageForm.reset();
    }
  }

  scrollToBottom(): void {
      const element: any = this.el.nativeElement.querySelector('.msg-container');
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  }

}
