import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { fileUpload } from '../commonUrl';
import { BookService } from '../book.service';
import { IssueDetails } from '../model/bookIsssuDetail';

@Component({
  selector: 'app-fine-details',
  templateUrl: './fine-details.component.html',
  styleUrls: ['./fine-details.component.css']
})
export class FineDetailsComponent implements OnInit {

  user:User[];
  url = fileUpload;
  issueBook:IssueDetails[];
  loader:boolean;
  delay:number;
  total:number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService:UserService,
    public bookService:BookService,
    public snackBar:MatSnackBar
  ) { 
      console.log(data.user_id);
      this.loader = true;
      this.delay = data.delay;
      this.total = data.total;
      this.userService.getUser(data.user_id).subscribe(userData => {
        this.user = userData;
        console.log(userData);
      }, error => {
        this.openSnackBar("Internal error", "ok")
        console.log(error);
      });
      this.bookService.bookIssueDetailsList(data.issuId).subscribe(bookData =>{
        this.loader =false;
        console.log(bookData);
        this.issueBook = bookData;
      }, error => {
        this.loader =false;
        this.openSnackBar("Internal error", "ok")
        console.log(error);
      });
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
