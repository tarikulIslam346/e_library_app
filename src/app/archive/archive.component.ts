import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//import { BookPdfVieweComponent } from '../book-pdf-viewe/book-pdf-viewe.component';
import { Router } from '@angular/router';
import { ArchiveService } from '../archive.service';
import { Archive } from '../model/archive';
import { fileUpload, dummy, archiveUpload } from '../commonUrl';
import { DatePipe } from '@angular/common';
import { BookPdfVieweComponent } from '../book-pdf-viewe/book-pdf-viewe.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  loadingbook: boolean=false;
  search: string;
  archive: Archive[];
  url =archiveUpload;
  p: number = 1;
  userType:string;
  fileType: { type_id: number; type: string; }[];
  startDate:string;
  endDate:string;
  type:string;
  canView: number[] = [];
  canDownload: number[] = [];

  constructor(
    public archiveService: ArchiveService,
    public userService:UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe,
  ) {  
  this.hasEditArchivePermission();
  this.userType = localStorage.getItem('user_type');
  this.canView = [];
  this.canDownload = [];

 }

 resetArchive(){
  this.loadingbook = true;
  this.search='';
  this.archiveService.archiveSearch(this.search).subscribe(data => {
    //console.log(data);
    this.loadingbook = false;
    this.archive = data;
    //console.log(this.archive )
    for (let i = 0; i < data.length; i++) {
      //premission process if has file
        if(data[i].file)this.getPermission(data[i].archive_id)
   }
   
  }, err => {
    this.loadingbook = false;
    this.openSnackBar('Error: ' + err.error.message, 'ok');
  });
 }

  getAllArchive() {
    this.loadingbook = true;

    this.archiveService.archiveSearch(this.search).subscribe(data => {
      //console.log(data);
      this.loadingbook = false;
      this.archive = data;
      //console.log(this.archive )
      for (let i = 0; i < data.length; i++) {
        //premission process if has file
          if(data[i].file)this.getPermission(data[i].archive_id)
     }
     
    }, err => {
      this.loadingbook = false;
      if(err.status == 400) location.reload(true);
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

  getArchiveId(archiveId) {
    this.router.navigate(['edit-archive/', archiveId]);
  }

  getArchiveDetails(book_id,type) {
    this.openUserViewerDialog(book_id,type);
  }

  getPermission(book_id) {
    this.archiveService.getArchivePermissionGroupWise(book_id, localStorage.getItem('user_type')).subscribe(data => {
     // this.loadingbook = false;
      if(data[0].can_view !=undefined)this.canView[book_id] = data[0].can_view;
      if(data[0].can_download !=undefined)this.canDownload[book_id] = data[0].can_download;
    }, err => {
      console.log(err);
    });
  }

  hasEditArchivePermission() {
    if (localStorage.getItem('isEditArchive') == 'true') {
      this.userService.isEditArchivePermission = true;
    }
  }

  ngOnInit() {
    this.getAllArchive();
    this.fileType = [
      { type_id: 1, type: 'IRP' },
      { type_id: 2, type: 'Training Video' },
      { type_id: 3, type: 'Social Programme' },
      { type_id: 4, type: 'Pamplates' },
      { type_id: 5, type: 'Lecture' },
      { type_id: 6, type: 'Ebook' }
    ];
  }

  onArchiveSubmit() {
    this.searchArchive(this.search);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openUserViewerDialog(book_id,type) {
    const dialogRef = this.dialog.open(ArchiveDialog, {
      // height: '40%',
      width: '80%',
      data: { book_id: book_id, type:type },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPdfViewerDialog(filename, book_id) {
    const dialogRef = this.dialog.open(BookPdfVieweComponent, {
      height: '90%',
      width: '80%',
      data: {
        filename: filename,
        book_id: book_id,
        type:'archive',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  onFilterSubmit(){
    //console.log(this.startDate,this.endDate,this.type);
    this.startDate =this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    this.endDate =this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    let fd = new FormData();
    fd.append('start_date',this.startDate);
    fd.append('end_date',this.endDate);
    fd.append('type',this.type);

    console.log(this.startDate,this.endDate,this.type,fd);

    this.loadingbook = true;
    this.archiveService.archiveFilter(fd).subscribe(data => {
      this.loadingbook = false;
      this.archive = data;
    }, err => {
      this.loadingbook = false;
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

  searchArchive(archiveName) {
    this.loadingbook = true;
    localStorage.getItem('user_type');
    let fd = new FormData();
    fd.append('search',archiveName);
    fd.append('page',this.p.toString());
    this.archiveService.archiveSearch(fd).subscribe(data => {
      this.loadingbook = false;
      this.archive = data;
    }, err => {
      this.loadingbook = false;
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

}

@Component({
  selector: 'archive-details',
  templateUrl: 'archive-details.html',
  styleUrls: ['./archive-details.component.css']
})
export class ArchiveDialog {

  ArchiveDetails : Archive[];
  loader = false;
  url =fileUpload;
  dummyUrl= dummy;
  type:string;

  constructor
  (
    public dialogRef: MatDialogRef<ArchiveDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public archiveService: ArchiveService,
  ) {
      switch(data.type ){
        case '1': this.type = 'IRP';
                break;
        case '2': this.type = 'Training Video';
                break;
        case '3': this.type = 'Social Programme';
                break;
        case '4': this.type = 'Pamplates';
                break;
        case '5': this.type = 'Lecture';
                break;
        case '6': this.type = 'Ebook';
                break;
        default: break;
      }
      this.getSpecificArchive(data.book_id);
  }

  getSpecificArchive(bookId) {
      this.loader = true;
      this.archiveService.getSpecificArchive(bookId)
        .subscribe(data => {
          this.loader = false;

          console.log(data[0].type);
          this.ArchiveDetails = data;
        }, error => {
          this.loader = false;
          console.log(error);
        });
    }
  

}
