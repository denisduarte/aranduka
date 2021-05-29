import { Book, LendingEntry, QueueEntry } from "./book.model";

export class WishlistEntry {
    public _id: number;
    public wishlistEntry: { createdAt: Date };
    public book: Book;

    constructor(id, createdAt, book?) {
      this._id = id;
      this.wishlistEntry = { createdAt: createdAt };
      this.book = book;
    }
}

export class User {
  public _id: number;
  public email: string;
  public name: string;
  public acceptMailling: boolean;
  public administrator: boolean;
  public wishlist: WishlistEntry[];
  public borrowing: LendingEntry[];
  public waiting: QueueEntry[];
  private _token: string;
  private password: string;

  constructor(user?) {
    if (user) {
      this._id = user._id;
      this.email = user.email;
      this.name = user.name;
      this.acceptMailling = user.acceptMailling;
      this.administrator = user.administrator;
      this.wishlist = user.wishlist;
      this.borrowing = user.borrowing;
      this.waiting = user.waiting;
      this._token = user._token;
      this.password = user.password;
    }
  }

  get token() {
    return this._token;
  }
}
