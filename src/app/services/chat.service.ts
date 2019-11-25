import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import {Message} from '../models/message';
import {Conversation} from '../models/conversation';
import {UserService} from './user.service';
import {User} from '../models/user';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: any;
  private chatUrl: string = environment.chatUrl;
  private chatPath: string = environment.chatPath ;

  constructor(public authentcationService: AuthenticationService,
              private userService: UserService,
              public http: HttpClient) { }

  connect(username: any, callback: Function = () => {}): void {
    // initialize the connection
    this.socket = io('https://meannetsocial.herokuapp.com/', {path: '/mean-chat-app.io'});

    this.socket.on('error', error => {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    });

    this.socket.on('connect', () => {
      this.sendUser(username);
      console.log('connected to the chat server$$');
      callback();
    });
  }
  isConnected(): boolean {
    if (this.socket != null) {
      return true;
    } else {
      return false;
    }
  }
  sendUser(username: any): void {
    this.socket.emit('username', username);
  }
  disconnect(): void {
    this.socket.disconnect();
  }

  getOneConversationByName(name1: string, name2: string ): Observable<any> {
    let url = '/api/chat/';
    if (name2 !== 'chat-room') {
      const route = `/${name1}/${name2}`;
      url += route;
    }
    return this.http.get<any>(url);

  }

  receiveConversationList() {
    const observable = new Observable(observer => {
      this.socket.on('onConversationList', (data: Message[]) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getConversationList(currentUserId: string): void {
    this.socket.emit('getConversationList', currentUserId);
  }

  deleteConversation(conversationData) {
    this.socket.emit('deleteConversation', conversationData);
    const observable = new Observable(observer => {
      this.socket.on('deleteConversationSuccess', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  sendMessage(message: Message, chatWith: string): void {
    this.socket.emit('message', { message: message, to: chatWith });
  }

  receiveMessage(): any {
    const observable = new Observable(observer => {
      this.socket.on('message', (data: Message) => {
        console.log('CS receive MSG', data);
        observer.next(data);
      });
    });
    return observable;
  }

  getMessage(conversationId: string): void {
    this.socket.emit('getMessage', conversationId);
  }

  receiveMessageList(): any {
    const observable = new Observable(observer => {
      this.socket.on('onGetMessages', (data: Message[]) => {
        observer.next(data);
      });
    });
    return observable;
  }

  receiveActiveList(): any {
    const observable: Observable<User[]> = new Observable(observer => {
      this.socket.on('active', data => {
        observer.next(data);
      });
    });

    return observable;
  }

  getActiveList(): void {
    this.socket.emit('getactive');
  }

  onNewConversation(): any {
    const observable = new Observable(observer => {
      this.socket.on('onNewConversation', (data: Message) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getAllConversations(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`/api/message/${id}`);
  }

  getOneConversation(conversationId: string, ): Observable<Conversation> {
    console.log('ms tS', conversationId);
    return this.http.get<Conversation>(`/api/message/conversation/${conversationId}`);
  }

  sendReply(conversationId: string, message: Message): Observable<Boolean> {
    return this.http.post<Boolean>(`/api/message/${conversationId}`, message, httpOptions);
  }

  newConversation(message: Message): Observable<Boolean> {
    return this.http.post<Boolean>(`/api/message/conversation/new/`, message, httpOptions);
  }


  deleteConversation1(conversationId: string, userId: string): Observable<Boolean> {
    const optionsD = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        conversationId: conversationId,
        userId: userId,
      },
    };
    return this.http.delete<Boolean>(`/api/message/conversation/delete/${conversationId}`, optionsD);
  }
  /**getConversation(name1: string, name2: string): any {
    let url = this.apiUrl;
    if (name2 != 'chat-room') {
      let route = '/' + name1 + '/' + name2;
      url += route;
    }

    let authToken = this.authService.getUserData().token;

    // prepare the request
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: authToken,
    });
    let options = new RequestOptions({ headers: headers });

    // POST
    let observableReq = this.http.get(url, options).map(this.extractData);

    return observableReq;
  }

  getUserList(): any {
    let url = this.usersUrl;

    let authToken = this.authService.getUserData().token;

    // prepare the request
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: authToken,
    });
    let options = new RequestOptions({ headers: headers });

    // POST
    let observableReq = this.http.get(url, options).map(this.extractData);

    return observableReq;
  }

  receiveMessage(): any {
    let observable = new Observable(observer => {
      this.socket.on('message', (data: Message) => {
        observer.next(data);
      });
    });

    return observable;
  }

  receiveActiveList(): any {
    let observable = new Observable(observer => {
      this.socket.on('active', data => {
        observer.next(data);
      });
    });

    return observable;
  }

  sendMessage(message: Message, chatWith: string): void {
    this.socket.emit('message', { message: message, to: chatWith });
  }

  getActiveList(): void {
    this.socket.emit('getactive');
  }

  extractData(res: Response): any {
    let body = res.json();
    return body || {};
  }**/
}
