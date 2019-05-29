import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User_type } from '../model/user-type';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ViewUserTypeMenuPermissionComponent } from '../view-user-type-menu-permission/view-user-type-menu-permission.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-user-type',
  templateUrl: './view-user-type.component.html',
  styleUrls: ['./view-user-type.component.css']
})
export class ViewUserTypeComponent implements OnInit {

  loader = false;
  userTypes: User_type[];

  constructor(
    public userService: UserService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.getAllUserTypes();
    if (localStorage.getItem('isEditUserType') == 'true') {
      this.userService.isEditUserTypePermission = true
    }
  }

  editUserGroup(typeId, typeName) {
    console.log(typeId, typeName);
    this.router.navigate(['edit-user-type/', typeId, typeName]);
  }

  getAllUserTypes() {
    this.loader = true;
    this.userService.getUserTypes().subscribe(data => {
      this.loader = false;
      console.log(data);
      this.userTypes = data;
      this.userTypes.splice(0,1);
      this.openSnackBar("Successfully loaded", "ok")
    }, err => {
      this.loader = false;
      console.log(err);
      if(err.status == 400) location.reload(true);
      this.openSnackBar("Error in Connection ", "ok")
    });
  }

  openMenuPermissionDialog(typeId) {
    const dialogRef = this.dialog.open(ViewUserTypeMenuPermissionComponent, {
      data: { typeId: typeId },
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

}
