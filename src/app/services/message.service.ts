import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Conversation} from '../models/conversation';
import {Message} from '../models/message';
import {RequestOptions} from '@angular/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const optionsDelete = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  body: {
    conversationId: 1,
    name: 'test',
  },
};

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllConversations(id: string): Observable<any> {
    return this.http.get<any>(`/api/message/${id}`);
  }

  getOneConversation(conversationId: string, ): Observable<Conversation> {
    return this.http.get<Conversation>(`/api/message/conversation/${conversationId}`);
  }

  sendReply(conversationId: string, message: Message): Observable<Boolean> {
    return this.http.post<Boolean>(`/api/message/${conversationId}`, message, httpOptions);
  }

  newConversation(message: Message): Observable<Message> {
    return this.http.post<Message>(`/api/message/conversation/new`, message, httpOptions);
  }


  deleteConversation(conversationId: string, userId: string): Observable<Boolean> {
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
}
