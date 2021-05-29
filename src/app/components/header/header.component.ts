import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { UserService } from '../../services/user.service';
import { BookService } from '../../services/book.service';
import { SearchService } from "../../services/search.service";

import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isCollapsed = true;
  searchInput = '';
  bookList = [];
  isAuthenticated = false;
  error = "";

  private userSubscription: Subscription;
  public user: User;

  constructor(private search: SearchService,
              public router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private bookService: BookService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      this.user = user;
    });

    //this.userService.autologin();

    this.search.searchInputUpdated.subscribe(searchInputValue => {
      this.searchInput = searchInputValue;
      this.search.searchInputValue = searchInputValue;
    })

    window.onbeforeunload = () => this.ngOnDestroy();

  }

  onUpdateSearchInput(event: Event) {
    console.log('event', event);

    this.searchInput = (<HTMLInputElement>event.target).value;

    this.search.searchInputUpdated.emit(this.searchInput)
    this.router.navigate(['books']);
  }

  onLogout() {
    let authObs: Observable<any>;

    authObs = this.userService.logout();

    authObs.subscribe(
      resData => {
        this.isAuthenticated = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        this.error = errorMessage;
      }
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.search.searchInputUpdated.unsubscribe();
    this.onLogout();
  }
}
