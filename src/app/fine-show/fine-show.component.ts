import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FineDetailsComponent } from '../fine-details/fine-details.component';
import { UserService } from '../user.service';
import { Fine } from '../model/fine';

@Component({
  selector: 'app-fine-show',
  templateUrl: './fine-show.component.html',
  styleUrls: ['./fine-show.component.css']
})
export class FineShowComponent implements OnInit {

  courseId: string;
  loader:boolean;
  FineList:Fine[];
  userName:string[];
  user_type:string;

  constructor(
    private dialog: MatDialog,
    public userService:UserService,
    public snackBar: MatSnackBar,
  ) { 
    this.user_type =   localStorage.getItem('user_type');
    if (localStorage.getItem('isEditFine') == 'true') {
      this.userService.isEditFinePermission = true
    }
  }

  ngOnInit() {
    this.getAllFineList();
  }


  getAllFineList(){
    this.loader = true;
    this.userService.getAllFine().subscribe(finedata => {
      //console.log(finedata[0]['user_id']);
      this.loader = false;
      this.FineList = finedata;
      this.openSnackBar("Success", "ok");
    }, error => {
      this.loader = false;
      if(error.status == 400) location.reload(true);
      this.openSnackBar("Internal error", "ok")
      console.log(error);
    });
  }


  getfineDetails(userId,issuId,delay,total) {
    this.openFineDetailsDialog(userId,issuId,delay,total);
  }

  openFineDetailsDialog(userId,issuId,delay,total) {
    const dialogRef = this.dialog.open(FineDetailsComponent, {
      // height: '40%',
      width: '90%',
      data: { 
        user_id: userId, 
        issuId: issuId, 
        delay: delay,
        total:total,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onFineShowSubmit() {
    this.searchFinelist(this.courseId)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  statusChange(fineId){
    let fd = new FormData();
    this.userService.FineStatusUpdate(fineId).subscribe(finedata => {
      this.loader = false;
      this.openSnackBar("Success", "ok");
      this.getAllFineList();
    }, error => {
      this.loader = false;
      this.openSnackBar("Error"+error.error.message, "ok")
      console.log(error);
    });
  }

  searchFinelist(searchData) {
    this.loader = true;
    localStorage.getItem('user_type');
    this.userService.FineListSearch(searchData).subscribe(data => {
      this.loader = false;
      this.FineList = data;
    }, err => {
      this.loader = false;
      this.openSnackBar('Error: ' + err.error.message, 'ok');
    });
  }

}
