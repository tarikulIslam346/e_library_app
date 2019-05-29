import { Book } from './../model/book';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { BookService } from '../book.service';
import { BookWiseUserIssuList } from '../model/bookWiseUserIssuList';
import { fileUpload, dummy } from '../commonUrl';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  // encapsulation: ViewEncapsulation.None,
})
export class BookDetailsComponent implements OnInit {

  bookDetails: Book[];
  totalIssue: number;
  userListOfBookIssue: BookWiseUserIssuList[];
  loader = false;
  url =fileUpload;
  dummyUrl= dummy;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public bookService: BookService,
  ) {
    console.log(data.book_id);
    this.getSpecificBook(data.book_id);
    this.bookService.bookIssueWiseUserList(data.book_id).subscribe(userList => {
      console.log(userList);
      console.log(userList.length);
      this.totalIssue = userList.length;
      this.userListOfBookIssue = userList;
    });
  }

  ngOnInit() {}

  getSpecificBook(bookId) {
    this.loader = true;
    this.bookService.getSpecificbook(bookId)
      .subscribe(data => {
        this.loader = false;
        this.bookDetails = data;
      }, error => {
        this.loader = false;
        console.log(error);
      });
  }

}
