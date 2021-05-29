import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './components/landing/landing.component'
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { SignupComponent } from './components/signup/signup.component';

import { BooksComponent } from './components/books/books.component';
import { BookListComponent } from './components/books/book-list/book-list.component';
import { BookEntryComponent } from './components/books/book-entry/book-entry.component';

import { UserComponent } from './components/user/user.component';
import { UserListComponent } from './components/user/list/user-list.component';
import { UserLendingsComponent } from './components/user/lendings/user-lendings.component';
import { UserDataComponent } from './components/user/user-data/user-data.component';
import { UserCommentsComponent } from './components/user/user-comments/user-comments.component';

import { AdministrationComponent } from './components/administration/administration.component';
import { LendingsComponent } from './components/administration/lendings/lendings.component';
import { BookAddComponent } from './components/administration/book-add/book-add.component';
import { ProfilesComponent } from './components/administration/profiles/profiles.component';
import { ProfilesListComponent } from './components/administration/profiles/list/profiles-list.component';

const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'books', component: BooksComponent, children: [
        { path: '', component: BookListComponent },
        { path: 'entry', component: BookEntryComponent }
    ]},
    { path: 'user', component: UserComponent, children: [
        { path: '', component: UserListComponent },
        { path: 'data', component: UserDataComponent },
        { path: 'list', component: UserListComponent },
        { path: 'comments', component: UserCommentsComponent },
        { path: 'lendings', component: UserLendingsComponent }
    ]},
    { path: 'admin', component: AdministrationComponent, children: [
        { path: '', component: LendingsComponent },
        { path: 'add', component: BookAddComponent },
        { path: 'lendings', component: LendingsComponent },
        { path: 'profiles', component: ProfilesComponent , children: [
            { path: '', component: ProfilesListComponent },
            { path: 'list', component: ProfilesListComponent }
        ]},
    ]},
    { path: 'auth', component: AuthenticationComponent },
    { path: 'signup', component: SignupComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
