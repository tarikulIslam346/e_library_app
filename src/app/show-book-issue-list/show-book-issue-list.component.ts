import { BookIssueList } from './../model/bookIssueList';
import { Component, OnInit} from '@angular/core';
import { BookService } from '../book.service';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { ViewIssueDetailsComponent } from '../view-issue-details/view-issue-details.component';
import { UserService } from '../user.service';
import { dummy } from '../commonUrl';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show-book-issue-list',
  templateUrl: './show-book-issue-list.component.html',
  styleUrls: ['./show-book-issue-list.component.css']
})
export class ShowBookIssueListComponent implements OnInit {

  issueList: BookIssueList[];
  public loader = false;
  url = dummy;
  userName: string;
  startDate:string;
  endDate:string;
  userType: string;

  constructor(
    private bookService: BookService,
    private userService: UserService,
    private dialog:MatDialog,
    public snackBar:MatSnackBar,
    public datepipe: DatePipe,
    ) { }

  ngOnInit() {
    this.loader = true;
     this.getissuList();
     this.userType = localStorage.getItem('user_type');
     if (localStorage.getItem('isBookIssueListShow') == 'true') {
      this.userService.isBookIssueListShowPermission = true
    }
  }
  
  getissuList(){
    this.bookService.bookIssueList()
    .subscribe(data => {
      this.loader = false;
      this.issueList = data;
      this.openSnackBar("Successfully loaded","ok")
      console.log(this.issueList);
    }, error => {
      this.loader = false;
      console.log(error);
      if(error.status == 400) location.reload(true);
      this.openSnackBar("Error in Connection: "+error.error,"ok")
    });
  }

  getIssueDetails(issueId) {
    const dialogRef = this.dialog.open( ViewIssueDetailsComponent,{
      data:{issueId:issueId},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  onUserSubmit() {
    this.searchIssue(this.userName);
  }

  onFilterSubmit() {
    console.log(this.startDate,this.endDate);
    this.startDate =this.datepipe.transform(this.startDate, 'yyyy-MM-dd');
    this.endDate =this.datepipe.transform(this.endDate, 'yyyy-MM-dd');
    let fd = new FormData();
    fd.append('start_date',this.startDate);
    fd.append('end_date',this.endDate);
    console.log(fd);

    this.bookService.bookIssueListFilter(fd).subscribe(data => {
      this.loader = false;
      this.issueList = data;
    }, err => {
      this.loader = false;
      this.openSnackBar('Error: ' + err.error, 'ok');
    });

  }

  returnBook(issuId){
    console.log(issuId);
    this.bookService.bookReturn(issuId).subscribe(data=>{
      this.openSnackBar("Successfully returned","ok");
      this.getissuList();
    },err=>{
      this.loader = false;
      console.log(err);
      this.openSnackBar(" "+err.error.message,"ok")
    })
  }

  openDialog(issuId){
    const dialogRef = this.dialog.open(ReissueDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

          this.bookService.bookReissue(issuId).subscribe( data => {
            this.openSnackBar("Successfully reissue","ok");
            this.getissuList();
          },err => {
            this.loader = false;
            console.log(err);
            this.openSnackBar(" "+err.error.message,"ok");
          });
      

    });
  }

  reissueBook(issuId){
    console.log(issuId)
    this.openDialog(issuId);
  }

  resetIssueList(){
    this.getissuList();
  }

  searchIssue(searchData) {
    this.loader = true;
    this.bookService.bookIssueListSearch(searchData).subscribe(data => {
      this.loader = false;
      this.issueList = data;
    }, err => {
      this.loader = false;
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

}

@Component({
  selector: 'reissueDialoge',
  templateUrl: 'reissueDialoge.html',
})
export class ReissueDialog {

  constructor(
    public dialogRef: MatDialogRef<ReissueDialog>
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
