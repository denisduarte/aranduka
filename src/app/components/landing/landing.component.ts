import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SearchService } from "../../services/search.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router,
              private search: SearchService,) {
  }

  ngOnInit(): void {
    this.search.searchInputUpdated.emit('');
  }

  enter() {
    this.router.navigate(['books']);
  }
}
