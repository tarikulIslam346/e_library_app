import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.css']
})
export class AddPublisherComponent implements OnInit {
  publisherForm:any;
  publisherEdit: boolean;
  loader: boolean;
  publisherId: number;


  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id') !== null) { // The JavaScript (+) operator converts the string to a number
      this.publisherId = +this.route.snapshot.paramMap.get('id');
      this.publisherEdit = true;
      this.publisherForm = this.fb.group({
        publisher_name: ['', Validators.required],
      });
      this.getSpecificPublisher(this.publisherId) 
    } else {
      this.publisherForm = this.fb.group({
        publisher_name: ['', Validators.required],
      });
    }

  }

  createPublisher(publisherForm) {
    this.loader = true;
    this.bookService.createPublisher(publisherForm).subscribe(data => {
      console.log(data)
      this.openSnackBar("Success ", "ok")
      this.loader = false;
    this.router.navigate(['view-publisher']); 
    }, err => {
      this.loader = false;
      console.log(err)
      this.openSnackBar(""+ err.error.message, "ok")
    });
  }

  getSpecificPublisher(publisherId) {
    this.loader = true;
    this.bookService.getSpecificPublisher(publisherId)
      .subscribe(data => {
        console.log(data)
        this.publisherForm.patchValue({
          publisher_name: data[0].publisher_name,
        });
        this.loader = false;
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        this.openSnackBar("Error"+error.error, "ok")
        console.log(error);
      });
  }

  editPublisher(publisherForm) {
    this.loader = true;
    this.bookService.publisherUpdate(publisherForm).subscribe(data => {
      this.loader = false;
      console.log(data)
      this.openSnackBar('Successfully loaded', 'ok')
      this.router.navigate(['view-publisher']);
    }, err => {
      this.openSnackBar('Error in Connection ', "ok")
    });
  }


  onPublisherSubmit() {
    if (this.publisherEdit == true) {
      console.log(this.publisherForm.value);
      let fd = new FormData();
      fd.append('id',this.publisherId.toString())
      fd.append('publisher_name',this.publisherForm.value.publisher_name)
      this.editPublisher(fd)
    } else {
      console.log(this.publisherForm.value);
      let fd = new FormData();
      fd.append('publisher_name',this.publisherForm.value.publisher_name)
      this.createPublisher(fd);
   } 
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }


}
