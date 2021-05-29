import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../../models/user.model';
import { LendingEntry } from '../../../models/book.model';

import { UserService } from '../../../services/user.service';

import { BookService } from "../../../services/book.service";

@Component({
  selector: 'app-lendings',
  templateUrl: './user-lendings.component.html',
  styleUrls: ['./user-lendings.component.css']
})
export class UserLendingsComponent implements OnInit {

  private userSubscription: Subscription;
  public user: User;
  public borrowing: LendingEntry[] = [];

  constructor(private userService: UserService,
              private bookService: BookService) { }

  ngOnInit(): void {

    this.userSubscription = this.userService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadLendinglist();
      }
    });
  }

  loadLendinglist() {
    this.borrowing = [];
    for (let lendingEntry of this.user.borrowing) {
      this.bookService.fetchBook(lendingEntry._id)
                      .subscribe(
                          book => {
                            lendingEntry.book = book;

                            this.borrowing.push(lendingEntry);
                          },
                          err => {
                            console.log(err);
                          }
                      );
    }
  }

  onReturnBook(bookID: number): boolean {

    this.bookService.returnBook(bookID);

    const index = this.borrowing.findIndex(entry => entry._id == bookID);
    if (index > -1) {
       this.borrowing.splice(index, 1);
    }

    this.userService.user.value.borrowing.findIndex(entry => entry._id == bookID);
    if (index > -1) {
       this.userService.user.value.borrowing.splice(index, 1);
    }
    this.userService.user.next(this.userService.user.value);

    return true;
  }

}
