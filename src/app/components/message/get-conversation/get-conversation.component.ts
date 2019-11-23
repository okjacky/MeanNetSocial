import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Message} from '../../../models/message';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MessageService} from '../../../services/message.service';
import {User} from '../../../models/user';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-get-conversation',
  templateUrl: './get-conversation.component.html',
  styleUrls: ['./get-conversation.component.scss']
})
export class GetConversationComponent implements OnInit {

  replyMessageForm: FormGroup;
  conversationId: string;
  sender: string;
  messagesList: Message[] = [];
  time: string;

  @Input() currentUser$: User;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private fb: FormBuilder,
              private el: ElementRef,
              private dialog: MatDialog,
              ) {
    this.replyMessageForm = this.fb.group({
      sender: new FormControl(''),
      content: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    // this.conversationId = this.route.snapshot.paramMap.get('conversationId');
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.conversationId = params.get('conversationId');
      this.sender = params.get('sender');
      this.messageService.getOneConversation(this.conversationId)
        .pipe(first()).subscribe((messages) => {
        this.messagesList = Object.values(messages);
        this.scrollToBottom();
        console.log( 'messagesList', this.messagesList);
      });
    });
  }

  replyMessage() {
    this.replyMessageForm.get('sender').setValue(this.currentUser$._id);
    if (this.replyMessageForm.valid) {
      console.log(this.replyMessageForm.value);
      this.messageService.sendReply(this.conversationId, this.replyMessageForm.value)
      .pipe(first()).subscribe((success) => console.log('success', success));
    }
    this.replyMessageForm.reset();
    this.ngOnInit();
  }

  scrollToBottom(): void {
    const element: any = this.el.nativeElement.querySelector('.msg-container');
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  }
  /**updateFromNow(): void {
    this.time = moment(this.message.created).fromNow();
  }**/
}
