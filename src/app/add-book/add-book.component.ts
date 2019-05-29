import { Book } from './../model/book';
import { BookService } from './../book.service';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { UserGroup } from '../model/userGroup';
import { FormArray } from '@angular/forms';
import { Category } from '../model/bookCategory';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from '../model/bookPermission';
import { fileUpload, bookUpload } from '../commonUrl';
import { Author } from '../model/author';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
//import { Publisher } from '../model/publisher';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})

export class AddBookComponent implements OnInit {

  public imagePath: any;
  imgURL: any;
  pdfSrc: any;
  public message: string;
  url = fileUpload;
  urlofFile = bookUpload;
  bookForm: any;
  bookData: Book[];
  bookCategory: Category[];
  loader = false; // for loader
  user: UserGroup[];
  fileType: any[] = [];  // for dropdown file type
  bookId: number;
  bookEdit: boolean;
  hasfile: boolean = false;
  fileTypeId: number;
  categoryId: number;
  bookPermission: Permission[];
  check: boolean = false;
  permissionId: number[] = [];
  canViewId: number[] = [];
  canDownloadId: number[] = [];
  selectedFile: File;
  selectedImage: File;
  authors: Author[];
 // publishers: Publisher[];
  stateAuthorCtrl = new FormControl();
  //statePublisherCtrl = new FormControl();
  filteredAuthorStates: Observable<Author[]>;
 // filteredPublisherStates: Observable<Publisher[]>;
  
  constructor(private fb: FormBuilder,
    private bookService: BookService,
    private userGroup: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,) {

  }


  createBook(bookInfo) {
    this.loader = true;
    this.bookService.createBook(bookInfo).subscribe(data => {
      this.loader = false;
      this.bookData = data;
      this.openSnackBar("Success ", "ok");
      console.log(this.bookForm.value.type)
      if(this.bookForm.value.type == 1)this.router.navigate(['book-show']);
      if(this.bookForm.value.type == 2)this.router.navigate(['video-show']);
      if(this.bookForm.value.type == 3)this.router.navigate(['ppt-show']);
      if(this.bookForm.value.type == 4)this.router.navigate(['irp-show']);
      if(this.bookForm.value.type == 5)this.router.navigate(['journal-show']);
    }, err => {
      this.loader = false;
      if(err.error.accession_no && err.error.isbn_no && err.error.author)
      this.openSnackBar("Error : 1."+err.error.accession_no+" 2."+err.error.isbn_no+""+" 3."+err.error.author ,"ok,I will check it.")
      else if(err.error.accession_no){
        this.openSnackBar("Error : "+err.error.accession_no, "ok,I will check it.")
      } 
      else if(err.error.isbn_no){
        this.openSnackBar("Error : "+err.error.isbn_no, "ok,I will check it.")
      }
      else if(err.error.author){
        this.openSnackBar("Error : "+err.error.author, "ok,I will check it.")
      }else{
        this.openSnackBar("Error : "+err.error.message, "ok,I will check it.")
      }
    });
  }

 

  private _filterAuthorStates(value: string): Author[] {
    const filterAuthorValue = value.toLowerCase();
    return this.authors.filter(state => state.author_name.toLowerCase().indexOf(filterAuthorValue) === 0);
  }
 

 

  getAuthors() {
    this.loader = true;
    this.bookService.getAuthor()
      .subscribe(data => {
        console.log(data);
        this.loader = false;
        this.authors = data;
        this.filteredAuthorStates = this.stateAuthorCtrl.valueChanges
        .pipe(
          startWith(''),
          map(state => state ? this._filterAuthorStates(state) : this.authors.slice())
        );
      }, err => {
        this.loader = false;
        if(err.status == 400) location.reload(true);
        if(err.error.message)this.openSnackBar("Internal error :"+err.error.message, "ok")
        else this.openSnackBar("Error :"+err.error, "ok")
      });
  }

  // private _filterPublisherStates(value: string): Publisher[] {
  //   const filterPublisherValue = value.toLowerCase();
  //   return this.publishers.filter(state => state.publisher_name.toLowerCase().indexOf(filterPublisherValue) === 0);
  // }


  // getPublishers() {
  //   this.loader = true;
  //   this.bookService.getPublisher()
  //     .subscribe(data => {
  //       console.log(data);
  //       this.loader = false;
  //       this.publishers = data;
  //       this.filteredPublisherStates = this.statePublisherCtrl.valueChanges
  //       .pipe(
  //         startWith(''),
  //         map(state => state ? this._filterPublisherStates(state) : this.publishers.slice())
  //       );
  //     }, err => {
  //       this.loader = false;
  //       if(err.status == 400) location.reload(true);
  //       if(err.error.message)this.openSnackBar("Internal error :"+err.error.message, "ok")
  //       else this.openSnackBar("Error :"+err.error, "ok")
  //     });
  // }

