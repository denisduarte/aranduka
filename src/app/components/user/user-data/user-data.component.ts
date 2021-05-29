import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  userForm: FormGroup;
  private userSubscription: Subscription;
  public user: User = null;
  public formUpdated: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.initForm();

    this.userSubscription = this.userService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.userForm.setValue({
          name: user.name,
          email: user.email,
          acceptMailling: user.acceptMailling
        })
      }
    });


  }

  private initForm() {
    this.userForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'acceptMailling': new FormControl(null),
    });

  }

    onSubmit() {

      this.userService.user.value.name = this.userForm.value.name;
      this.userService.user.value.email = this.userForm.value.email;
      this.userService.user.value.acceptMailling = this.userForm.value.acceptMailling;

      this.userService
          .updateUserData()
          .subscribe(
            data => {
              this.formUpdated = true;
            },
            err => {
              console.log(err);
            }
          );
    }

    hideAlert() {
      this.formUpdated = false;
    }

}
