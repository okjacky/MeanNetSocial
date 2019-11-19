import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {UserLayoutComponent} from './components/user/user-layout.component';
import {Role} from './models';
import {AdminComponent} from './components/admin/admin.component';
import {AuthGuard} from './guards';
import {HomeComponent} from './components/home/home.component';
import {EditUserComponent} from './components/user/edit-user/edit-user.component';
import {ReseauComponent} from './components/reseau/reseau.component';
import {ProfilComponent} from './components/profil/profil.component';
import {ChangerMdpComponent} from './components/user/changer-mdp/changer-mdp.component';
import {MessageLayoutComponent} from './components/message/message-layout.component';
import {GetConversationComponent} from './components/message/get-conversation/get-conversation.component';
import {WsLayoutComponent} from './components/ws-layout/ws-layout.component';

const routes: Routes = [
  // Admin && User && public
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'addUser', component: UserLayoutComponent},
  {path: 'mdpOublie', component: UserLayoutComponent},
  {path: 'changermdp/:token', component: ChangerMdpComponent},

  // accès User && Admin
  {path: 'detailsUser', component: UserLayoutComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'profil/:id', component: ProfilComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'editUser/:id', component: EditUserComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'reseau', component: ReseauComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'message', component: MessageLayoutComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'getConversation/:conversationId/:sender', component: MessageLayoutComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'newConversation', component: MessageLayoutComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'chat/:conversationId/:chatWith', component: MessageLayoutComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  {path: 'newChat/:chatWith/:userId', component: MessageLayoutComponent, canActivate: [AuthGuard],
    data: { roles: [Role.User, Role.Admin] }},
  { path: 'wsChat', canActivate: [AuthGuard], children: [
      { path: ':chatWith', component: WsLayoutComponent },
      { path: '**', redirectTo: '/wsChat/chatRoom', pathMatch: 'full' }
    ] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  // home && general
  {path: 'home', component: HomeComponent},
  // otherwise redirect to home
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
