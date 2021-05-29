import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  navigateToPage = new EventEmitter<string>();

  constructor() { }

}
