import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { fileUpload, dummy } from '../commonUrl';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UserActivationDialogeComponent } from '../user-activation-dialoge/user-activation-dialoge.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  users: User[];
  loader = false;
  UserName: string;
  url = fileUpload;
  dummyUrl = dummy;
  activationDialoge : boolean;
  p: number = 1;

  constructor(
    private userService: UserService, 
    public router: Router,
    private snackBar:MatSnackBar,
    private dialog: MatDialog,
    ) {
    this.hasEditUserPermission()
  }

  ngOnInit() {
    this.getAllUser()
  }

  editUser(userId) {
    console.log(userId);
    this.router.navigate(['edit-user/', userId]);
  }

  getAllUser() {
    this.loader = true;
    this.userService.getMembers()
      .subscribe(data => {
        this.loader = false;
        this.users = data;
        console.log(this.users);
      }, error => {
        this.loader = false;
        console.log(error);
        if(error.status == 400) location.reload(true);
        this.openSnackBar("Internal error :"+error.error, "ok")
      });
  }

  hasEditUserPermission() {
    if(localStorage.getItem('isEditUser') == 'true') {
      this.userService.isEditUserPermission = true
    } else {
      this.userService.isEditUserPermission = false
    }
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

  onUserSubmit() {
    this.searchUser(this.UserName);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openUserActivationDialog() {
    const dialogRef = this.dialog.open(UserActivationDialogeComponent, {
      // height: '100hv',
      // width: '1200px',
      // data: {
      //   filename: filename,
      //   book_id: book_id
      // },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result===true){
        this.activationDialoge = true;
      }else{
        this.activationDialoge = false;
      }
    });
  }

  memberActivation(id,activation){
    console.log(id,activation.checked)
    if(activation.checked){
      //this.openUserActivationDialog();
      console.log(this.activationDialoge)
      //if(this.activationDialoge == true){
        let fd = new FormData();
        fd.append('is_active','1');
        fd.append('user_id',id);
        this.loader = true;
        this.userService.UserActivation(fd).subscribe( data => {
        this.loader = false;
        this.openSnackBar("Activated successfully", "ok");
        this.getAllUser()
        },err => {
          this.loader = false;
          console.log(err)
          this.openSnackBar("Internal error"+err.error.message, "ok")
        })
      //}else{
       // return;
      //}

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
        this.openSnackBar("Internal error"+err.error.message, "ok")
      })
    }
  }






}
