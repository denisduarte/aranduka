import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../../../models/book.model';
import { BookService } from '../../../services/book.service';

import { User, WishlistEntry } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  private userSubscription: Subscription;
  public user: User;
  public wishlist: WishlistEntry[] = [];

  constructor(private userService: UserService,
              private bookService: BookService) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadWishlist();
      }
    });
  }

  loadWishlist() {
    this.wishlist = [];
    for (let wishlistEntry of this.user.wishlist) {
      this.bookService.fetchBook(wishlistEntry._id)
                      .subscribe(
                          book => {
                            wishlistEntry.book = book;

                            this.wishlist.push(wishlistEntry);
                            this.sortWishlist(this.wishlist);

                            this.userService.user.value.wishlist = this.wishlist;
                          },
                          err => {
                            console.log(err);
                          }
                      );
    }
  }

  onRemoveFromWishist(bookID: number) {
    this.bookService
      .removeBookFromWishlist(bookID)
      .subscribe(returnedBook => {
        let index = this.wishlist.findIndex(entry => entry._id == returnedBook._id);
        if (index > -1) {
           this.wishlist.splice(index, 1);

           this.userService.user.value.wishlist.findIndex(entry => entry._id == returnedBook._id);
           if (index > -1) {
              this.userService.user.value.wishlist.splice(index, 1);
           }
           this.userService.user.next(this.userService.user.value);
        }
     });
     return true;
  }

  ascendingSort( a, b ) {
    if ( a.wishlistEntry.createdAt > b.wishlistEntry.createdAt ){
      return 1;
    }
    if ( a.wishlistEntry.createdAt < b.wishlistEntry.createdAt ){
      return -1;
    }
    return 0;
  }

  sortWishlist(wishlist:WishlistEntry[]) {
    return wishlist.sort(this.ascendingSort);
  }
}
