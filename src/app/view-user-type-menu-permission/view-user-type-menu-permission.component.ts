import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { UserService } from '../user.service';
import { GroupPermission } from '../model/userGroupPermission';

@Component({
  selector: 'app-view-user-type-menu-permission',
  templateUrl: './view-user-type-menu-permission.component.html',
  styleUrls: ['./view-user-type-menu-permission.component.css']
})
export class ViewUserTypeMenuPermissionComponent implements OnInit {

  menuPermission:GroupPermission[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public userService: UserService,public snackBar: MatSnackBar) {
    //console.log(data.typeId)
    this.userService.getUserTypeByTypeId(data.typeId).subscribe( menuPermissionData => {
      console.log(menuPermissionData);
      this.menuPermission = menuPermissionData;
      //this.openSnackBar("Successfully loaded","ok")
    },err => {
      if(err.status == 400) location.reload(true);
      this.openSnackBar("Error in Connection:"+err.error+" Status: "+err.status,"ok")
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
