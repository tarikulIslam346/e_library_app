import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book';
import { fileUpload } from '../commonUrl';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { JournalDetailsComponent } from '../journal-details/journal-details.component';
import { BookPdfVieweComponent } from '../book-pdf-viewe/book-pdf-viewe.component';

@Component({
  selector: 'app-journal-show',
  templateUrl: './journal-show.component.html',
  styleUrls: ['./journal-show.component.css']
})
export class JournalShowComponent implements OnInit {

  loadingbook = false;
  book: Book[];
  bookName: string;
  url = fileUpload;
  canView: number[] = [];
  canDownload: number[] = [];

  constructor(
    private bookService: BookService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { 
    this.hasEditBookPermission();
  }

  ngOnInit() {
    this.getAllBook();
  }

  getAllBook() {
    this.loadingbook = true;
    console.log(localStorage.getItem('user_type'));
    this.bookService.bookSearch(this.bookName,5).subscribe(data => {
      console.log(data);
     // this.loadingbook = false;
      this.book = data;
      for (let i = 0; i < data.length; i++) {
        //this.loadingbook = true
        this.getPermission(data[i].book_id)
      }
    }, err => {
      this.loadingbook = false;
      if(err.status == 400) location.reload(true);
      console.log('Error: ' + err.error, 'ok');
    });
  }

  getBookDetails(book_id) {
    this.openUserViewerDialog(book_id);
  }
  
  getBookId(BookId) {
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

  onBookSubmit() {
    this.searchBook(this.bookName);
  }

  openUserViewerDialog(book_id) {
    const dialogRef = this.dialog.open(JournalDetailsComponent, {
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
  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchBook(bookName) {
    this.loadingbook = true;
    localStorage.getItem('user_type');
    this.bookService.bookSearch(bookName,5).subscribe(data => {
      this.loadingbook = false;
      this.book = data;
    }, err => {
      this.loadingbook = false;
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }


}
