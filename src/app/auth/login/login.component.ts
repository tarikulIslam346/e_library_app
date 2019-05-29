import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material';
import { PHONE } from './phone';
import { fileUpload, dummy } from '../../commonUrl';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public imagePath: any;
  imgURL: any;
  public message: string;
  loader = false;
  loginform;
  registrationRequestForm;
  phone: any;
  url = fileUpload;
  dummyUrl = dummy;
  selectedFile: File;

  constructor(
    public fb: FormBuilder,
    public userService: UserService,
    public router: Router,
    public snackBar: MatSnackBar,
  ) {
   
    this.phone = PHONE;
    /****login */
    this.loginform = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    /* Registration form  */
    this.registrationRequestForm = fb.group({
      f_name: ['', [Validators.required, Validators.maxLength(30)]],
      l_name: ['', [Validators.required, Validators.max(30)]],
      email: ['', [Validators.required, Validators.email]],
      country_code: ['', Validators.required],
      phone: ['', Validators.required],
      course_no: ['', Validators.required],
      designation: ['', [Validators.maxLength(12)]],
      dept: ['', [Validators.maxLength(12)]],
      file: [null],
    });

  }

  login() {
    this.loader = true;
    let fd = new FormData()
    fd.append('email', this.loginform.value.email);
    fd.append('password', this.loginform.value.password);
    this.userService.loginUser(fd).subscribe(data => {
      console.log(data); // get user data
      this.permissionArrayProcess(data); // retrive from permission array
      localStorage.setItem('token', data['token']); // set authoraization token in localStorage
      localStorage.setItem('user_type', data['user']['type_id']); // set typeId in localStorage
      localStorage.setItem('user_id', data['user']['id']);
      this.userService.isLoggedIn = true; // set loggied in true
      localStorage.setItem('isLoggedIn','true');
      this.loader = false;
      this.openSnackBar('Sir !Successfully logged in.Waiting for data load. ', 'ok');
      //let redirect = ''; // redirect to the dashboard
      //this.router.navigate([redirect]);
      if (this.userService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect =  '/';
 
        // Redirect the user
        this.router.navigateByUrl(redirect);
      } 
    }, err => {
      this.loader = false;
      if(err.status == 400) location.reload(true);
      this.openSnackBar('Error :'+err.error.error+' Status :'+err.statusText, 'ok');
      console.log(err);
    });
  }

  
  handleFileInput(event) {
    this.selectedFile = <File>event.target.files[0];
    //console.log(this.selectedFile)
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

  requestForRegistration() {
    console.log(this.registrationRequestForm.value);
    this.registrationRequestForm.value.phone = this.registrationRequestForm.value.country_code + this.registrationRequestForm.value.phone;
    let fd = new FormData()
    fd.append('f_name', this.registrationRequestForm.value.f_name);
    fd.append('l_name', this.registrationRequestForm.value.l_name);
    fd.append('email', this.registrationRequestForm.value.email);
    fd.append('phone', this.registrationRequestForm.value.phone);
    fd.append('course_no', this.registrationRequestForm.value.course_no);
    fd.append('designation', this.registrationRequestForm.value.designation);
    fd.append('dept', this.registrationRequestForm.value.designation);
    if (this.selectedFile) fd.append('file', this.selectedFile, this.selectedFile.name);
    console.log(this.registrationRequestForm.value);
    this.loader = true;
    this.userService.registrationRequest(fd).subscribe(userdata => {
      this.loader = false;
      this.openSnackBar('Success fully request sent. Please contact with admin', 'ok');
    }, error => {
      this.loader = false;
      if(error.error.email)this.openSnackBar("Error "+error.error.email, "ok")
      if(error.error.phone)this.openSnackBar("Error "+error.error.phone, "ok")
      console.log(error);
    });
  }

  ngOnInit() {
    // this.loader = true;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  permissionArrayProcess(data) {
    for (let i = 0; i < data['permissions'].length; i++) {
      /*******all permission****/
      console.log('Menu id : ' + data['permissions'][i].menu_id +
        '\ncan_read : ' + data['permissions'][i].can_read +
        '\ncan_write :' + data['permissions'][i].can_write)
       /************dashboard nav menu *******/
      if (data['permissions'][i].menu_id == 1) {
          if (data['permissions'][i].can_write == 1) {
            this.userService.userPermission.push('/change-password');
          }
          if (data['permissions'][i].can_read == 1 ) {

            this.userService.userPermission.push('/change-password');
          }
  
        } 
      /************user nav menu *******/
      if (data['permissions'][i].menu_id == 2) {
        if (data['permissions'][i].can_write == 1) {
          this.userService.userPermission.push('/edit-user');
          this.userService.userPermission.push('/add-user')
          this.userService.userPermission.push('/add-user-type')
          this.userService.userPermission.push('/edit-user-type')
        }
        if (data['permissions'][i].can_read == 1 && data['permissions'][i].type_id != 1) {
          this.userService.userPermission.push('/user');
          // this.userService.userPermission.push('/view-user-type')
        }

        if (data['permissions'][i].can_read == 1 && data['permissions'][i].type_id == 1) {
          this.userService.userPermission.push('/user');
          this.userService.userPermission.push('/view-user-type')
        }
      }
      /************member nav menu*******/
      if (data['permissions'][i].menu_id == 3) {
        if (data['permissions'][i].can_write == 1) {
          /*  this.userService.userPermission.push('/edit-user'); */
          this.userService.userPermission.push('/view-member-request');
          this.userService.userPermission.push('/query-show');
        }
        if (data['permissions'][i].can_read == 1) {
          this.userService.userPermission.push('/member');
        }
      }
      /************book & others nav menu*******/
      if (data['permissions'][i].menu_id == 4) {
        if (data['permissions'][i].can_write == 1) {
          this.userService.userPermission.push('/book-issue');
          this.userService.userPermission.push('/add-book');
          this.userService.userPermission.push('/edit-book');
          this.userService.userPermission.push('/book-cat');
          this.userService.userPermission.push('/edit-cat');
          this.userService.userPermission.push('/add-author');
          this.userService.userPermission.push('/edit-author');
          this.userService.userPermission.push('/add-publisher');
          this.userService.userPermission.push('/edit-publisher');
        }
        if (data['permissions'][i].can_read == 1) {
          this.userService.userPermission.push('/book-show');
          this.userService.userPermission.push('/video-show');
          this.userService.userPermission.push('/ppt-show');
          this.userService.userPermission.push('/irp-show');
          this.userService.userPermission.push('/journal-show');
          this.userService.userPermission.push('/book-cat-view');
          this.userService.userPermission.push('/view-book-issue-list');
          this.userService.userPermission.push('/view-author');
          this.userService.userPermission.push('/view-publisher');
        }
      }
      /************archive nav menu*******/
      if (data['permissions'][i].menu_id == 5) {
        if (data['permissions'][i].can_write == 1) {
          this.userService.userPermission.push('/add-archive');
          this.userService.userPermission.push('/edit-archive');
        }
        if (data['permissions'][i].can_read == 1) {
          this.userService.userPermission.push('/archive');
        }
      }
      /*********fine **********/
      if (data['permissions'][i].menu_id == 7) {
        if (data['permissions'][i].can_read == 1) {
          this.userService.userPermission.push('/fine-show');
        }
      }
      if (data['permissions'][i].menu_id == 7) {
        if (data['permissions'][i].can_write == 1) {
          this.userService.userPermission.push('/fine-show');
        }
      }
    }

    for (let i = 0; i < this.userService.userPermission.length; i++) {
      console.log(this.userService.userPermission[i] + "\n");
      // dashboard
      if (this.userService.userPermission[i] == '/query-show') {
        this.userService.isViewQueryShowPermission = true;
        localStorage.setItem('isViewQuery', 'true');

      } 
      if (this.userService.userPermission[i] == '/change-password') {
        this.userService.isViewPasswordChangePermission = true;
        localStorage.setItem('isViewChangePassword', 'true');

      } 
      //user
      if (this.userService.userPermission[i] == '/user') {
        this.userService.isViewUserPermission = true;
        localStorage.setItem('isViewUser', 'true');
      }
      if (this.userService.userPermission[i] == '/view-user-type') {
        this.userService.isViewUserTypePermission = true;
        localStorage.setItem('isViewUserType', 'true');
      }
      if (this.userService.userPermission[i] == '/add-user') {
        this.userService.isAddUserPermission = true;
        localStorage.setItem('isAddUser', 'true');
      }
      if (this.userService.userPermission[i] == '/edit-user') {
        this.userService.isEditUserPermission = true;
        localStorage.setItem('isEditUser', 'true');
      }
      if (this.userService.userPermission[i] == '/add-user-type') {
        this.userService.isAddUserTypePermission = true;
        localStorage.setItem('isAddUserType', 'true');
      }
      if (this.userService.userPermission[i] == '/edit-user-type') {
        this.userService.isEditUserTypePermission = true;
        localStorage.setItem('isEditUserType', 'true');
      }
      //member
      if (this.userService.userPermission[i] == '/member') {
        this.userService.isMemberPermission = true;
        localStorage.setItem('isMember', 'true')
      }
      if (this.userService.userPermission[i] == '/view-member-request') {
        this.userService.isMemberRequestPermission = true;
        localStorage.setItem('isMemberRequest', 'true')
      }
      //book & others
      if (this.userService.userPermission[i] == '/book-show') {
        this.userService.isBookShowPermission = true;
        localStorage.setItem('isBookShow', 'true')
      }
      if (this.userService.userPermission[i] == '/video-show') {
        this.userService.isVideoShowPermission = true;
        localStorage.setItem('isVideoShow', 'true')
      }
      if (this.userService.userPermission[i] == '/ppt-show') {
        this.userService.isPptShowPermission = true;
        localStorage.setItem('isPptShow', 'true')
      }
      if (this.userService.userPermission[i] == '/irp-show') {
        this.userService.isIrpShowPermission = true;
        localStorage.setItem('isIrpShow', 'true')
      }
      if (this.userService.userPermission[i] == '/journal-show') {
        this.userService.isJournalShowPermission = true;
        localStorage.setItem('isJournalShow', 'true')
      }
      if (this.userService.userPermission[i] == '/book-cat-view') {
        this.userService.isBookCategoryShowPermission = true;
        localStorage.setItem('isBookCategoryShow', 'true')
      }
      if (this.userService.userPermission[i] == '/view-book-issue-list') {
        this.userService.isBookIssueListShowPermission = true;
        localStorage.setItem('isBookIssueListShow', 'true')
      }
      if (this.userService.userPermission[i] == '/book-issue') {
        this.userService.isBookIssuePermission = true;
        localStorage.setItem('isBookIssue', 'true')
      }
      if (this.userService.userPermission[i] == '/add-book') {
        this.userService.isAddBookPermission = true;
        localStorage.setItem('isAddBook', 'true')
      }
      if (this.userService.userPermission[i] == '/edit-book') {
        this.userService.isEditBookPermission = true;
        localStorage.setItem('isEditBook', 'true')
      }
      if (this.userService.userPermission[i] == '/book-cat') {
        this.userService.isAddBookCategoryPermission = true;
        localStorage.setItem('isAddBookCategory', 'true')
      }
      if (this.userService.userPermission[i] == '/edit-cat') {
        this.userService.isEditBookCategoryPermission = true;
        localStorage.setItem('isEditBookCategory', 'true')
      }
      if (this.userService.userPermission[i] == '/add-author') {
        this.userService.isAddAuthorPermission = true;
        localStorage.setItem('isAddAuthor', 'true')
      }
      if (this.userService.userPermission[i] == '/edit-author') {
        this.userService.isEditAuthorPermission = true;
        localStorage.setItem('isEditAuthor', 'true')
      }
      if (this.userService.userPermission[i] == '/view-author') {
        this.userService.isAuthorShowPermission = true;
        localStorage.setItem('isViewAuthor', 'true')
      }
      if (this.userService.userPermission[i] == '/add-publisher') {
        this.userService.isAddPublisherPermission = true;
        localStorage.setItem('isAddPublisher', 'true')
      }
      if (this.userService.userPermission[i] == '/edit-publisher') {
        this.userService.isEditPublisherPermission = true;
        localStorage.setItem('isEditPublisher', 'true')
      }
      if (this.userService.userPermission[i] == '/view-publisher') {
        this.userService.isPublisherShowPermission= true;
        localStorage.setItem('isViewPublisher', 'true')
      }
      //archive
      if (this.userService.userPermission[i] == '/add-archive') {
        this.userService.isAddArchivePermission = true;
        localStorage.setItem('isAddArchive', 'true')
      }
      if (this.userService.userPermission[i] == '/edit-archive') {
        this.userService.isEditArchivePermission = true;
        localStorage.setItem('isEditArchive', 'true')
      }
      if (this.userService.userPermission[i] == '/archive') {
        this.userService.isViewArchivePermission = true;
        localStorage.setItem('isViewArchive', 'true')
      }
      //fine
      if (this.userService.userPermission[i] == '/fine-show') {
        this.userService.isViewFinePermission = true;
        localStorage.setItem('isViewFine', 'true')
      }
      if (this.userService.userPermission[i] == '/fine-show') {
        this.userService.isEditFinePermission = true;
        localStorage.setItem('isEditFine', 'true')
      }

    }
  }
}
