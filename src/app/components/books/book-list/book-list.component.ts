import { Component, OnInit, OnDestroy, ViewChild,
         ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Book } from '../../../models/book.model';
import { BookService } from "../../../services/book.service";

import { SearchService } from "../../../services/search.service";

import { UserService } from '../../../services/user.service';
import { User, WishlistEntry } from '../../../models/user.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  screenHeight: number;
  screenWidth: number;

  offset: {has: boolean, value: number} = {has: false, value: 0};
  lefts: number[] = [];

  bookList:Book[] = [];
  page:number = 0;
  booksPerPage:number = 30;
  filterTag: string[] = [];
  filterSearch: string = '';
  sortField: string = 'createdAt';
  sortDirection: number = 1;

  @ViewChild('bookUl', { static: false }) bookUl: ElementRef;
  @ViewChildren('bookDiv') bookDivs: QueryList<ElementRef>;

  //isAuthenticated = false;
  private userSubscription: Subscription;
  private bookListSubscription: Subscription;
  private routeSubscription: Subscription;
  public user: User;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private bookService: BookService,
              private search: SearchService,
              private userService: UserService) {
  }

  ngOnInit() {

    //this.getBooks();

    this.getScreenSize();

    this.search.searchInputUpdated.subscribe(
      searchInputValue => {
        this.filterSearch = searchInputValue;

        this.getBooks(this.filterSearch, this.filterTag,
                      0, this.booksPerPage, false,
                      this.sortField, this.sortDirection);
      }
    );

    this.userSubscription = this.userService.user.subscribe(
      user => {
        //this.isAuthenticated = !!user;
        this.user = user;
      }
    );

    this.bookListSubscription = this.bookService.bookList.subscribe(
      bookList => {
        this.bookList = bookList;
      }
    );

    this.routeSubscription = this.route.queryParams.subscribe(
            (params: Params) => {
                if (params.tag)
                  this.filterByTag(params.tag);
            }
    );

    this.filterSearch = this.search.searchInputValue;
    this.search.searchInputUpdated.emit(this.filterSearch)
  }

  sortOrder(field) {

    //if its the same field, reverse order
    if (field == this.sortField) {
      this.sortDirection = -1 * this.sortDirection;
    }
    // otherwise, set to default
    else {
      this.sortDirection = 1;
    }

    this.sortField = field;
    this.getBooks(this.filterSearch, this.filterTag,
                  0, this.booksPerPage, false,
                  this.sortField, this.sortDirection);
  }

  getBooks( searchInput: string = '',
            tagInput: string[] = [],
            page: number = 0,
            booksPerPage:number = 30,
            appendResults:boolean = false,
            sortField: string = "createdAt",
            sortDirection: number = -1
          ) {
    this.bookService.getBookList(searchInput, tagInput, page,
                                 booksPerPage, appendResults, sortField,
                                 sortDirection);
  }

  calculateLefts(Ul, lefts) {
    var books = Ul.nativeElement.childNodes;

    for (var i = 0; i < books.length-1; i++) {
      var item = books[i];

      lefts[i] = item.getBoundingClientRect().left;
    }
  }

  ngAfterViewInit() {
    setTimeout(this.calculateLefts.bind(null, this.bookUl, this.lefts), 1000);
  }

  getScreenSize(): any {
    let win = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = win.innerWidth,
        h = win.innerHeight;

      this.screenHeight = h;
      this.screenWidth = w;


  }

  //function that calculates the offset of the floating box to prevent
  // it to going off-screen
  mouseEnter(i: number) {
console.log('enter', i);

    this.getScreenSize();
    this.calculateLefts(this.bookUl, this.lefts);

    let bookDiv = this.bookDivs.toArray()[i];

    //Getting the margin and padding of the container div
    let container_div = bookDiv.nativeElement.closest('.first-container');
    let containerMargin = parseFloat(window.getComputedStyle(container_div, null)
                                    .getPropertyValue('margin-right'));
    let containerPadding = parseFloat(window.getComputedStyle(container_div, null)
                                     .getPropertyValue('padding-right'));

    //The original size of the div
    var divWidth = bookDiv.nativeElement.offsetWidth;

    //The % of increase of the div size given by the transformation
    let container_li = bookDiv.nativeElement.closest('li');
    let transform = window.getComputedStyle(container_li, null)
                                       .getPropertyValue('transform');

    const matrixValues = transform.match(/matrix.*\((.+)\)/)[1].split(', ')
    let scale = parseFloat(matrixValues[0]);

    /////temp
    //console.log(scale);
    switch (true) {
      case (this.screenWidth >= 768): { scale = 1.5; break; }
      case (this.screenWidth >= 576): { scale = 1.1; break; }
    }


    //The original position of the div
    var myOriginalLeft = this.lefts[i];

    /*
    var rect = bookDiv.nativeElement.getBoundingClientRect();
    var divLeft = rect.left
    var divPaddingL = parseFloat(window.getComputedStyle(bookDiv.nativeElement, null)
                                .getPropertyValue('padding-left'));
    var divPaddingR = parseFloat(window.getComputedStyle(bookDiv.nativeElement, null)
                                .getPropertyValue('padding-right'));
                        */


    if (!this.offset.has) {
      this.offset.has = true;

      this.offset.value = (this.screenWidth
                            - myOriginalLeft
                            - divWidth * scale
                            - (containerMargin + containerPadding + 7)
                          ) / scale;
    }
    //console.log(this.offset.value);

    if (this.offset.value < 0) {

      //setTimeout(() => {


        bookDiv.nativeElement.parentNode.parentNode.style.setProperty('transform',
                                  'scale(1) translateY(20px) translateX(' + this.offset.value + 'px)');

      //}, 500);

    }
  }

  mouseOut(i: number) {
    console.log('out', i);

      var bookDiv = this.bookDivs.toArray()[i];

      if (this.offset.has) {

        //setTimeout(() => {


          bookDiv.nativeElement.parentNode.parentNode.style.setProperty('transform', '');

          this.offset.has = false;
          this.offset.value = 0;

      //  }, 500);

      }
  }

  filterByTag(tag: string) {


    console.log('filterByTag');

    if (this.filterTag.indexOf(tag) === -1) {
      console.log('entrei');

      this.filterTag.push(tag);
    } else { console.log('não entrei'); }

    this.getBooks(this.filterSearch, this.filterTag,
                  0, this.booksPerPage, false,
                  this.sortField, this.sortDirection);
  }

  removeTag(index: number) {

        console.log('removeTag');
    this.filterTag.splice(index, 1);
    this.getBooks(this.filterSearch, this.filterTag,
                  0, this.booksPerPage, false,
                  this.sortField, this.sortDirection);
  }


  onScroll() {
    if (this.bookList.length < this.bookService.totalBooks) {
      this.page++;
      this.getBooks(this.filterSearch, this.filterTag,
                    this.page, this.booksPerPage, true,
                    this.sortField, this.sortDirection);
    }
  }


  daysSince(date: string): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();
    const lendingDate = new Date(date);

    const days:number = Math.round(Math.abs((+today - +lendingDate) / oneDay));

    return days;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.bookListSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    //this.search.searchInputUpdated.unsubscribe();
  }

}