  getUserGroup() {
    this.loader = true;
    this.userGroup.getUserGroup()
      .subscribe(data => {
        this.loader = false;
        this.user = data;
      }, err => {
        this.loader = false;
        if(err.status == 400) location.reload(true);
        if(err.error.message)this.openSnackBar("Internal error :"+err.error.message, "ok")
        else this.openSnackBar("Error :"+err.error, "ok")
      });
  }

  getPermission(bookId) {
    this.bookService.getBookPermission(bookId).subscribe(data => {
      this.bookPermission = data;
      if(data.length!=0){
        for (let j = 0; j < data.length; j++) {
          this.permissionId[data[j].type_id - 1] = data[j].type_id;
          if (data[j].can_view == 1) this.canViewId[data[j].type_id - 1] = data[j].type_id;
          if (data[j].can_download == 1) this.canDownloadId[data[j].type_id - 1] = data[j].type_id;
        };
        console.log(this.permissionId, this.canViewId, this.canDownloadId)
        for (let i = 0; i < data.length; i++) {
          /* this.bookForm.type_id.push(data[i].type_id); */
          this.type_id.push(this.fb.control(data[i].type_id))
          this.can_view.push(this.fb.control(data[i].can_view))
          this.can_download.push(this.fb.control(data[i].can_download))
        }
      }
  
    }, err => {
      this.loader = false;
      this.openSnackBar("Internal error: " +err.error.message, "ok")
    });
  }

  getBookCategory() {
    this.loader = true;
    this.bookService.bookCategory().subscribe(data => {
      this.bookCategory = data
      this.loader = false;
    }, err => {
      this.loader = false;
      this.openSnackBar("Internal error : " +err.error, "ok")
    })
  }

  getSpecificBook(bookId) {
    this.loader = true;
    this.bookService.getSpecificbook(bookId)
      .subscribe(data => {
        console.log(data)
        this.fileTypeId = data[0].type;
 
        if(data[0].cover_image)this.imgURL = this.url+'uploads/books/'+data[0].cover_image
        if(data[0].file){
          this.pdfSrc = this.urlofFile+''+data[0].file;
          this.hasfile = true;
        }
        let price;
        if(data[0].price) price = data[0].price;
        else price = 0;
        this.bookForm.patchValue({
          book_id: bookId,
          title: data[0].title,
          author: data[0].author,
          //publisher: data[0].publisher,
          publication_year: data[0].publication_year,
          category_id: data[0].category_id,
          description: data[0].description,
          accession_no: data[0].accession_no,
          price: price,
          edition: data[0].edition,
          no_of_copy: data[0].no_of_copy,
          shelf_no: data[0].shelf_no,
          row_no: data[0].row_no,
          type: data[0].type,
          fine: data[0].fine,
          book_url: data[0].book_url,
          isbn_no: data[0].isbn_no,
        });
        this.loader = false;
      }, error => {
        this.loader = false;
        this.openSnackBar("Internal error ", "ok")
        console.log(error);
      });
  }

  get type_id() {
    return this.bookForm.get('type_id') as FormArray;
  }

  get can_view() {
    return this.bookForm.get('can_view') as FormArray;
  }

  get can_download() {
    return this.bookForm.get('can_download') as FormArray;
  }

