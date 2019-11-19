import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../models/user';

@Component({
  selector: 'app-ws-online',
  templateUrl: './ws-online.component.html',
  styleUrls: ['./ws-online.component.scss']
})
export class WsOnlineComponent implements OnInit {

  @Input() usersOnline$: User[];
  @Input() current$: string;
  @Output() newConv: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { console.log('userOnline', this.usersOnline$);
  }

  onUserClick(username: string): boolean {
    this.newConv.emit(username);
    return false;
  }

}
