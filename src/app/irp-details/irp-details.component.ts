import { Component, OnInit, Inject } from '@angular/core';
import { Book } from '../model/book';
import { BookWiseUserIssuList } from '../model/bookWiseUserIssuList';
import { BookService } from '../book.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { fileUpload, dummy } from '../commonUrl';
@Component({
  selector: 'app-irp-details',
  templateUrl: './irp-details.component.html',
  styleUrls: ['./irp-details.component.css']
})
export class IrpDetailsComponent implements OnInit {

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
