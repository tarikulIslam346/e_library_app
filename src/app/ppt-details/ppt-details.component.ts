import { Component, OnInit, Inject } from '@angular/core';
import { Book } from '../model/book';
import { BookWiseUserIssuList } from '../model/bookWiseUserIssuList';
import { MAT_DIALOG_DATA } from '@angular/material';
import { BookService } from '../book.service';
import { fileUpload, dummy } from '../commonUrl';

@Component({
  selector: 'app-ppt-details',
  templateUrl: './ppt-details.component.html',
  styleUrls: ['./ppt-details.component.css']
})
export class PptDetailsComponent implements OnInit {

  loader = false;
  totalIssue: number;
  bookDetails: Book[];
  userListOfBookIssue: BookWiseUserIssuList[];
  url =fileUpload;
  dummyUrl= dummy;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public bookService: BookService,
  ) {
    console.log(data.book_id);
    console.log(data.type);
    this.getSpecificBook(data.book_id);
    this.bookService.bookIssueWiseUserList(data.book_id).subscribe(userList => {
      // console.log(userList);
      // console.log(userList.length);
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
