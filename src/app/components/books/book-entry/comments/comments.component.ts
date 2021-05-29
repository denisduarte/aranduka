import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe} from '@angular/common';
import { Subscription, Observable } from 'rxjs';

import { BookService } from "../../../../services/book.service";
import { Book, Comment } from "../../../../models/book.model";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  commentForm: FormGroup;

  private bookSubscription: Subscription;
  public book: Book;
  public comments = [];

  commentPage: number = 1;
  commentsPerPage: number = 10;

  constructor(private bookService: BookService,
              public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.initForm();

    this.bookSubscription = this.bookService.book.subscribe(book => {
      this.book = book;
      this.comments = book.Comments;
    });

  }


  private initForm() {
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, Validators.required)
    });
  }


  onSubmit() {
    console.log('comment0', this.bookService.book.value);
    console.log('comment1', this.bookService.book.value.Comments);
    this.bookService.addComment(this.commentForm.value)
    
    this.commentForm.reset()

  }

  formatCommentDate(commentDate) {
    let date = new Date(commentDate);

    return this.datepipe.transform(date, "dd 'de' MMMM 'de' yyyy 'às' HH'h'mm");
  }


  descendingSort( a, b ) {
    if ( a.date < b.date ){
      return 1;
    }
    if ( a.date > b.date ){
      return -1;
    }
    return 0;
  }

  sortedComments(comments:Comment[]) {

    if (comments)
      return comments.sort(this.descendingSort);

    return [];
  }

  loadMoreComments() {

    let comments = this.bookService.getComments(this.commentPage, this.commentsPerPage);
    this.commentPage++;
  }

}
