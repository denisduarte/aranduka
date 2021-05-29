import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  userForm: FormGroup;
  public formUpdated: boolean = false;
  error: string = null;

  constructor(private userService: UserService,
              public router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initForm();
  }


  private initForm() {
    this.userForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required]),
      'acceptMailling': new FormControl(null),
    });

  }

  onSubmit() {

    const user = new User(this.userForm.value);
    user.administrator = false;

    this.userService
      .addUser(user)
      .subscribe(newuser => {
            this.userService.login(user.email, this.userForm.value.password)
                            .subscribe(
                                resData => {
                                  this.router.navigate(['/books']);
                                },
                                errorMessage => {
                                  this.error = errorMessage;
                                });
          },
          errorMessage => {
            console.log(errorMessage);

            this.error = errorMessage;
          }
      );
  }

  hideAlert() {
    this.formUpdated = false;
  }

}
