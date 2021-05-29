import { Component, OnInit } from '@angular/core';

import { Book } from '../../../models/book.model';
import { AdminService } from "../../../services/admin.service";

@Component({
  selector: 'app-lendings',
  templateUrl: './lendings.component.html',
  styleUrls: ['./lendings.component.css']
})
export class LendingsComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  lendings = [];

  ngOnInit(): void {

    console.log('LendingsComponent');

    this.loadLendings();

  }

  private loadLendings() {

    this.adminService.getLendings()
                     .subscribe(
                          data => {
                            this.lendings = data;
                          },
                          err => {
                            console.log(err);
                          }
                        );

  }

  onReturnBook(bookID: string): boolean {

    this.adminService.returnBook(bookID);

    const index = this.lendings.findIndex(book => book._id == bookID);

    if (index > -1) {
       this.lendings.splice(index, 1);
    }

    return true;
  }


  daysSince(date: string): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const today = new Date();
    const lendingDate = new Date(date);

    const days:number = Math.round(Math.abs((+today - +lendingDate) / oneDay));

    return days;
  }

}
