import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { CommonModule } from '@angular/common';
import {UserLayoutComponent} from './user-layout.component';
import {AddUserComponent} from './add-user/add-user.component';
import {DetailsUserComponent} from './details-user/details-user.component';
import {HttpClientModule} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from '../../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {SnackBarAddUserComponent} from './add-user/add-user.component';
import { MdpOublieComponent } from './mdp-oublie/mdp-oublie.component';
import {DialogMdpOublieComponent} from './mdp-oublie/mdp-oublie.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AvatarModule } from 'ngx-avatar';
import { ChangerMdpComponent } from './changer-mdp/changer-mdp.component';
import { ArticleComponent } from '../article/article.component';

@NgModule({
  declarations: [
    UserLayoutComponent,
    AddUserComponent,
    DetailsUserComponent,
    SnackBarAddUserComponent,
    MdpOublieComponent,
    DialogMdpOublieComponent,
    EditUserComponent,
    ChangerMdpComponent,
    ArticleComponent
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
    UserService,
  ],
  entryComponents: [
    SnackBarAddUserComponent,
    DialogMdpOublieComponent
  ]
})
export class UserModule { }
