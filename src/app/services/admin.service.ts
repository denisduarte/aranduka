import { environment } from '../../environments/environment';

import { Injectable, EventEmitter } from "@angular/core";
import { throwError, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

import { User } from "../models/user.model";
import { Book } from "../models/book.model";

import { UserService } from './user.service';

// Set the http options
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json",
                             "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
};

const APIEndpoint = environment.APIEndpoint;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  urlLendings = APIEndpoint + "/api/admin/lendings"
  urlReturnBook = APIEndpoint + "/api/admin/return"
  urlListUsers = APIEndpoint + "/api/admin/users"
  urlSetAdmin = APIEndpoint + "/api/admin/set"

  constructor(private http: HttpClient,
              private userService: UserService) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public getLendings(): Observable<any> {
    return this.http.get(this.urlLendings)
                    .pipe(map(this.extractData)
                    );
  }


  public returnBook(bookID: string): boolean {
    let params = new HttpParams();

    params = params.append('bookID', bookID);

    const par = {
      params: params,
      headers: new HttpHeaders({ "Content-Type": "application/json",
                                 "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
    };

    this.http.get<Book>(this.urlReturnBook, par)
             .subscribe(resData => {

               let user = this.userService.user.value;

               const index = user.borrowing.findIndex(book => book._id == resData._id);

               if (index > -1) {
                  user.borrowing.splice(index, 1);
               }

               this.userService.user.next(user);
             });

    return true;
  }



    public listUsers(letter: string): Observable<any> {
      let params = new HttpParams();

      if (letter)
        params = params.append('letter', letter);

      const par = {
        params: params,
        headers: new HttpHeaders({ "Content-Type": "application/json",
                                   "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
      };

      return this.http.get<User[]>(this.urlListUsers, par);
    }

    public setAdministrator(userID: number, isAdmin: boolean) {

      let params = new HttpParams();

      params = params.append('userID', userID.toString());
      params = params.append('isAdmin', isAdmin.toString());

      const par = {
        params: params,
        headers: new HttpHeaders({ "Content-Type": "application/json",
                                   "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
      };

      return this.http.get<boolean>(this.urlSetAdmin, par);
    }


}
