import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { AvatarModule } from 'ngx-avatar';
import {GetConversationComponent} from './get-conversation/get-conversation.component';
import {NewChatComponent} from './reply-conversation/new-chat.component';
import { NewConversationComponent } from './new-conversation/new-conversation.component';
import {MessageLayoutComponent} from './message-layout.component';
import {MessageService} from '../../services/message.service';
import { ListMessageComponent } from './list-message/list-message.component';
import { ChatWithComponent } from './chat-with/chat-with.component';


@NgModule({
  declarations: [
    MessageLayoutComponent,
    GetConversationComponent,
    NewChatComponent,
    NewConversationComponent,
    ListMessageComponent,
    ChatWithComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AvatarModule
  ],
  exports: [

  ],
  providers: [
    MessageService,
    UserService
  ],
  entryComponents: [
  ]
})
export class MessageModule { }
