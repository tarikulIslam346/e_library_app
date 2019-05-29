import { Component, OnInit, Inject } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { fileUpload } from '../commonUrl';
import { bookUpload } from '../commonUrl';
import { BookPdfVieweComponent } from '../book-pdf-viewe/book-pdf-viewe.component';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { Validators, FormBuilder } from '@angular/forms';
import { Query } from '../model/query';

@Component({
  selector: 'app-book-show',
  templateUrl: './book-show.component.html',
  styleUrls: ['./book-show.component.css']
})
export class BookShowComponent implements OnInit {

  loadingbook = false;
  book: Book[];
  bookName: string;
  url = fileUpload;
  bookUrl = bookUpload;
  canView: number[] = [];
  canDownload: number[] = [];
  p: number = 1;
  userType: string;

  constructor(
    private bookService: BookService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.hasEditBookPermission();
    this.canView = [];
    this.canDownload = [];
    this.userType = localStorage.getItem('user_type');

  }


  getAllBook() {
    this.loadingbook = true;
    //console.log(localStorage.getItem('user_type'));
    this.bookService.bookSearch(this.bookName,1).subscribe(data => {
      console.log(data);
      this.loadingbook = false;
      this.book = data.sort(function (a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
     for (let i = 0; i < data.length; i++) {
        //premission process if has file
          if(data[i].file)this.getPermission(data[i].book_id)
     }

    }, err => {
      this.loadingbook = false;
      if(err.status == 400) location.reload(true);
      this.openSnackBar('Error: ' + err.error, 'ok');
    });
  }

  getBookId(BookId) {
    this.router.navigate(['edit-book/', BookId]);
  }

  getBookDetails(book_id) {
    this.openUserViewerDialog(book_id);
  }

  getPermission(book_id) {
    this.bookService.getGroupWiseBookPermission(book_id, localStorage.getItem('user_type')).subscribe(data => {
     // this.loadingbook = false;
      this.canView[book_id] = data[0].can_view;
      this.canDownload[book_id] = data[0].can_download;
    }, err => {
      console.log(err);
    });
  }
  giveBookQuery(book_id) {
    this.openQueryDialog(book_id)
  }
  getQuery(book_id) {
    this.openQueryListDialog(book_id)
  }

  openQueryDialog(book_id) {
    const dialogRef = this.dialog.open(GiveQuery, {
      width: '250px',
      data: {
        book_id: book_id
      },
    });
  }
  openQueryListDialog(book_id) {
    const dialogRef = this.dialog.open(SeeQuery, {
      width: '40%',
      data: {
        book_id: book_id
      },
    });
  }

  hasEditBookPermission() {
    if (localStorage.getItem('isEditBook') == 'true') {
      this.userService.isEditBookPermission = true;
    }
  }

  ngOnInit() {
    this.getAllBook();
    console.log(this.canView);
  }

  onBookSubmit() {
    this.searchBook(this.bookName);
  }

  openPdfViewerDialog(filename, book_id) {
    const dialogRef = this.dialog.open(BookPdfVieweComponent, {
      height: '90%',
      width: '80%',
      data: {
        filename: filename,
        book_id: book_id,
        type:'book',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUserViewerDialog(book_id) {
    const dialogRef = this.dialog.open(BookDetailsComponent, {
      // height: '40%',
      width: '80%',
      data: { book_id: book_id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchBook(bookName) {
    this.loadingbook = true;
    localStorage.getItem('user_type');
    this.bookService.bookSearch(bookName, 1).subscribe(data => {
      this.loadingbook = false;
      this.book = data;
    }, err => {
      this.loadingbook = false;
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

}

@Component({
  selector: 'giveQuery',
  templateUrl: 'giveQuery.html',
})
export class GiveQuery {
  queryForm: any;
  bookId: string;

  constructor(
    public dialogRef: MatDialogRef<GiveQuery>,
    private fb: FormBuilder,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    console.log(data.book_id);
    this.bookId = data.book_id;
    this.queryForm = this.fb.group({
      query_text: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    console.log(this.queryForm.value);
    console.log(localStorage.getItem('user_id'))
    let fd = new FormData();
    fd.append('query_text', this.queryForm.value.query_text);
    fd.append('book_id', this.bookId);
    fd.append('user_id', localStorage.getItem('user_id'));

    this.userService.bookPermissionRequest(fd).subscribe(res => {
      console.log(res);
      this.openSnackBar('Sucess: Question has been provided.Wait for admin response.', 'ok');
    }, err => {
      console.log(err);
      this.openSnackBar('Error: ' + err.error, 'ok');
    })
    this.dialogRef.close();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}


@Component({
  selector: 'seeQuery',
  templateUrl: 'seeQuery.html',
})
export class SeeQuery {
  queryForm: any;
  bookId: string;
  queryList: Query[];

  constructor(
    public dialogRef: MatDialogRef<SeeQuery>,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    console.log(data.book_id);
    this.bookId = data.book_id;
    this.getQueries(this.bookId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getQueries(bookId) {
    this.userService.getBookRequestQuery(bookId).subscribe(res => {
      console.log(res);
      this.queryList = res;
    }, err => {
      console.log(err);
      this.openSnackBar('Error: ' + err.error, 'ok');
    })
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
