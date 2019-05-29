import { Component, OnInit } from '@angular/core';
import { Publisher } from '../model/publisher';
import { BookService } from '../book.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-publisher',
  templateUrl: './view-publisher.component.html',
  styleUrls: ['./view-publisher.component.css']
})
export class ViewPublisherComponent implements OnInit {

 
  publishers: Publisher[];
  loader = false;
  p: number = 1;
  PublisherName: string;

  constructor(
    public bookService: BookService, 
    public userService: UserService, 
    public router: Router,
    private snackBar:MatSnackBar
    ) {
   /*  this.hasEditUserPermission() */
  }

  editPublisher(publisherID) {
    console.log(publisherID);
    this.router.navigate(['edit-publisher/', publisherID]);
  }

  getAllPublisher() {
    this.loader = true;
    this.bookService.getPublisher()
      .subscribe(data => {
        this.loader = false;
        this.publishers = data;
      }, error => {
        this.loader = false;
        console.log(error);
        if(error.status == 400) location.reload(true);
        if(error.error.message)this.openSnackBar("Error: "+error.error.message, "ok")
        else this.openSnackBar("Error: "+error.error, "ok")
      });
  }

/*   hasEditUserPermission() {
    if(localStorage.getItem('isEditUser') == 'true') {
      this.userService.isEditUserPermission = true
    } else {
      this.userService.isEditUserPermission = false
    }
  }  */

  ngOnInit() {
    this.getAllPublisher()
    if (localStorage.getItem('isEditPublisher') == 'true') {
      this.userService.isEditPublisherPermission = true
    }
  }

  onPublisherSubmit() {
    let fd = new FormData();
    fd.append('publisher_name',this.PublisherName);
    this.searchPublisher(fd);
  } 

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchPublisher(publisherName) {
    this.loader = true;
    this.bookService.searchPublisher(publisherName)
      .subscribe(data => {
        this.loader = false;
        this.publishers = data;
        console.log(this.publishers);
      }, error => {
        this.loader = false;
        console.log(error)
        if(error.error.message)this.openSnackBar("Error: "+error.error.message, "ok")
        else this.openSnackBar("Error: "+error.error, "ok")
      });
  } 
}