  addTypeId(typeId, id) {
    if (typeId.checked == true) {
      this.type_id.push(this.fb.control(id))
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_view.insert(i, this.fb.control(0))//remove from can_view
          this.can_download.insert(i, this.fb.control(0))//remove from can_download
        }
      }
    }
    if (typeId.checked == false) {
      for (let i = 0; i < this.type_id.length; i++)
        if (this.type_id.value[i] == id) {
          this.type_id.removeAt(i)//remove
          this.can_view.removeAt(i)//remove from can_view
          this.can_download.removeAt(i)//remove from can_download
        }
    }
  }

  addCanView(canView, id) {
    if (canView.checked == true) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_view.removeAt(i)//remove from can_download
          this.can_view.insert(i, this.fb.control(1))
          return;
        }
      }
    }
    if (canView.checked == false) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_view.removeAt(i)//remove from can_download
          this.can_view.insert(i, this.fb.control(0))
          break;
        }
      }
    }
  }

  addCanDownload(canDownload, id) {
    if (canDownload.checked == true) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_download.removeAt(i)//remove from can_download
          this.can_download.insert(i, this.fb.control(1))
          return;
        }
      }
    }
    if (canDownload.checked == false) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_download.removeAt(i)//remove from can_download
          this.can_download.insert(i, this.fb.control(0))
          break;
        }
      }
    }
  }

  editCanView(event, id) {
    if (event.checked == false) {//not checked
      for (let i = 0; i < this.type_id.length; i++) {      //already exist in can_download
        if (this.type_id.value[i] == id) {//search
          this.can_view.removeAt(i)
          this.can_view.insert(i, this.fb.control(0))
          break;
        }
      }
    }
    if (event.checked == true) {//checked
      for (let j = 0; j < this.type_id.length; j++) {      //already exist in can_download
        if (this.type_id.value[j] == id) {//search
          this.can_view.removeAt(j)//find + remove
          this.can_view.insert(j, this.fb.control(1))
          break;
        }
      }
    }
  }

  editCanDownload(event, id) {
    // console.log(event.checked,id,this.can_download.value)
    if (event.checked == false) {//not checked
      for (let i = 0; i < this.type_id.length; i++) {      //already exist in can_download
        if (this.type_id.value[i] == id) {//search
          this.can_download.removeAt(i)
          this.can_download.insert(i, this.fb.control(0))
          break;
        }
      }
    }
    if (event.checked == true) {//checked
      for (let j = 0; j < this.type_id.length; j++) {      //already exist in can_download
        if (this.type_id.value[j] == id) {//search
          this.can_download.removeAt(j)//find + remove
          this.can_download.insert(j, this.fb.control(1))
          break;
        }
      }
    }
    // console.log(this.can_download.value)
  }

  editTypeId(event, id, typeId) {
    // console.log(event.checked,id, typeId,this.type_id.value,this.permissionId)
    if (event.checked == false) {//not checked
      for (let i = 0; i < this.type_id.value.length; i++) {       //already added in type_id
        if (this.type_id.value[i] == id) {//search
          this.type_id.removeAt(i)//remove
          this.can_view.removeAt(i)//remove from can_view
          this.can_download.removeAt(i)//remove from can_download
          break;
        }
      }
    }
    if (event.checked == true) {//checked
      for (let j = 0; j < this.type_id.value.length; j++) {        //already added in type_id
        if (this.type_id.value[j] == id) {//search
          this.type_id.removeAt(j)
          break;
        }
      }
      // console.log(isNaN(typeId))
      if (isNaN(typeId) == false) {
        this.permissionId[typeId - 1] = typeId;//update permission id array
        this.type_id.push(this.fb.control(typeId));
      } else {
        this.type_id.push(this.fb.control(id))
      }
    }
    //  console.log(this.type_id.value,this.permissionId)
  }

  handleFileInput(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile)
  }

  handleImageInput(event) {
    this.selectedImage = <File>event.target.files[0];
    console.log(this.selectedImage);
    
  }

  ngOnInit() {
    this.getAuthors();
   // this.getPublishers();
    this.getUserGroup();
    this.getBookCategory();
    this.fileType = [
      { type_id: 1, type: 'Book' },
      { type_id: 2, type: 'Video' },
      { type_id: 3, type: 'PPT' },
      { type_id: 4, type: 'IRP' },
      { type_id: 5, type: 'Journal' }
    ];
    if (this.route.snapshot.paramMap.get('id') !== null) {// The JavaScript (+) operator converts the string to a number
      this.bookId = +this.route.snapshot.paramMap.get('id');
      console.log(this.bookId)
      this.getPermission(this.bookId);
      this.bookEdit = true;
      this.bookForm = this.fb.group({
        book_id: [''],
        title: ['', Validators.required],
        author: [''],
        //publisher: [''],
        publication_year: [''],
        cover_image: [null],
        category_id: ['', Validators.required],
        description: [''],
        accession_no: [''],
        edition: [''],
        price: [''],
        no_of_copy: [''],
        shelf_no: [''],
        row_no: [''],
        type: ['', Validators.required],
        fine: [''],
        book_url: [''],
        isbn_no: [''],
        type_id: this.fb.array([]),
        can_view: this.fb.array([]),
        can_download: this.fb.array([]),
        file: [null]
      });
      this.getSpecificBook(this.bookId);
    } else {
      this.bookForm = this.fb.group({
        title: ['', Validators.required],
        author: [''],
       // publisher: [''],
        publication_year: [''],
        cover_image: [null],
        category_id: ['', Validators.required],
        description: [''],
        accession_no: [''],
        edition: [''],
        price: [''],
        no_of_copy: [''],
        shelf_no: [''],
        row_no: [''],
        type: ['', Validators.required],
        fine: [''],
        book_url: [''],
        isbn_no: [''],
        type_id: this.fb.array([]),
        can_view: this.fb.array([]),
        can_download: this.fb.array([]),
        file: [null]
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  onSubmit() {
    if (this.bookEdit == true) {
      console.log(this.bookForm.value);
      let fd = new FormData();
      fd.append('book_id', this.bookForm.value.book_id);
      fd.append('title', this.bookForm.value.title);
      if(this.stateAuthorCtrl.value)fd.append('author', this.stateAuthorCtrl.value.toString());
      //if(this.statePublisherCtrl.value)fd.append('publisher', this.statePublisherCtrl.value.toString());
      fd.append('publication_year', this.bookForm.value.publication_year);
      fd.append('category_id', this.bookForm.value.category_id);
      fd.append('description', this.bookForm.value.description);
      fd.append('accession_no', this.bookForm.value.accession_no);
      fd.append('edition', this.bookForm.value.edition);
      fd.append('price', this.bookForm.value.price);
      if(this.bookForm.value.no_of_copy)fd.append('no_of_copy', this.bookForm.value.no_of_copy);
      fd.append('shelf_no', this.bookForm.value.shelf_no);
      fd.append('row_no', this.bookForm.value.row_no);
      fd.append('type', this.bookForm.value.type);
      fd.append('fine', this.bookForm.value.fine);
      fd.append('book_url', this.bookForm.value.book_url);
      fd.append('isbn_no', this.bookForm.value.isbn_no);
      fd.append('type_id', this.bookForm.value.type_id);
      fd.append('can_view', this.bookForm.value.can_view);
      fd.append('can_download', this.bookForm.value.can_download);
      if (this.selectedImage)fd.append('cover_image', this.selectedImage, this.selectedImage.name);
      if (this.selectedFile)fd.append('file', this.selectedFile, this.selectedFile.name);
      this.updateBook(fd);
    } else {
      console.log(this.bookForm.value);
      //console.log(this.stateAuthorCtrl.value);
      let fd = new FormData();
      fd.append('title', this.bookForm.value.title);
      if(this.stateAuthorCtrl.value)fd.append('author', this.stateAuthorCtrl.value.toString());
      //if(this.statePublisherCtrl.value)fd.append('publisher', this.statePublisherCtrl.value.toString());
      fd.append('publication_year', this.bookForm.value.publication_year);
      fd.append('category_id', this.bookForm.value.category_id);
      fd.append('description', this.bookForm.value.description);
      fd.append('accession_no', this.bookForm.value.accession_no);
      fd.append('edition', this.bookForm.value.edition);
      fd.append('price', this.bookForm.value.price);
      if(this.bookForm.value.no_of_copy)fd.append('no_of_copy', this.bookForm.value.no_of_copy);
      fd.append('shelf_no', this.bookForm.value.shelf_no);
      fd.append('row_no', this.bookForm.value.row_no);
      fd.append('type', this.bookForm.value.type);
      fd.append('fine', this.bookForm.value.fine);
      fd.append('book_url', this.bookForm.value.book_url);
      fd.append('isbn_no', this.bookForm.value.isbn_no);
      fd.append('type_id', this.bookForm.value.type_id);
      fd.append('can_view', this.bookForm.value.can_view);
      fd.append('can_download', this.bookForm.value.can_download);
      if (this.selectedFile) fd.append('file', this.selectedFile, this.selectedFile.name);
      if (this.selectedImage) fd.append('cover_image', this.selectedImage, this.selectedImage.name);
      this.createBook(fd);
    }
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  updateBook(bookInfo) {
    this.loader = true;
    this.bookService.bookUpdate(bookInfo).subscribe(data => {
      this.loader = false;
      this.bookData = data;
      this.openSnackBar("Success ", "ok");
      console.log(this.bookForm.value.type)
      if(this.bookForm.value.type == 1)this.router.navigate(['book-show']);
      if(this.bookForm.value.type == 2)this.router.navigate(['video-show']);
      if(this.bookForm.value.type == 3)this.router.navigate(['ppt-show']);
      if(this.bookForm.value.type == 4)this.router.navigate(['irp-show']);
      if(this.bookForm.value.type == 5)this.router.navigate(['journal-show']);
    }, err => {
      this.loader = false;
      if(err.error.accession_no && err.error.isbn_no && err.error.author)
      this.openSnackBar("Error : 1."+err.error.accession_no+" 2."+err.error.isbn_no+""+" 3."+err.error.author ,"ok,I will check it.")
      else if(err.error.accession_no){
        this.openSnackBar("Error : "+err.error.accession_no, "ok,I will check it.")
      } 
      else if(err.error.isbn_no){
        this.openSnackBar("Error : "+err.error.isbn_no, "ok,I will check it.")
      }
      else if(err.error.author){
        this.openSnackBar("Error : "+err.error.author, "ok,I will check it.")
      }else{
        this.openSnackBar("Error : "+err.error.message, "ok,I will check it.")
      }
    });
  }

}
