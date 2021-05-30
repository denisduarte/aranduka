import { environment } from './../environments/environment';

import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { BookService } from "../../../services/book.service";
import { Book } from "../../../models/book.model";

const APIEndpoint = environment.APIEndpoint;

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})
export class BookAddComponent implements OnInit {

  apiUrl = APIEndpoint + "/api/books";
  bookForm: FormGroup;
  editMode = false;
  routeSubscription: Subscription;

  @ViewChild('bookCoverImg', {static: false}) bookCoverImg: ElementRef;
  @ViewChild('author', {static: false}) author: ElementRef;
  @ViewChild('authorList', {static: false}) authorList: ElementRef;

  bookAuthors: string[] = [];
  book: Book = new Book();

  constructor(public router: Router,
              private route: ActivatedRoute,
              private bookService: BookService) { }

  ngOnInit(): void {

    this.routeSubscription = this.route.queryParams.subscribe(
            (params: Params) => {
                if (params.id)
                  this.bookService
                    .fetchBook(params.id)
                    .subscribe(
                      book => {
                        this.book = book;
                        this.initForm();
                      },
                      err => {
                        console.log(err);
                      }
                  );;
            }
    );

    this.initForm();
  }

  fillImage(event) {
    this.bookCoverImg.nativeElement.src = event.target.value;
  }

  onAddAuthor() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.bookForm.get('author')).push(control);
  }
  onRemoveAuthor(i: number) {
    (<FormArray>this.bookForm.get('author')).removeAt(i);
  }
  getAuthorControls() {
    return (<FormArray>this.bookForm.get('author')).controls;
  }

  onAddOrganiser() {
    const control = new FormControl(null);
    (<FormArray>this.bookForm.get('organiser')).push(control);
  }
  onRemoveOrganiser(i: number) {
    (<FormArray>this.bookForm.get('organiser')).removeAt(i);
  }
  getOrganiserControls() {
    return (<FormArray>this.bookForm.get('organiser')).controls;
  }

  onAddTranslator() {
    const control = new FormControl(null);
    (<FormArray>this.bookForm.get('translator')).push(control);
  }
  onRemoveTranslator(i: number) {
    (<FormArray>this.bookForm.get('translator')).removeAt(i);
  }
  getTranslatorControls() {
    return (<FormArray>this.bookForm.get('translator')).controls;
  }

  onAddLocal() {
    const control = new FormControl(null);
    (<FormArray>this.bookForm.get('local')).push(control);
  }
  onRemoveLocal(i: number) {
    (<FormArray>this.bookForm.get('local')).removeAt(i);
  }
  getLocalControls() {
    return (<FormArray>this.bookForm.get('local')).controls;
  }

  onAddTag() {
    const control = new FormControl(null);
    (<FormArray>this.bookForm.get('tags')).push(control);
  }
  onRemoveTag(i: number) {
    (<FormArray>this.bookForm.get('tags')).removeAt(i);
  }
  getTagsControls() {
    return (<FormArray>this.bookForm.get('tags')).controls;
  }

  onSubmit() {

    const book = new Book(this.bookForm.value);

    this.bookService
      .addBook(book)
      .subscribe(
        book => {
          console.log('aqui', book);

          this.router.navigate(['books', 'entry'], { queryParams: { id: book._id } });
        },
        err => {
          console.log(err);
        }
      );

    //this.bookForm.reset()

  }
  //addTag(event) {
    //this.selectedTags = event;
  //}

  private initForm() {
    let urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-~,_]*/?';

    console.log('this.bookw', this.book);


    let authorControlList = [];
    if (this.book.Authors) {
      for (let author of this.book.Authors) {
        authorControlList.push(new FormControl(author.name, Validators.required))
      }
    } else { authorControlList.push(new FormControl(null, Validators.required)) }

    let organiserControlList = [];
    if (this.book.Organisers) {
      for (let organiser of this.book.Organisers) {
        organiserControlList.push(new FormControl(organiser.name, Validators.required))
      }
    } else { organiserControlList.push(new FormControl(null, Validators.required)) }

    let translatorControlList = [];
    if (this.book.Translators) {
      for (let translator of this.book.Translators) {
        translatorControlList.push(new FormControl(translator.name, Validators.required))
      }
    } else { translatorControlList.push(new FormControl(null, Validators.required)) }

    let localControlList = [];
    if (this.book.Locals) {
      for (let local of this.book.Locals) {
        localControlList.push(new FormControl(local.name, Validators.required))
      }
    } else { localControlList.push(new FormControl(null, Validators.required)) }

    let tagsControlList = [];
    if (this.book.Tags) {
      for (let tag of this.book.Tags) {
        tagsControlList.push(new FormControl(tag.name, Validators.required))
      }
    } else { tagsControlList.push(new FormControl(null, Validators.required)) }

    this.bookForm = new FormGroup({
      '_id': new FormControl(this.book._id),
      'code': new FormControl(this.book.code, Validators.required),
      'title': new FormControl(this.book.title, Validators.required),
      'subtitle': new FormControl(this.book.subtitle),
      'description': new FormControl(this.book.description),
      'author': new FormArray(authorControlList),
      'organiser': new FormArray(organiserControlList),
      'translator': new FormArray(translatorControlList),
      'press': new FormControl(this.book.press, Validators.required),
      'year': new FormControl(this.book.year, [Validators.pattern("\\d{4}"),
                                     Validators.min(1000),
                                     Validators.max((new Date()).getFullYear())]),
      'edition': new FormControl(this.book.edition, Validators.pattern("\\d*")),
      'collection': new FormControl(this.book.collection),
      'volume': new FormControl(this.book.volume),
      'pages': new FormControl(this.book.pages, Validators.pattern("\\d*")),
      'ex': new FormControl(this.book.ex, Validators.pattern("\\d*")),
      'format': new FormControl(this.book.format),
      'isbn': new FormControl(this.book.isbn),
      'local': new FormArray(localControlList),
      'condition': new FormControl(this.book.condition),
      'tags': new FormArray(tagsControlList),
    });

    //this.populateTags();
  }

  /*populateTags() {
    this.bookService
      .getAllTags()
      .subscribe(
        data => {
          this.autoCompleteTags = data;
        },
        err => {
          console.log(err);
        }
      );
  }*/

  ngOnDestroy(): void {
        this.routeSubscription.unsubscribe();
  }
}
