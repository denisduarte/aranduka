import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { UserResponse } from '../../api.interfaces';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  wait = ms => new Promise(res => setTimeout(res, ms));

  constructor(private userService: UserService,
              public router: Router,
              private route: ActivatedRoute) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  async onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<UserResponse>;

    this.isLoading = true;

    await this.wait(2000);


    this.userService.login(email, password)
                    .subscribe(
                        resData => {
                          this.isLoading = false;
                          this.router.navigate(['/books']);
                        },
                        errorMessage => {
                          console.log(errorMessage);
                          this.error = errorMessage;
                          this.isLoading = false;
                        });

    form.reset();

  }
}
