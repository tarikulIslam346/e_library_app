import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { UserService } from '../user.service';
import { Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  changePasswordForm: any;
  loader = false;

  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.changePasswordForm.value);
    if (this.changePasswordForm.value.confirm_password !== this.changePasswordForm.value.new_password) {
      this.openSnackBar('New Password & confirm password miss match ', 'ok');
    } else {
      let fd = new FormData();
      fd.append('current_password', this.changePasswordForm.value.current_password);
      fd.append('new_password', this.changePasswordForm.value.new_password);
      fd.append('confirm_password', this.changePasswordForm.value.confirm_password);
      this.userService.ChagnePassword(fd)
        .subscribe(data => {
          this.loader = false;
          this.openSnackBar('Sucessfully updated', 'ok');
        }, err => {
          this.loader = false;
          this.openSnackBar('Error ' + err.error.message, 'ok');
        });
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

}
