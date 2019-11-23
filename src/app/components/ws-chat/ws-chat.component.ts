import {Component, Input, OnInit} from '@angular/core';
import {Message} from '../../models/message';
import * as moment from 'moment';
import {Chat} from '../../models/chat';

@Component({
  selector: 'app-ws-chat',
  templateUrl: './ws-chat.component.html',
  styleUrls: ['./ws-chat.component.scss']
})
export class WsChatComponent implements OnInit {

  @Input() message: any;
  time: string;
  fadeTime: boolean;
  messageAuthor: string;


  constructor() { }

  ngOnInit() {
    console.log('onit msg', this.message);
    setTimeout(() => {this.updateFromNow(); this.fadeTime = true; }, 2000);
    setInterval(() => {this.updateFromNow(); }, 60000);
    if (this.message.author.nom) {
      this.messageAuthor = this.message.author.nom;
    } else { this.messageAuthor = this.message.author; }
  }

  updateFromNow(): void {
    this.time = moment(this.message.author.createdAt).fromNow();
  }
}
