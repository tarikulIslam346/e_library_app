import { Router } from '@angular/router';
import { BookService } from './../book.service';
import { Component, OnInit } from '@angular/core';
import { Category } from '../model/bookCategory';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-book-cat-view',
  templateUrl: './book-cat-view.component.html',
  styleUrls: ['./book-cat-view.component.css']
})
export class BookCatViewComponent implements OnInit {

  categoryDetails: Category[];
  public loader = false;

  constructor(
    private bookService: BookService,
    public router: Router,
    private userService:UserService,
    public snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    if(localStorage.getItem('isEditUserType') == 'true') {
      this.userService.isEditBookCategoryPermission = true
    }
    this.loader = true;
    this.bookService.bookCategory()
    .subscribe(data => {
      this.categoryDetails = data;
      this.loader = false;
      console.log(this.categoryDetails);
    }, error => {
      this.loader = false;
      if(error.status == 400) location.reload(true);
      console.log('Something Went Wrong');
      this.openSnackBar("Error :"+error.error, "ok")
    });
  }

  editCategory(categoryId) {
    this.router.navigate(['edit-cat/', categoryId]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
