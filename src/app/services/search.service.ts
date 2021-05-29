import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchInputValue: string = "";
  searchInputUpdated = new EventEmitter();

  constructor() { }

}
