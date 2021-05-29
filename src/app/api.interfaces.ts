import { WishlistEntry } from './models/user.model';
import { Book, LendingEntry, QueueEntry  } from './models/book.model';

export interface UserResponse {
  user: {
    _id: string,
    name: string,
    email: string,
    password: string,
    acceptMailling: boolean,
    administrator: boolean,
    wishlist: WishlistEntry[]
    borrowing: LendingEntry[];
    waiting: QueueEntry[];
    _token: string;
  };
  token: string;
}

export interface UpdateUserResponseData {
    _id: string;
    name: string;
    acceptMailling: boolean;
    wishlist: WishlistEntry[];
}
