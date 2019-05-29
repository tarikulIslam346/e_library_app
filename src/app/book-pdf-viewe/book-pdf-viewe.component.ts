//import * as pdfjsLib from 'pdfjs-dist/build/pdf.worker.min.js';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { bookUpload, archiveUpload } from '../commonUrl';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-pdf-viewe',
  templateUrl: './book-pdf-viewe.component.html',
  styleUrls: ['./book-pdf-viewe.component.css']
})
export class BookPdfVieweComponent implements OnInit {

  urlofBookFile = bookUpload;
  urlofArchiveFile = archiveUpload;
  pdfSrc: any;
  url: string;
  page: number = 0;
  zoom: number = 0.50;
  loader: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bookService: BookService,
    public snackBar: MatSnackBar,
  ) {

    console.log(data.filename,data.book_id,data.type);
    if(data.type==='book'){
      this.pdfSrc = this.urlofBookFile+''+data.filename;
    }
    if(data.type==='archive'){
      //window.onload = () => {
     this.pdfSrc = this.urlofArchiveFile+''+data.filename;
     //pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.min.js';
      //this.pdfSrc = 'https://www.intoiit.com/library/assets/archives/1557059003_1(1).pdf ';
   
      //}
    }
  }

  ngOnInit() {
  }

}
