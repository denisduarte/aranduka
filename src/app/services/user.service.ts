import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap, flatMap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

import { Book } from '../models/book.model';
import { User, WishlistEntry } from '../models/user.model';
import { UserResponse, UpdateUserResponseData } from  '../api.interfaces';

// Set the http options
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json",
                             "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
};

const URL_login = "http://localhost:5000/api/users/login";
const URL_logout = "http://localhost:5000/api/users/me/logout";
const URL_updateUser = "http://localhost:5000/api/users/update";
const URL_getComments = "http://localhost:5000/api/users/comments";
const URL_AddUser = "http://localhost:5000/api/users/add";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient,
              private router: Router,
              private idle: Idle) {}

  autologin() {
    let authObs: Observable<any>;
    this.login('den.duarte@gmail.com', 'senha').subscribe();
  }

  login(email: string, password: string) {

    return this.http
      .post<UserResponse>(URL_login, { email: email, password: password})
      .pipe(
        catchError(this.handleError),
        tap(response => {

          response.user._token = response.token;
          const user = new User(response.user);

          this.user.next(user);

          this.idle.setIdle(120);
          this.idle.setTimeout(30);
          this.idle.watch();
        })
      );
  }

  logout() {

    this.idle.stop();

    const token = this.user.value.token;

    this.user.next(null);

    const httpOptions = {
      headers: new HttpHeaders({"Authorization": "Bearer " + token })
    };

    return this.http.post(URL_logout, {}, httpOptions)
                    .pipe(catchError(this.handleError)
    );
  }

  public addUser(user: User): Observable<any> {

    return this.http.post<User>(URL_AddUser, user, httpOptions)
                    .pipe(catchError(this.handleError)
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error) {
      case 'INVALID_CREDENTIALS':
        errorMessage = 'Credenciais inválidas';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'O endereço de e-mail informado não existe.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Senha inválida.';
        break;
      case 'DUPLICATED_MAIL':
        errorMessage = 'O endereço de e-mail informado já está cadastrado.';
        break;
    }
    return throwError(errorMessage);
  }

  updateUserData() {

    return this.http
      .post<UpdateUserResponseData>(URL_updateUser,
          {
            _id: this.user.value._id,
            name: this.user.value.name,
            email: this.user.value.email,
            acceptMailling: this.user.value.acceptMailling,
            wishlist: this.user.value.wishlist
          })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.user.next(this.user.value);
        })
      );
  }

  public getComments(): Observable<Comment[]> {
    return this.http.post<Comment[]>(URL_getComments,
                                      { userID: this.user.value._id },
                                      httpOptions);
 }

 isUserWaitingBook(bookID: number): boolean {

   //console.log('waittt', this.user.value.waiting);

   var bookIDs = this.user.value.waiting.map(entry => entry._id);
   return (bookIDs.indexOf(bookID) > -1) ? true : false;
 }



}
