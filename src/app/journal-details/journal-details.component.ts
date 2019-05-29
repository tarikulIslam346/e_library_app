import { Component, OnInit, Inject } from '@angular/core';
import { Book } from '../model/book';
import { BookWiseUserIssuList } from '../model/bookWiseUserIssuList';
import { MAT_DIALOG_DATA } from '@angular/material';
import { BookService } from '../book.service';
import { fileUpload } from '../commonUrl';
import { dummy } from '../commonUrl';
@Component({
  selector: 'app-journal-details',
  templateUrl: './journal-details.component.html',
  styleUrls: ['./journal-details.component.css']
})
export class JournalDetailsComponent implements OnInit {

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
  ngOnInit() {
  }

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
