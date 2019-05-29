import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { fileUpload, dummy } from '../commonUrl';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  users: User[];
  loader = false;
  UserName: string;
  url = fileUpload;
  dummyUrl = dummy;
  p: number = 1;

  constructor(
    public userService: UserService, 
    public router: Router,
    private snackBar:MatSnackBar) {
    this.hasEditUserPermission()
  }

  editUser(userId) {
    console.log(userId);
    this.router.navigate(['edit-user/', userId]);
  }

  getAllUser() {
    this.loader = true;
    this.userService.getUsers()
      .subscribe(data => {
        this.loader = false;
        this.users = data;
      }, error => {
        this.loader = false;
        console.log(error)
        if(error.status == 400) location.reload(true);
        if(error.status != 400)this.openSnackBar("Error: "+error.error, "ok")
      });
  }

  hasEditUserPermission() {
    if(localStorage.getItem('isEditUser') == 'true') {
      this.userService.isEditUserPermission = true
    } else {
      this.userService.isEditUserPermission = false
    }
  }

  ngOnInit() {
    this.getAllUser()
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
    this.userService.userSearch(UserName)
      .subscribe(data => {
        this.loader = false;
        this.users = data;
        console.log(this.users);
      }, error => {
        this.loader = false;
        console.log(error)
        if(error.status == 400) location.reload(true);
        this.openSnackBar("Error: "+error.error, "ok")
      });
  }

  userActivation(id,activation){
    console.log(id,activation.checked)
    if(activation.checked){
      let fd = new FormData();
      fd.append('is_active','1');
      fd.append('user_id',id);
      this.loader = true;
      this.userService.UserActivation(fd).subscribe(data=>{
      this.loader = false;
      this.openSnackBar("Activated successfully", "ok");
      this.getAllUser()
      },err=>{
        this.loader = false;
        console.log(err)
        this.openSnackBar("Internal error"+err, "ok")
      })
    }
    if(!activation.checked){
      let fd = new FormData();
      fd.append('is_active','0');
      fd.append('user_id',id);
      this.loader = true;
      this.userService.UserActivation(fd).subscribe(data=>{
      this.loader = false;
      this.openSnackBar("Deactivated successfully", "ok");
      this.getAllUser()
      },err=>{
        this.loader = false;
        this.openSnackBar("Internal error"+err, "ok")
      })
    }
  }

}
