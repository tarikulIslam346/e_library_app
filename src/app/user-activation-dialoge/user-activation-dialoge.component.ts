import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-activation-dialoge',
  templateUrl: './user-activation-dialoge.component.html',
  styleUrls: ['./user-activation-dialoge.component.css']
})
export class UserActivationDialogeComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

}
