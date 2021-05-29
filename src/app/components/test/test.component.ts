import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-test',
    styles: [
        `.search-results {
            height: 20rem;
            overflow: scroll;
        }`
    ],
    template: `
        <div class="search-results"
            infiniteScroll
            [infiniteScrollDistance]="2"
            [infiniteScrollThrottle]="500"
            (scrolled)="onScroll()"
            [scrollWindow]="false">aaaa
        </div>
    `
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onScroll () {
      console.log('scrolled!!')
  }

}
