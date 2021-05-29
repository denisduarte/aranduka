import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { BookService } from "../../../services/book.service";
import { UserService } from '../../../services/user.service';

import { Book } from '../../../models/book.model';
import { User } from '../../../models/user.model';


@Component({
  selector: 'app-book-entry',
  templateUrl: './book-entry.component.html',
  styleUrls: ['./book-entry.component.css']
})
export class BookEntryComponent implements OnInit {

  //books: Book[]  = [];
  book: Book = null;
  private userSubscription: Subscription;
  public user: User;

  @ViewChild('commentSection', { static: true }) commentSection: ElementRef;


  constructor(public router: Router,
              private route: ActivatedRoute,
              private bookService: BookService,
              private userService: UserService) { }

  ngOnInit(): void {
    let bookID = this.route.snapshot.queryParams.id;

    this.fetchBook(bookID);

    this.userSubscription = this.userService.user.subscribe(user => {
      this.user = user;
    });

    if (this.route.snapshot.fragment === "comments")
      this.scrollToComments();
  }

  fetchBook(bookID: number) {
      this.bookService
        .fetchBook(bookID)
        .subscribe(
          data => {
            this.book = data;
          },
          err => {
            console.log(err);
          }
        );
    }


  onAddToWishist(bookID: number) {
    console.log('this', this);

    console.log('this.bookService', this.bookService);

    this.bookService.addBookToWishlist(bookID);
  }
  onRemoveFromWishist(bookID: number) {
    this.bookService.removeBookFromWishlist(bookID);
  }

  onBorrowBook(bookID: number): boolean {
    var ok = this.bookService.borrowBook(bookID);

    //const index = this.bookList.findIndex(book => book._id == bookID);
    //this.bookList[index].isAvailable = false;

    return true;
  }
  onReturnBook(bookID: number): boolean {
    console.log('return', bookID);
    this.bookService.returnBook(bookID);

    //const index = this.bookList.findIndex(book => book._id == bookID);
    //this.bookList[index].isAvailable = true;

    return true;
  }

  onEnterWaitingList(bookID: number): boolean {
    var ok = this.bookService.enterWaitingList(bookID);
    return true;
  }
  onLeaveWaitingList(bookID: number): boolean {
    var ok = this.bookService.leaveWaitingList(bookID);
    return true;
  }

  isBookInWishList(bookID: number): boolean {
    return this.bookService.isBookInWishList(bookID);
  }

  isBookBorrowed(bookID: number): boolean {
     return this.bookService.isBookBorrowed(bookID);
  }
  isWaitingBook(bookID: number): boolean {
    return this.userService.isUserWaitingBook(bookID);
  }

  scrollToComments() {
    setTimeout(() => {
       const element = document.getElementById('comments');
       element.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

}
