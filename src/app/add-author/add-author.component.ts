import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { BookService } from '../book.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent implements OnInit {

  AuthorForm:any;
  authorEdit: boolean;
  loader: boolean;
  authorId: number;


  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id') !== null) { // The JavaScript (+) operator converts the string to a number
      this.authorId = +this.route.snapshot.paramMap.get('id');
      this.authorEdit = true;
      this.AuthorForm = this.fb.group({
        author_name: ['', Validators.required],
      });
      this.getSpecificAuthor(this.authorId) 
    } else {
      this.AuthorForm = this.fb.group({
        author_name: ['', Validators.required],
      });
    }

  }

  createAuthor(authorForm) {
    this.loader = true;
    this.bookService.createAuthor(authorForm).subscribe(data => {
      console.log(data)
      this.openSnackBar("Success ", "ok")
      this.loader = false;
    this.router.navigate(['view-author']); 
    }, err => {
      this.loader = false;
      console.log(err)
      this.openSnackBar(""+ err.error.message, "ok")
    });
  }

  getSpecificAuthor(authorId) {
    this.loader = true;
    this.bookService.getSpecificAuthor(authorId)
      .subscribe(data => {
        console.log(data)
        this.AuthorForm.patchValue({
          author_name: data[0].author_name,
        });
        this.loader = false;
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        this.openSnackBar("Error"+error.error, "ok")
        console.log(error);
      });
  }

  editAuthor(authorForm) {
    this.loader = true;
    this.bookService.authorUpdate(authorForm).subscribe(data => {
      this.loader = false;
      console.log(data)
      this.openSnackBar('Successfully loaded', 'ok')
      this.router.navigate(['view-author']);
    }, err => {
      this.openSnackBar('Error in Connection ', "ok")
    });
  }


  onAuthorSubmit() {
    if (this.authorEdit == true) {
      console.log(this.AuthorForm.value);
      let fd = new FormData();
      fd.append('id',this.authorId.toString())
      fd.append('author_name',this.AuthorForm.value.author_name)
      this.editAuthor(fd)
    } else {
      console.log(this.AuthorForm.value);
      let fd = new FormData();
      fd.append('author_name',this.AuthorForm.value.author_name)
      this.createAuthor(fd);
   } 
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
