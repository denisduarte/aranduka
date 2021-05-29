import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DatePipe, registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localePtPt from '@angular/common/locales/pt-PT';
registerLocaleData(localePtPt);

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';

import { LandingComponent } from './components/landing/landing.component'
import { HeaderComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';

import { BooksComponent } from './components/books/books.component';
import { BookListComponent } from './components/books/book-list/book-list.component';
import { BookEntryComponent } from './components/books/book-entry/book-entry.component';
import { CommentsComponent } from './components/books/book-entry/comments/comments.component';

import { AuthenticationComponent } from './components/authentication/authentication.component';
import { UserComponent } from './components/user/user.component';
import { UserListComponent } from './components/user/list/user-list.component';
import { UserLendingsComponent } from './components/user/lendings/user-lendings.component';
import { UserDataComponent } from './components/user/user-data/user-data.component';
import { UserCommentsComponent } from './components/user/user-comments/user-comments.component';

import { AdministrationComponent } from './components/administration/administration.component';
import { BookAddComponent } from './components/administration/book-add/book-add.component';
import { LendingsComponent } from './components/administration/lendings/lendings.component';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { ShortnamePipe } from './pipes/shortname.pipe';
import { ImagePreloadDirective } from './directives/image-preload.directive';
import { ProfilesComponent } from './components/administration/profiles/profiles.component';
import { ProfilesListComponent } from './components/administration/profiles/list/profiles-list.component';
import { ActionsComponent } from './components/books/actions/actions.component';
import { GalleryComponent } from './components/landing/gallery/gallery.component';
import { LightboxModule } from 'ngx-lightbox';
import { SignupComponent } from './components/signup/signup.component';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    HeaderComponent,
    PageNotFoundComponent,
    BooksComponent,
    LandingComponent,
    SpinnerComponent,
    AuthenticationComponent,
    BookEntryComponent,
    CommentsComponent,
    UserComponent,
    UserListComponent,
    UserDataComponent,
    UserCommentsComponent,
    ShortnamePipe,
    UserLendingsComponent,
    AdministrationComponent,
    BookAddComponent,
    LendingsComponent,
    ImagePreloadDirective,
    ProfilesComponent,
    ProfilesListComponent,
    ActionsComponent,
    GalleryComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    LightboxModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    ModalModule.forRoot()
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt-PT" },
              DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
