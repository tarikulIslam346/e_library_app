import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Query } from '../model/query';
import { fileUpload, dummy } from '../commonUrl';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-query-details',
  templateUrl: './query-details.component.html',
  styleUrls: ['./query-details.component.css']
})
export class QueryDetailsComponent implements OnInit {
  loader = false;
  query: Query[];
  url = fileUpload;
  dummyUrl = dummy;
  p:number;
  constructor(
    private userService: UserService,
    private snackBar:MatSnackBar,
  ) { }

  ngOnInit() {
    this.getAllQuery();
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
      this.openSnackBar("Internal error"+error.error, "ok")
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

}
