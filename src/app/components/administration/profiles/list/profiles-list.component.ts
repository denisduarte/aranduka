import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../../../models/user.model';
import { AdminService } from "../../../../services/admin.service";

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.css']
})
export class ProfilesListComponent implements OnInit {


  letter:string = ""
  users:User[] = []
  routeSubscription: Subscription;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private adminService: AdminService) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe(
            (params: Params) => {
              this.listUserByFirstLetter(params.letter);
            }
    );
  }

  private listUserByFirstLetter(letter: string) {
      this.adminService.listUsers(letter)
                       .subscribe(users => {
                          this.users = users;
                        });
  }

  private setAdministrator(userID: number, event) {
    this.adminService.setAdministrator(userID, event.target.checked)
                     .subscribe();
  }

  ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
  }

}
