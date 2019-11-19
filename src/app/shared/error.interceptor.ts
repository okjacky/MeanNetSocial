import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import {DialogMdpOublieComponent} from '../components/user/mdp-oublie/mdp-oublie.component';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }
      if ([400].indexOf(err.status) !== -1) {
        this.dialog.open(DialogMdpOublieComponent, {
          height: '300px',
          width: '400px',
          data: {
            error : 'Aïe... ça sent pas bon !',
            msg: 'Email existe déjà ou Utilisateur inexistant ...'
          }
        });
        //
        const error1 = err.error.message || err.statusText;
        return throwError(error1);
      }
      if ([404].indexOf(err.status) !== -1) {
        this.dialog.open(DialogMdpOublieComponent, {
          height: '300px',
          width: '400px',
          data: {
            error : 'Nous vérifions qu\'il s\'agit bien de vous',
            msg: 'Malheureusement, l\'email n\'est pas valide $$$'
          }
        });
        this.router.navigate(['/']);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
