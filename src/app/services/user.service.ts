import { Injectable } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient,
              private fb: FormBuilder) {}
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  mdpoublieForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  form: FormGroup = this.fb.group({
    pseudo: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    adresse: new FormControl(''),
    age: new FormControl(''),
    genre: new FormControl(''),
    image: new FormControl(''),
    presentation: new FormControl(''),
    preferences: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmerPassword: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required)},
    {validator: this.checkPassword('password', 'confirmerPassword')}
    );
  editForm: FormGroup = this.fb.group({
      pseudo: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      adresse: new FormControl(''),
      age: new FormControl(''),
      genre: new FormControl(''),
      image: new FormControl(''),
      presentation: new FormControl('', Validators.required),
      preferences: new FormControl(''),
      role: new FormControl('', Validators.required)
  });

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.checkPassword) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ checkPassword: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  initializeFormGroup() {
    this.form.setValue({
      pseudo: '',
      prenom: '',
      nom: '',
      email: '',
      address: '',
      age: '',
      genre: '1',
      presentation: '',
      preferences: ''
    });
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`/api/users`);
  }

  getEmail(emailCheck: string) {
    console.log('ngus', emailCheck);
    return this.http.post<User>('/api/users/getEmail', emailCheck, httpOptions);
  }
  getById(id: string) {
    return this.http.get<User>(`/api/users/${id}`);
  }

  getAmis(arrayAmis): Observable<User[]> {
    return this.http.post<User[]>(`/api/users/getAmis`, arrayAmis, httpOptions);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users/signup', user, httpOptions);
  }

  confirmationToken (token): Observable<User> {
    return this.http.get<User>(`/api/users/confirmation/${token}`);
  }

  updateUser(id: string, user: User) {
    return this.http.put<User>(`/api/users/${id}`, user, httpOptions);
  }

  updateAvatar(id: string, avatar: any) {
    return this.http.post(`/api/users/${id}/avatar`, avatar, {
      reportProgress: true,
      observe: 'events',
    }).pipe(map((event) => {
      console.log('evanttype', event, event.type);
      switch (event.type) {
        case HttpEventType.Response:
          console.log('😺 Done!', event.body);
          return event.body;
      }
    }));
  }

  searchItem(item: Observable<User>) {
    return this.http.post<User[]>('/api/users/recherche', item, httpOptions);
  }

  deleteUser(userId: string) {
    return this.http.delete(`/api/users/${userId}`, httpOptions);
  }

  connexionRequest(request) {
    return this.http.post<Boolean>('/api/users/connexionRequest', request, httpOptions);
  }
}

