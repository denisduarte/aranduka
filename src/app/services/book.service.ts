import { Injectable, EventEmitter } from "@angular/core";
import { throwError, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

import { UserService } from './user.service';

import { Book, Comment, BookList } from "../models/book.model";
import { WishlistEntry } from "../models/user.model";

import { UserResponse, UpdateUserResponseData } from  '../api.interfaces';

// Set the http options
const httpOptions = {
  params: null,
  headers: new HttpHeaders({ "Content-Type": "application/json",
                             "Access-Control-Allow-Origin": "*,Origin, X-Requested-With, Content-Type, Accept" })
};

@Injectable({
  providedIn: 'root'
})

export class BookService {

  urlList = "http://localhost:5000/api/books/";
  urlAdd = "http://localhost:5000/api/books/add";
  urlFetch = "http://localhost:5000/api/book/";
  urlUpdate = "http://localhost:5000/api/book/";
  urlTags = "http://localhost:5000/api/tags/";
  urlAddComment = "http://localhost:5000/api/book/comment/add";
  urlGetComment = "http://localhost:5000/api/book/comments";
  urlDeleteComments = "http://localhost:5000/api/book/comment/remove/"

  urlCheckAvailable = "http://localhost:5000/api/book/available"

  urlBorrowBook = "http://localhost:5000/api/book/borrow"
  urlReturnBook = "http://localhost:5000/api/book/return"
  urlRenewBook = "http://localhost:5000/api/book/renew"

  urlAddToWishList = "http://localhost:5000/api/book/wish"
  urlRemoveFromWishList = "http://localhost:5000/api/book/unwish"

  urlEnterWaitingList = "http://localhost:5000/api/book/wait"
  urlLeaveWaitingList = "http://localhost:5000/api/book/unwait"


  totalBooks: number = 0;
  bookList = new BehaviorSubject<Book[]>([]);
  book = new BehaviorSubject<Book>(null);

  constructor(private http: HttpClient,
              private userService: UserService) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error("An error occurred:", error.error.message);
    } else {
      // Backend error
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(error);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public getBookList(search: string, tag: string[],
                    page: number, booksPerPage:number,
                    appendResults:boolean, sortField: string,
                    sortDirection: number): void {


                      //console.log(this.getBookList.caller);

    let params = new HttpParams();

    params = params.append('page', page.toString());
    params = params.append('booksPerPage', booksPerPage.toString());
    params = params.append('sortField', sortField);
    params = params.append('sortDirection', sortDirection.toString());

    if (search)
      params = params.append('search', search);
    if (tag)
      params = params.append('tag', JSON.stringify(tag));

    httpOptions.params = params

    this.http.get<BookList>(this.urlList, httpOptions)
             .subscribe(
                data => {
                  if (!appendResults)
                    this.bookList.next([]);

                  this.bookList.next(this.bookList.value.concat(data.books));
                  this.totalBooks = data.total.count;
                },
                err => {
                  console.log(err);
                }
            );
  }

  public getBookListByTag(searchInput: string, tag: string): Observable<any> {
    return this.http.get(this.urlList + searchInput + "/" + tag, httpOptions)
                    .pipe(map(this.extractData),
                          catchError(this.handleError)
                    );
  }

  public fetchBook(bookID: number): Observable<any> {
      return this.http.get<Book>(this.urlFetch + bookID, httpOptions)
                      .pipe(catchError(this.handleError),
                            tap(resData => {
                              this.book.next(resData);
                            })
                      );
  }

  public addBook(book: Book): Observable<any> {

    return this.http.post<Book>(this.urlAdd, book, httpOptions)
                    .pipe(catchError(this.handleError)
    );
  }

  public getAllTags(): Observable<any> {
    return this.http.get(this.urlTags, httpOptions)
                    .pipe(
                        map(this.extractData),
                        catchError(this.handleError)
                    );
  }

  addBookToWishlist(bookID: number): Observable<any> {
      let params = new HttpParams();
      params = params.append('bookID', bookID.toString());
      params = params.append('userID', this.userService.user.value._id.toString());

      httpOptions.params = params;

      return this.http.get<Book>(this.urlAddToWishList, httpOptions);
  }

  removeBookFromWishlist(bookID: number): Observable<any> {
      let params = new HttpParams();
      params = params.append('bookID', bookID.toString());
      params = params.append('userID', this.userService.user.value._id.toString());

      httpOptions.params = params;

      return this.http.get<Book>(this.urlRemoveFromWishList, httpOptions)
  }

  isBookInWishList(bookID: number): boolean {

    var bookIDs = this.userService.user.value.wishlist.map(entry => entry._id);

    //console.log(bookIDs);

    return (bookIDs.indexOf(bookID) > -1) ? true : false;
  }

  public addComment(comment: Comment) {
    comment.BookId = this.book.value._id
    comment.UserId = this.userService.user.value._id;

     this.http
      .post<Comment>(this.urlAddComment, comment, httpOptions)
      .subscribe(comment => {
                        this.book.value.Comments.unshift(comment);
                        console.log('mmm', this.book.value.Comments);

                        this.book.next(this.book.value);
                      },
                      errorMessage => {
                        console.log(errorMessage);
                      }
      );
  }

  private updateBookData() {
    return this.http
      .patch<Book>(this.urlUpdate + this.book.value._id, this.book.value, httpOptions)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          console.log(resData);
        })
      );
  }

  public getComments(page: number, commentsPerPage: number) {

    let userObs: Observable<any>;


    userObs = this.http.post(this.urlGetComment,
                            { bookID: this.book.value._id,
                              page: page,
                              docsPerPage: commentsPerPage
                            },
                            httpOptions)
                      .pipe(
                        catchError(this.handleError),
                        tap()
      );

    userObs.subscribe(
      resData => {
        this.book.value.Comments = this.book.value.Comments.concat(resData);
      },
      errorMessage => {
        console.log(errorMessage);
      }
    );

  }

   public removeComment(commentID:string): Observable<any> {
     console.log('remove2');

     return this.http.delete(this.urlDeleteComments + commentID, httpOptions)
  }


  public borrowBook(bookID: number): Observable<any> {

console.log('bookID', bookID);
console.log('this.userService.user.value', this.userService.user.value);


    let params = new HttpParams();
    params = params.append('bookID', bookID.toString());
    params = params.append('userID', this.userService.user.value._id.toString());

    httpOptions.params = params;

    return this.http.get<Book>(this.urlBorrowBook, httpOptions)
                    .pipe(
                      catchError(this.handleError),
                      tap(book => {
                        /*console.log('borrowed book', book);

                        let user = this.userService.user.value;
                        user.borrowing.push(book);
                        //this.userService.user.next(user);*/
                      })
                    )
  }

  public returnBook(bookID: number): boolean {
    let params = new HttpParams();

    params = params.append('bookID', bookID.toString());
    params = params.append('userID', this.userService.user.value._id.toString());

    httpOptions.params = params;

    this.http.get<Book>(this.urlReturnBook, httpOptions)
                    .pipe(
                      catchError(this.handleError),
                      tap(resData => {

                        let user = this.userService.user.value;
                      })
                    )
                    .subscribe();

    return true;
  }

  public renewBook(bookID: number): Observable<any> {
    let params = new HttpParams();

    params = params.append('bookID', bookID.toString());
    params = params.append('userID', this.userService.user.value._id.toString());

    httpOptions.params = params;

    return this.http.get(this.urlRenewBook, httpOptions)
                    .pipe(
                      catchError(this.handleError),
                      tap(resData => {
                        /*console.log('borrowed book', resData);

                        let user = this.userService.user.value;
                        user.borrowed.push(resData);

                        this.userService.user.next(user);*/
                      })
                    );

  }


  public enterWaitingList(bookID: number): Observable<any> {
    let params = new HttpParams();

    params = params.append('bookID', bookID.toString());
    params = params.append('userID', this.userService.user.value._id.toString());

    httpOptions.params = params;

    return this.http.get<Book>(this.urlEnterWaitingList, httpOptions);
  }


    public leaveWaitingList(bookID: number): Observable<any> {
      let params = new HttpParams();

      params = params.append('bookID', bookID.toString());
      params = params.append('userID', this.userService.user.value._id.toString());

      httpOptions.params = params;

      return this.http.get<Book>(this.urlLeaveWaitingList, httpOptions);
    }

  isBookBorrowed(bookID: number): boolean {
    var bookIDs = this.userService.user.value.borrowing.map(entry => entry._id);

    return (bookIDs.indexOf(bookID) > -1) ? true : false;
  }
}
