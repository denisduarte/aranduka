import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { BookService } from "../../../services/book.service";
import { UserService } from '../../../services/user.service';

import { Book } from '../../../models/book.model';
import { User, WishlistEntry } from '../../../models/user.model';

class Action {
    public link: string;
    public icon: string;
    public text: string;
    public colorClass: string;

    constructor(link, icon, text, colorClass) {
      this.link = link;
      this.icon = icon;
      this.text = text;
      this.colorClass = colorClass;
    }
}

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  @Input() book;
  @Input() parentClass;

  private userSubscription: Subscription;
  public user: User;
  bookActions = [null, null, null, null]

  constructor(private router: Router,
              private datePipe: DatePipe,
              private bookService: BookService,
              private userService: UserService) { }

  ngOnInit(): void {

    this.userSubscription = this.userService.user.subscribe(user => {
        if (user) {
          this.user = user;
          this.defineActions(this.user, this.book)
        }
      });
  }

  private defineActions(user: User, book: Book) {

    const option_BookAvailable = new Action(null, 'fa-check-circle', 'Disponível', 'icon-green');
    const option_EnterWaitingList = new Action(this.onEnterWaitingList.bind(this), 'fa-list-ol', 'Entrar na fila de espera', '');
    const option_LeaveWaitingList = new Action(this.onLeaveWaitingList.bind(this), 'fa-list-ol', 'Sair da fila de espera', '');
    const option_Comments = new Action(this.onOpenComments.bind(this), 'fa-comments', 'Comentários', '');
    const option_AddToWishlist = new Action(this.onAddToWishist.bind(this), 'fa-clipboard-list', 'Adicionar à minha lista', '');
    const option_RemoveFromWishlist = new Action(this.onRemoveFromWishist.bind(this), 'fa-trash-alt', 'Remover da minha lista', '');
    const option_RenewLending = new Action(this.onRenewBook.bind(this), 'fa-undo-alt', 'Renovar empréstimo', '');
    const option_Due = new Action(null, 'fa-exclamation-triangle', 'Devolução do livro atrasada', 'icon-red');
    const option_BorrowBook = new Action(this.onBorrowBook.bind(this), 'fa-book', 'Solicitar empréstimo', '');
    const option_ReturnBook = new Action(this.onReturnBook.bind(this), 'fa-file-signature', 'Devolver livro', '');
    const option_CannotLendBookMax = new Action(null, 'fa-clone', 'Máximo de 2 livros de cada vez', '');
    const option_CannotLendBookWait = new Action(null, 'fa-clock', 'Alguém está na fila de espera', '');
    const option_BookUnavailableQueue = new Action(null, 'fa-times-circle', 'Indisponível. Alguém está na fila de espera.', 'icon-red');

    let   option_DueDate = null;
    let   option_BookUnavailableUntil = new Action(null, 'fa-times-circle', 'Indisponível ', 'icon-red');

    if (book.lending.length > 0) {
        option_BookUnavailableUntil.text = option_BookUnavailableUntil.text.concat(' até ' + this.datePipe.transform(new Date(book.lending[0].lendingEntry.dueDate),'dd/MM/yyyy'));
        option_DueDate = new Action(null, 'fa-calendar-alt', 'Devolver em ' + this.datePipe.transform(new Date(book.lending[0].lendingEntry.dueDate),'dd/MM/yyyy'), '');
    }

    const bookIsAvailable = this.isBookAvailable(book);
    const userCanBorrow = this.canUserBorrow(user);
    const userIsBorrowingBook = this.isUserBorrowingBook(book, user);
    const userIsWaitingBook = this.isUserWaitingBook(book, user);
    const bookIsInUserWishlist = this.isBookInUserWishlist(book, user);
    const bookIsDue = this.isBookDue(book);
    const anotherUserIsWaitingBook = this.isAnotherUserWaitingBook(book, user);


    /*if (book._id == 1 || book._id == 47 ) {
      console.log('bookIsAvailable', bookIsAvailable);
      console.log('anotherUserIsWaitingBook', anotherUserIsWaitingBook);
      console.log('userIsBorrowingBook', userIsBorrowingBook);
      console.log('bookIsDue', bookIsDue);

    }*/


    // FIRST ACTION
    if (bookIsAvailable && !anotherUserIsWaitingBook) {
      this.bookActions[0] = option_BookAvailable;
    }

    if (bookIsAvailable && anotherUserIsWaitingBook) {
      this.bookActions[0] = option_BookUnavailableQueue;
    }

    if (!bookIsAvailable && !userIsBorrowingBook) {

      this.bookActions[0] = option_BookUnavailableUntil;
    }

    if (!bookIsAvailable && userIsBorrowingBook && !bookIsDue) {
      this.bookActions[0] = option_DueDate;
    }

    if (!bookIsAvailable && userIsBorrowingBook && bookIsDue && anotherUserIsWaitingBook) {
      this.bookActions[0] = option_Due;
    }

    if (!bookIsAvailable  && userIsBorrowingBook && bookIsDue && !anotherUserIsWaitingBook) {
      this.bookActions[0] = option_RenewLending;
    }

    // SECOND ACTION
    if (bookIsAvailable && userCanBorrow && !anotherUserIsWaitingBook) {
      this.bookActions[1] = option_BorrowBook;
    }
    if (bookIsAvailable && userCanBorrow && anotherUserIsWaitingBook && !userIsWaitingBook ) {
      //this.bookActions[1] = option_CannotLendBookWait;
      this.bookActions[1] = option_EnterWaitingList;
    }
    if (bookIsAvailable && userCanBorrow && anotherUserIsWaitingBook && userIsWaitingBook ) {
      //this.bookActions[1] = option_CannotLendBookWait;
      this.bookActions[1] = option_LeaveWaitingList;
    }
    if (bookIsAvailable  && !userCanBorrow) {
      this.bookActions[1] = option_CannotLendBookMax;
    }
    if (!bookIsAvailable  && userIsBorrowingBook ) {
      this.bookActions[1] = option_ReturnBook;
    }
    if (!bookIsAvailable  && !userIsBorrowingBook && !userIsWaitingBook) {
      this.bookActions[1] = option_EnterWaitingList;
    }
    if (!bookIsAvailable  && !userIsBorrowingBook && userIsWaitingBook) {
      this.bookActions[1] = option_LeaveWaitingList;
    }

    // Third ACTION
    if (bookIsInUserWishlist) {
      this.bookActions[2] = option_RemoveFromWishlist;
    }
    if (!bookIsInUserWishlist) {
      this.bookActions[2] = option_AddToWishlist;
    }

    // Fourth ACTION
    this.bookActions[3] = option_Comments;


  }


  private isBookAvailable(book: Book): boolean {
    return book.lending.length ? false : true;
  }

  private canUserBorrow(user: User): boolean {
    return user.borrowing.length < 2;
  }

  private isUserBorrowingBook(book: Book, user: User): boolean {
    if (book.lending.length === 0) {
      return false;
    } else {
      return book.lending[0]._id === user._id;
    }
  }

  private isUserWaitingBook(book: Book, user: User): boolean {
    var waitingBookIds = user.waiting.map(entry => entry._id);
    return (waitingBookIds.indexOf(book._id) > -1) ? true : false;
  }

  private isBookInUserWishlist(book: Book, user: User): boolean {
    var wishlishBookIds = user.wishlist.map(entry => entry._id);
    return (wishlishBookIds.indexOf(book._id) > -1) ? true : false;
  }

  private isAnotherUserWaitingBook(book: Book, user: User): boolean {
    var waitingUserIds = book.queue.map(entry => entry._id);

    if (book.queue.length == 0) {
      return false;
    } else {
      if (book.queue[0]._id != user._id)
        return true;
    }
    return false;
  }

  private isBookDue(book: Book): boolean {

    if (book.lending.length === 0) {
      return false;
    } else {

      const today = this.withoutTime(new Date());
      const dueDate = this.withoutTime(new Date(book.lending[0].lendingEntry.dueDate));

      return dueDate < today;
    }
  }



  //////////

  onBorrowBook(book: Book): boolean {

    var lending = this.bookService.borrowBook(book._id)
          .subscribe(lending => {
             book.lending.push(lending.user[0]);
             this.user.borrowing.push(lending.book[0]);

             this.userService.user.value.borrowing = this.user.borrowing;
             this.userService.user.next(this.userService.user.value);

           });
    return true;
  }

  onReturnBook(book: Book): boolean {
    this.bookService.returnBook(book._id);

    let index = this.user.borrowing.findIndex(lending => lending._id == book._id);
    if (index > -1) {
       this.user.borrowing.splice(index, 1);
    }

    index = book.lending.findIndex(lending => lending._id == this.user._id);
    if (index > -1) {
       book.lending.splice(index, 1);
    }

    this.userService.user.value.borrowing = this.user.borrowing;
    this.userService.user.next(this.userService.user.value);

    return true;
  }

  onRenewBook(book: Book): boolean {
    this.bookService.renewBook(book._id)
          .subscribe(lending => {

              book.lending[0].lendingEntry.dueDate = lending.dueDate;

              this.defineActions(this.user, book);
           });

    return true;
  }

  onAddToWishist(book: Book): boolean {
    this.bookService.addBookToWishlist(book._id)
        .subscribe(wishlist => {
            const wishlistEntry = new WishlistEntry(wishlist[0].BookId, wishlist[0].createdAt)

            this.user.wishlist.push(wishlistEntry);
            this.defineActions(this.user, book);
         });

    return true;
  }

  onRemoveFromWishist(book: Book): boolean {
    this.bookService.removeBookFromWishlist(book._id)
        .subscribe(returnedBook => {
            let index = this.user.wishlist.findIndex(entry => entry._id == returnedBook._id);
            if (index > -1) {
               this.user.wishlist.splice(index, 1);
            }
            this.defineActions(this.user, book);
         });

    return true;
  }

  onEnterWaitingList(book: Book): boolean {
    this.bookService.enterWaitingList(book._id)
        .subscribe(waiting => {

          this.user.waiting.push(waiting.book[0]);
          book.queue.push(waiting.user[0]);

          this.defineActions(this.user, book);
         });
    return true;
  }
  onLeaveWaitingList(book: Book): boolean {
    this.bookService.leaveWaitingList(book._id)
        .subscribe(returnedBook => {
            let index = this.user.waiting.findIndex(entry => entry._id == returnedBook._id);
            if (index > -1) {
               this.user.waiting.splice(index, 1);
            }

            index = book.queue.findIndex(entry => entry._id == this.user._id);
            if (index > -1) {
               this.user.waiting.splice(index, 1);
            }

            this.defineActions(this.user, book);
         });

      return true;
  }

  onOpenComments(book: Book, user: User, bookService: BookService): boolean {
    this.router.navigate(['books', 'entry'], { queryParams: { id: book._id }, fragment: 'comments' });
    return true;
  };

  withoutTime(date: Date): number {
    return date.setHours(0, 0, 0, 0);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
