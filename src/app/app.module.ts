import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfilComponent } from './components/profil/profil.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {UserModule} from './components/user/user.module';
import {AuthenticationService} from './services';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import {ErrorInterceptor} from './shared/error.interceptor';
import { AvatarModule } from 'ngx-avatar';
import { ReseauComponent } from './components/reseau/reseau.component';
import { MessageModule } from './components/message/message.module';
import { WsOnlineComponent } from './components/ws-online/ws-online.component';
import { WsChatComponent } from './components/ws-chat/ws-chat.component';
import { WsLayoutComponent } from './components/ws-layout/ws-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProfilComponent,
    LoginComponent,
    AdminComponent,
    HomeComponent,
    ReseauComponent,
    WsOnlineComponent,
    WsChatComponent,
    WsLayoutComponent,
  ],
  imports: [
    AppRoutingModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserModule,
    MessageModule,
    AvatarModule
  ],
  providers: [
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
