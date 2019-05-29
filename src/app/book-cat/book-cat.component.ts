import { BookService } from './../book.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Category } from '../model/bookCategory';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-book-cat',
  templateUrl: './book-cat.component.html',
  styleUrls: ['./book-cat.component.css']
})
export class BookCatComponent implements OnInit {

  categoryForm: any;
  categoryCreat: Category[];
  CategoryId: number;
  editCategory: boolean;
  public loader = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private bookService: BookService,
    public snackBar: MatSnackBar,) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id') !== null) { // The JavaScript (+) operator converts the string to a number
      this.CategoryId = +this.route.snapshot.paramMap.get('id');
      this.editCategory = true;
      this.categoryForm = this.fb.group({
        category_id: [''],
        title: ['', Validators.required],
        description: ['']
      });
      this.getSpecificCategory(this.CategoryId);
    } else {
      this.categoryForm = this.fb.group({
        title: ['', Validators.required],
        description: ['']
      });

    }
  }

  getSpecificCategory(CategoryId) {
    this.loader = true;
    this.bookService.getSpecificCategory(CategoryId)
      .subscribe(data => {
        this.loader = false;
        console.log('call getUser:  ' + CategoryId);
        this.categoryForm.patchValue({
          category_id: CategoryId,
          title: data[0].title,
          description: data[0].description
        });
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        this.openSnackBar("Error :"+error.error, "ok")
        console.log(error);
      });
  }

  addCategory(categoryFormvalue) {
    this.bookService.categoryCreate(categoryFormvalue).subscribe(data => {
      this.categoryCreat = data;
      this.openSnackBar("Success ", "ok");
      this.router.navigate(['book-cat-view']);
    }, error => {
      this.openSnackBar("Error :"+error.error.message, "ok")
      console.log(error);
    });
  }

  editCat(categoryFormvalue) {
    this.bookService.editCategory(categoryFormvalue).subscribe(data => {
      this.categoryCreat = data;
      this.openSnackBar("Success ", "ok");
      this.router.navigate(['book-cat-view']);
    }, error => {
      this.openSnackBar("Error :"+error.error.message, "ok")
      console.log(error);
    });
  }

  categorySubmit() {
    console.log(this.categoryForm.value);
    if (this.editCategory === true) {
      this.editCat(this.categoryForm.value);
    } else {
      this.addCategory(this.categoryForm.value);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
