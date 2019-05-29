import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { BookService } from '../book.service';
import { IssueDetails } from '../model/bookIsssuDetail';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-issue-details',
  templateUrl: './view-issue-details.component.html',
  styleUrls: ['./view-issue-details.component.css']
})
export class ViewIssueDetailsComponent implements OnInit {

  IssueList: IssueDetails[];
  loader = false;
  issuNo:number;
  issueId:string[]=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bookService: BookService,
    public snackBar:MatSnackBar,
    public userService:UserService,
    ) 
    {
      console.log(this.data);
      this.issuNo = data.issueId;
      this.getIssueList(data.issueId);
      if (localStorage.getItem('isBookIssueListShow') == 'true') {
        this.userService.isBookIssueListShowPermission = true
      }
    }

  ngOnInit() {
  }

  getIssueList (issueId) {
    this.loader = true;
    this.bookService.bookIssueDetailsList(issueId).subscribe( issuedata => {
      console.log(issuedata);
      this.IssueList = issuedata;
      this.loader = false;
      this.openSnackBar("Successfully loaded","ok")
    }, err => {
      this.loader = false;
      console.log(err);
      this.openSnackBar("Error in Connection ","ok")
    });
  }

  getReturnBookId(returnCheckbox,issuId){
    console.log(returnCheckbox.checked,issuId)
    if(returnCheckbox.checked === true){
      this.issueId.push(issuId);
    }else{
      for(let i=0;i<this.issueId.length;i++){
        if(this.issueId[i] == issuId){
          this.issueId.splice(i, 1);
        }
      }
    }
    console.log(this.issueId)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  returnBook(){
    console.log("return method call");
    this.loader = true;
    this.bookService.selectedBookReturn(this.issueId).subscribe( issuedata => {
      this.loader = false;
      this.openSnackBar("Successfully loaded","ok");
      this.getIssueList( this.issuNo);
    }, err => {
      this.loader = false;
      console.log(err);
      this.openSnackBar(" "+err.error.message,"ok");
    });
  }

}
