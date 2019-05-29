import { ActivatedRoute, Router } from '@angular/router';
import { Category } from './../model/bookCategory';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-book-category',
  templateUrl: './book-category.component.html',
  styleUrls: ['./book-category.component.css']
})
export class BookCategoryComponent implements OnInit {

  categoryForm:any;
  loader:boolean; // for loader
  bookCategory: Category[];
 /*  SingleBookCategory: Category[]; */
  categoryName: string;
  categoryMake: boolean;
  categoryEdit: boolean;
  categoryId: number;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute, 
    private router: Router,
    public snackBar: MatSnackBar
    ) {
    this.categoryMake=true;
    this.categoryEdit = false;
    if(this.categoryMake==true){
      this.categoryForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
    }
    this.loader= false;
    this.loadCategory();
  }

  ngOnInit() {}

  loadCategory() {
    this.loader = true;
    this.bookService.bookCategory()
      .subscribe(data => {
        this.bookCategory = data;
        this.loader = false;
      }, error => {
        if(error.status == 400) location.reload(true);
        this.loader = false;
        console.log(error);
      });
  }

  categoryCreate(categoryForm) {
    this.loader =  true;
    this.bookService.categoryCreate(categoryForm).subscribe(data => {
      this.bookCategory = data;
      this.openSnackBar("Success ", "ok");
      this.loadCategory();
      this.categoryForm.patchValue({
        title: '',
        description: ''
      });
      this.loader = false;
    }, err => {
      this.openSnackBar("Error :"+err.error.message, "ok")
      this.loader = false;
    });
  }

  getSpecificCategory(categoryId) {
    this.categoryMake = false;
    this.categoryEdit = true;
    this.loader = true;
    this.categoryForm = this.fb.group({
      category_id: [''],
      title: [''],
      description: ['']
    });
    this.bookService.getSpecificCategory(categoryId).subscribe(data => {
      this.loader = false;
      this.categoryMake = false;
      this.categoryEdit = true;
      this.bookCategory = data;
      this.categoryForm.patchValue({
        category_id: categoryId,
        title: data[0].title,
        description: data[0].description
      });
      this.openSnackBar("Success ", "ok");
      console.log(data);
    }, error => {
      this.loader = false;
      this.openSnackBar("Error :"+error.error.message, "ok")
      console.log(error);
    });
  }

  editCategory(categoryForm) {
    this.loader = true;
    this.bookService.editCategory(categoryForm).subscribe(data => {
      this.bookCategory = data;
      this.loadCategory();
      this.categoryEdit = false;
      this.categoryMake = true;
      this.loader = false;
      this.openSnackBar("Success ", "ok");
      this.categoryForm = this.fb.group({
        title: ['', Validators.required],
        description: ['']
      });

    }, err => {
      this.loader = false;
      this.openSnackBar("Error :"+err.error.message, "ok")
    });
  }

  onCategorySubmit() {
    if (this.categoryEdit === true) {
      this.editCategory(this.categoryForm.value)
    } else {
      this.categoryCreate(this.categoryForm.value);
    }
   }

  
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
