import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { fileUpload } from '../commonUrl';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PptDetailsComponent } from '../ppt-details/ppt-details.component';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { BookPdfVieweComponent } from '../book-pdf-viewe/book-pdf-viewe.component';

@Component({
  selector: 'app-ppt-show',
  templateUrl: './ppt-show.component.html',
  styleUrls: ['./ppt-show.component.css']
})
export class PptShowComponent implements OnInit {

  loadingbook = false;
  bookName: string;
  book: Book[];
  url = fileUpload;
  canView: number[] = [];
  canDownload: number[] = [];

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private userService:UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getAllBook();
  }

  getAllBook() {
    this.loadingbook = true;
    console.log(localStorage.getItem('user_type'));
    this.bookService.bookSearch(this.bookName,3).subscribe(data => {
      console.log(data);
      //this.loadingbook = false;
      this.book = data;
      for (let i = 0; i < data.length; i++) {
        //this.loadingbook = true
        this.getPermission(data[i].book_id)
      }
    }, err => {
      this.loadingbook = false;
      if(err.status == 400) location.reload(true);
      this.openSnackBar('Error: ' + err.error, 'ok');
    });
  }

  getBookDetails(book_id) {
    this.openUserViewerDialog(book_id);
  }

  getPPTId(BookId) {
    this.router.navigate(['edit-book/', BookId]);
  }

  getPermission(book_id) {
    this.bookService.getGroupWiseBookPermission(book_id, localStorage.getItem('user_type')).subscribe(data => {
      this.loadingbook = false
      this.canView[book_id] = data[0].can_view;
      this.canDownload[book_id] = data[0].can_download;
      // if(this.canView[book_id] && this.canDownload[book_id]) console.log('can view: '+this.canView[book_id],'can download: '+this.canDownload[book_id]);
      //console.log(this.canView,this.canDownload)
    },err=>{
      console.log(err);
    })
  }

  hasEditBookPermission() {
    if (localStorage.getItem('isEditBook') == 'true') {
      this.userService.isEditBookPermission = true;
    }
  }

  openUserViewerDialog(book_id) {
    const dialogRef = this.dialog.open(PptDetailsComponent, {
      // height: '40%',
      width: '80%',
      data: { book_id: book_id },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPdfViewerDialog(filename, book_id) {
    const dialogRef = this.dialog.open(BookPdfVieweComponent, {
      // height: '100hv',
      // width: '1200px',
      data: {
        filename: filename,
        book_id: book_id
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onPPtSubmit() {
    this.searchBook(this.bookName);
  }
  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchBook(bookName) {
    this.loadingbook = true;
    localStorage.getItem('user_type');
    this.bookService.bookSearch(bookName,3).subscribe(data => {
      this.loadingbook = false;
      this.book = data;
    }, err => {
      this.loadingbook = false;
      this.openSnackBar('Error: ' + err.error, 'ok');
    });
  }

}
