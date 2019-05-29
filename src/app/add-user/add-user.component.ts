import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../model/user';
import { UserGroup } from '../model/userGroup';
import { ActivatedRoute, Router } from '@angular/router';
import { fileUpload, dummy } from '../commonUrl';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  
  public imagePath: any;
  imgURL: any;
  public message: string;
  dummyUrl = dummy;
  userForm: any;
  userImage: File;
  userData: User[];
  user: User[];
  userId: number;
  userType: UserGroup[];
  loader = false; // loader
  userEdit: boolean;
  selectedFile: File;
  url = fileUpload;
  imageSource: string;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    public snackBar: MatSnackBar,
  ) {
   }

  ngOnInit() {
    this.getUserType();
    if (this.route.snapshot.paramMap.get('id') !== null) { // The JavaScript (+) operator converts the string to a number
      this.userId = +this.route.snapshot.paramMap.get('id');
      this.userEdit = true;
      this.userForm = this.fb.group({
        user_id: [''],
        f_name: ['', Validators.required],
        l_name: ['', Validators.required],
        email: ['', Validators.email],
        phone: ['', Validators.required],
        type_id: ['', Validators.required],
        course_no: [''],
        pers_no: [''],
        designation: [''],
        appt: [''],
        file: [null]
      });
      this.getSpecificUser(this.userId);
    } else {
      this.userForm = this.fb.group({
        f_name: ['', Validators.required],
        l_name: ['', Validators.required],
        email: ['', [Validators.email, Validators.required]],
        type_id: ['', Validators.required],
        course_no: [''],
        pers_no: [''],
        designation: [''],
        appt: [''],
        phone: ['', Validators.required],
        password: ['', Validators.required],
        file: [null]
      });

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



  getUserType() {
    this.loader = true;
    this.userService.getUserGroup().subscribe(data => {
      this.loader = false;
      this.userType = data;
      if(!this.userEdit)this.userType.splice(0,1);
    }, error => {
      if(error.status == 400) location.reload(true);
      this.openSnackBar("Internal error", "ok")
      console.log(error);
    });
  }

  getSpecificUser(userId) {
    this.loader = true;
    this.userService.getUser(userId)
      .subscribe(data => {
        console.log(data)
        this.loader = false;
        console.log('call getUser:  ' + userId);
        this.userForm.patchValue({
          user_id: userId,
          f_name: data[0].f_name,
          l_name: data[0].l_name,
          email: data[0].email,
          phone: data[0].phone,
          course_no: data[0].course_no,
          appt: data[0].appt,
          pers_no: data[0].pers_no,
          designation: data[0].designation,
          type_id:data[0].type_id ,
        });
        this.imageSource = data[0].user_image;
      }, error => {
        this.loader = false;
        this.openSnackBar("Internal error", "ok")
        console.log(error);
      });
  }


  handleFileInput(event) {
    this.selectedFile = <File>event.target.files[0];
    //console.log(this.selectedFile)
  }

  createUser(userForm) {
    this.loader = true;
    this.userService.createUser(userForm).subscribe(data => {
      this.loader = false;
      //this.userData = data;
      this.openSnackBar("Successfully loaded", "ok");
      this.router.navigate(['user']);
    }, error => {
      if(error.error.email)this.openSnackBar("Error "+error.error.email, "ok")
      if(error.error.phone)this.openSnackBar("Error "+error.error.phone, "ok")
      console.log(error);
    });
  }

  editUser(userForm) {
    this.loader = true;
    this.userService.editUser(userForm).subscribe(data => {
      this.loader = false;
      this.userData = data;
      this.openSnackBar("Successfully Updated user information", "ok");
      this.router.navigate(['user']);
    }, error => {
      this.loader = false;
      this.openSnackBar("Internal error", "ok")
      console.log(error);
    });
  }

  onUserSubmit() {
    if (this.userEdit === true) {
      let fd = new FormData()
      fd.append('user_id', this.userForm.value.user_id);
      fd.append('f_name', this.userForm.value.f_name);
      fd.append('l_name', this.userForm.value.l_name);
      fd.append('email', this.userForm.value.email);
      fd.append('phone', this.userForm.value.phone);
      fd.append('type_id', this.userForm.value.type_id);
      fd.append('course_no', this.userForm.value.course_no);
      fd.append('pers_no', this.userForm.value.pers_no);
      fd.append('appt', this.userForm.value.appt);
      fd.append('designation', this.userForm.value.designation);
      if (this.selectedFile) fd.append('file', this.selectedFile, this.selectedFile.name);
      this.editUser(fd)
    }
    else {
      console.log(this.userForm.value.type_id)
      let fd = new FormData()
      fd.append('f_name', this.userForm.value.f_name);
      fd.append('l_name', this.userForm.value.l_name);
      fd.append('email', this.userForm.value.email);
      fd.append('type_id', this.userForm.value.type_id);
      fd.append('course_no', this.userForm.value.course_no);
      fd.append('pers_no', this.userForm.value.pers_no);
      fd.append('appt', this.userForm.value.appt);
      fd.append('designation', this.userForm.value.designation);
      fd.append('phone', this.userForm.value.phone);
      fd.append('password', this.userForm.value.password);
      if (this.selectedFile) fd.append('file', this.selectedFile, this.selectedFile.name);
      this.createUser(fd);
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
