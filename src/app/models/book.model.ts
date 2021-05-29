import { User } from "./user.model";

export class Comment {
  public _id: number;
  public comment: string;
  public BookId: number;
  public UserId: number;
}

export class BookList {
  public books: Book[];
  public total: { count: number };
}

export class LendingEntry {
    public _id: number;
    public lendingEntry: { createdAt: Date, dueDate: Date };
    public book: Book;
    public user: User;

    constructor(id, createdAt, dueDate, book?, user?) {
      this._id = id;
      this.lendingEntry = { createdAt: createdAt, dueDate: dueDate };
      this.book = book;
      this.user = user;
    }
}

export class QueueEntry {
    public _id: number;
    public waitingEntry: { createdAt: Date };
    public book: Book;
    public user: User;

    constructor(id, createdAt, dueDate, book?, user?) {
      this._id = id;
      this.waitingEntry = { createdAt: createdAt };
      this.book = book;
      this.user = user;
    }
}

class ListObj {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Book {
  public _id: number;
  public code: string;
  public title: string;
  public subtitle: string;
  public description: string;
  public Authors: ListObj[];
  public Organisers: ListObj[];
  public Translators: ListObj[];
  public press: string;
  public year: number;
  public collection: string;
  public volume: string;
  public Locals: ListObj[];
  public edition: number;
  public pages: number;
  public ex: string;
  public format: string;
  public status: string;
  public condition: string;
  public isbn: number;
  public Tags: ListObj[];
  public coverURL: string;
  public Comments: Comment[];
  public total_comments: Number;
  public createdAt: Date;
  public queue: QueueEntry[];
  public lending: LendingEntry[];

  constructor(book?) {
    if (book) {
        this._id = book._id;
        this.code = book.code;
        this.title = book.title;
        this.subtitle = book.subtitle;
        this.description = book.description;
        this.press = book.press;
        this.year = book.year;
        this.collection = book.collection;
        this.volume = book.volume;
        this.edition = book.edition;
        this.pages = book.pages;
        this.ex = book.ex;
        this.format = book.format;
        this.status = book.status;
        this.condition = book.condition;
        this.isbn = book.isbn;
        this.coverURL = book.coverURL;
        this.Comments = book.comments;
        this.total_comments = book.total_comments;
        this.createdAt = book.createdAt;

        this.Authors = book.author.map(element => new ListObj(element));
        this.Organisers = book.organiser.map(element => new ListObj(element));
        this.Translators = book.translator.map(element => new ListObj(element));
        this.Locals = book.local.map(element => new ListObj(element));
        this.Tags = book.tags.map(element => new ListObj(element));

        this.queue = book.queue;
        this.lending = book.lending;
    }
  }
}
