import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Author } from '../model/author';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-author',
  templateUrl: './view-author.component.html',
  styleUrls: ['./view-author.component.css']
})
export class ViewAuthorComponent implements OnInit {

  authors: Author[];
  loader = false;
  p: number = 1;
  AuthorName: string;

  constructor(
    public bookService: BookService, 
    public userService: UserService, 
    public router: Router,
    private snackBar:MatSnackBar
    ) {
   /*  this.hasEditUserPermission() */
  }

  editAuthor(authorId) {
    console.log(authorId);
    this.router.navigate(['edit-author/', authorId]);
  }

  getAllAuthor() {
    this.loader = true;
    this.bookService.getAuthor()
      .subscribe(data => {
        this.loader = false;
        this.authors = data;
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
    this.getAllAuthor();
    if (localStorage.getItem('isEditAuthor') == 'true') {
      this.userService.isEditAuthorPermission = true
    }
  }

  onAuthorSubmit() {
    let fd = new FormData();
    fd.append('author_name',this.AuthorName);
    this.searchAuthor(fd);
  } 

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchAuthor(authorName) {
    this.loader = true;
    this.bookService.searchAuthor(authorName)
      .subscribe(data => {
        this.loader = false;
        this.authors = data;
        console.log(this.authors);
      }, error => {
        this.loader = false;
        console.log(error)
        if(error.error.message)this.openSnackBar("Error: "+error.error.message, "ok")
        else this.openSnackBar("Error: "+error.error, "ok")
      });
  } 


}
