import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { fileUpload, dummy } from '../commonUrl';
import { UserService } from '../user.service';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Query } from '../model/query';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  loader = false;
  user: User[];
  UserName: string;
  url = fileUpload;
  totalUser: number;
  totalIssue: number;
  requestCount: number;
  timerSubscription: any;
  changePasswordForm: any;
  userType: string;
  finecount: number;
  totalFine: number;
  totalReturn: number;
  query: Query[];
  p: number = 1;
  dummyUrl = dummy;



  constructor(
    private userService: UserService,
    private bookService: BookService,
    public router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });

    this.userType = localStorage.getItem('user_type');
  }

  ngOnInit() {
    this.loader = true;
    if (this.userType === '1' ) this.getAllUser();
    this.getAllIssueList();
    this.getSpecificUser();
    if (this.userType === '1') {
      this.getAllFineList();
    }
    if (this.userType === '1') {
      this.getAllQuery();
    }
    if (this.userType === '1') {
      setInterval(() => {
        this.getallMemberRequest();
      }, 5000);
    }

  }

  getAllQuery() {
    this.userService.getallBookRequestQuery()
      .subscribe(data => {
        this.loader = false;
        this.query = data;
        console.log(data);
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        console.log(error);
        this.openSnackBar("Internal error", "ok")
      });
  }

  getAllUser() {
    this.userService.getUsers()
      .subscribe(data => {
        this.loader = false;
        this.totalUser = data.length;
        // console.log(data);
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        console.log(error);
        // this.openSnackBar("Internal error", "ok")
      });
  }
  getSpecificUser() {
    console.log(localStorage.getItem('user_id'));
    const id = localStorage.getItem('user_id');
    this.userService.getUser(id)
      .subscribe(data => {
        this.loader = false;
        this.user = data;
        console.log(data);
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        if (this.userType !== '1') location.reload();
        this.openSnackBar("" + error.error, "ok")
        console.log(error);
      });
  }

  getAllIssueList() {
    this.bookService.bookIssueList()
      .subscribe(data => {
        this.loader = false;
        this.totalReturn = 0;
        this.totalIssue = data.length;
        for (let i = 0; i < data.length; i++) {
          if (data[i].return_status === 0) this.totalReturn = this.totalReturn + 1;
        }
        //console.log(data);
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        if (this.userType !== '1') location.reload();
        this.openSnackBar("" + error.error, "ok")
        //console.log(error);
      });
  }

  getallMemberRequest() {
    this.userService.getUserRequest().subscribe(data => {
      //console.log(data);
      this.requestCount = data.length;
    }, error => {
      if(error.status == 400) location.reload(true);
      console.log(' Error occurd ' + error);
      this.openSnackBar("" + error.error, "ok")
    });

  }

  getAllFineList() {
    this.loader = true;
    this.userService.getAllFine().subscribe(finedata => {
      console.log(finedata);
      let totalfine = 0;
      for (let i = 0; i < finedata.length; i++) {
        if (finedata[i].status === 0) totalfine = totalfine + finedata[i].fine_amount;
      }
      this.loader = false;
      this.totalFine = totalfine;
      this.finecount = finedata.length;
      this.openSnackBar("Success", "ok");
    }, error => {
      this.loader = false;
      if(error.status == 400) location.reload(true);
      this.openSnackBar("Internal error", "ok")
      console.log(error);
    });
  }

  navigateUser() {
    this.router.navigate(['user']);
  }

  navigateuIssulist() {
    this.router.navigate(['view-book-issue-list']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }



}
