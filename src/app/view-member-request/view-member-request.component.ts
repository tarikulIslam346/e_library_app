import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { fileUpload, dummy } from '../commonUrl';

@Component({
  selector: 'app-view-member-request',
  templateUrl: './view-member-request.component.html',
  styleUrls: ['./view-member-request.component.css']
})
export class ViewMemberRequestComponent implements OnInit {

  users: User[];
  loader = false;
  UserName: string;
  hasUser: boolean = false;
  url = fileUpload;
  dummyUrl = dummy;

  constructor(
    private userService: UserService,
    public router: Router,
    public snackBar:MatSnackBar ) {
   /*  this.hasEditUserPermission() */
  }

  getAllUser() {
    this.loader = true;
    this.userService.getUserRequest()
      .subscribe(data => {
        this.loader = false;
        this.users = data;
        /* console.log(data.length); */
        this.hasUser = data.length === 0 ? false : true ;
/*         console.log(this.users,this.hasUser);
        this.openSnackBar("Loaded successfully", "ok") */
      }, error => {
        this.loader = false;
        console.log(error);
        if(error.status == 400) location.reload(true);
        this.openSnackBar("Internal error"+error.error, "ok")
      });
  }

  giveApproval(requestId){
    this.loader = true;
    console.log(requestId)
    this.userService.UserRegistrationApproval(requestId).subscribe(data=>{
      this.loader = false;
      this.openSnackBar("Added successfully", "ok")
      this.getAllUser();
    },err=>{
      this.loader = false;
      console.log(err);
      this.openSnackBar("Internal error"+err.error, "ok")
    });
  }

  giveRejection(requestId){
    this.loader = true;
    console.log(requestId)
    this.userService.UserRegistrationReject(requestId).subscribe(data=>{
      this.openSnackBar("Removed successfully", "ok")
      this.loader = false;
      this.getAllUser();
    },err=>{
      this.loader = false;
      console.log(err);
      this.openSnackBar("Internal error", "ok")
    });
  }

  ngOnInit() {
    this.getAllUser();
  }

  onUserSubmit() {
    this.searchUser(this.UserName);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchUser(UserName) {
    this.loader = true;
    this.userService.searchMember(UserName)
      .subscribe(data => {
        this.loader = false;
        this.users = data;
        console.log(this.users);
      }, error => {
        this.loader = false;
        console.log(error);
      });
  }


}
