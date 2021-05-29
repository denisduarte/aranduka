import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";

import { Book } from '../../../models/book.model';
import { User } from '../../../models/user.model';

import { UserService } from "../../../services/user.service";
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'app-user-comments',
  templateUrl: './user-comments.component.html',
  styleUrls: ['./user-comments.component.css']
})
export class UserCommentsComponent implements OnInit, OnDestroy {

  private userSubscription = new Subscription();
  public book: Book;
  public comments = []

  constructor(private userService: UserService,
              private bookService: BookService) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe(user => {
      if (user) {
        this.loadComments();
      }
    });

    this.userService.user.next(this.userService.user.value);
  }

  private loadComments() {
    this.userService.getComments()
                    .subscribe(
                        comments => {
                          this.comments = comments
                        },
                        errorMessage => {
                          console.log(errorMessage);
                        }
                    );
  };

  private removeComment(commentID) {
    this.bookService.removeComment(commentID)
                    .subscribe( commentID => {
                      const index = this.comments.findIndex(comment => comment._id == commentID);

                      if (index > -1) {
                         this.comments.splice(index, 1);
                      }
                    });
  };

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  };
}
