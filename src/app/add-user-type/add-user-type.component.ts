import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from "../user.service";
import { User_type } from "../model/user-type";
import { Menu } from '../model/menu';
import { GroupPermission } from '../model/userGroupPermission';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-add-user-type',
  templateUrl: './add-user-type.component.html',
  styleUrls: ['./add-user-type.component.css']
})
export class AddUserTypeComponent implements OnInit {

  userTypeForm;
  userTypeId: number;
  userTypeEdit: boolean;
  userTypeData: User_type[];
  userTypeMenuPermissionData: GroupPermission[];
  menus: Menu[];
  loader: boolean;
  permissionId: number[] = [];
  canReadId: number[] = [];
  canWriteId: number[] = [];

  constructor(
    private fb: FormBuilder,
    private userTypeCreate: UserService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.getMenus();
    if (this.route.snapshot.paramMap.get('id') !== null) { // The JavaScript (+) operator converts the string to a number
      this.userTypeId = +this.route.snapshot.paramMap.get('id');
      this.userTypeEdit = true;
      this.userTypeForm = this.fb.group({
        u_type: ['', Validators.required],
        type_id: [0],
        menu_id: this.fb.array([]),
        read: this.fb.array([]),
        write: this.fb.array([]),
      });
      this.getSpecificUserGroup(this.userTypeId)
    } else {
      this.userTypeForm = this.fb.group({
        u_type: ['', Validators.required],
        menu_id: this.fb.array([]),
        read: this.fb.array([]),
        write: this.fb.array([]),
      });
    }

  }

  createUserType(userTypeForm) {
    this.loader = true;
    this.userTypeCreate.createUserType(userTypeForm).subscribe(data => {
      this.userTypeData = data;
      console.log(data)
      this.openSnackBar("Success ", "ok")
      this.loader = false;
      this.router.navigate(['view-user-type']);
    }, err => {
      this.loader = false;
      console.log(err)
      this.openSnackBar(""+ err.error.message, "ok")
    });
  }

  editUserType(userTypeForm) {
    this.loader = true;
    this.userTypeCreate.editUserTypeByTypeId(userTypeForm).subscribe(data => {
      this.loader = false;
      this.userTypeData = data;
      console.log(data)
      this.openSnackBar('Successfully loaded', 'ok')
      this.router.navigate(['view-user-type']);
    }, err => {
      this.openSnackBar('Error in Connection : '+err.error, "ok")
    });
  }

  getSpecificUserGroup(typeId) {
    console.log(typeId)
    this.loader = true;
    this.userTypeCreate.getUserTypeByTypeId(typeId)
      .subscribe(data => {
        this.loader = false;
        this.userTypeMenuPermissionData = data;
        console.log(data);
        for (let j = 0; j < data.length; j++) {
          this.permissionId[data[j].menu_id - 1] = data[j].menu_id;
          if (data[j].can_read == 1) this.canReadId[data[j].menu_id - 1] = data[j].menu_id;
          if (data[j].can_write == 1) this.canWriteId[data[j].menu_id - 1] = data[j].menu_id;
        }
        console.log(this.permissionId, this.canReadId, this.canWriteId)
        for (let i = 0; i < data.length; i++) {
          this.menu_id.push(this.fb.control(data[i].menu_id))
          this.read.push(this.fb.control(data[i].can_read))
          this.write.push(this.fb.control(data[i].can_write))
        }
        this.userTypeForm.patchValue({
          u_type: this.route.snapshot.paramMap.get('name'),
          type_id: this.route.snapshot.paramMap.get('id'),
        });
      }, error => {
        this.loader = false;
        if(error.status == 400) location.reload(true);
        this.openSnackBar('Error in Connection : '+error.error, "ok")
        console.log(error);
      });
  }

  getMenus() {
    this.loader = true;
    this.userTypeCreate.getMenus()
      .subscribe(data => {
        this.menus = data;
        this.loader = false;
        //console.log(this.menus);
      }, err => {
        if(err.status == 400) location.reload(true);
        this.openSnackBar('Error in Connection : '+err.error, "ok")
      });
  }

  get menu_id() {
    return this.userTypeForm.get('menu_id') as FormArray;
  }

  get read() {
    return this.userTypeForm.get('read') as FormArray;
  }

  get write() {
    return this.userTypeForm.get('write') as FormArray;
  }

  addMenuId(menuPermission, id) {
    if (menuPermission.checked == true) {
      this.menu_id.push(this.fb.control(id))
      for (let i = 0; i < this.menu_id.length; i++) {
        if (this.menu_id.value[i] == id) {
          this.read.insert(i, this.fb.control(0))//remove from read
          this.write.insert(i, this.fb.control(0))//remove from write
        }
      }
    }
    if (menuPermission.checked == false) {
      for (let i = 0; i < this.menu_id.length; i++)
        if (this.menu_id.value[i] == id) {
          this.menu_id.removeAt(i)//remove
          this.read.removeAt(i)//remove from read
          this.write.removeAt(i)//remove from write
        }
    }
  }

  addCanRead(canRead, id) {
    if (canRead.checked == true) {
      for (let i = 0; i < this.menu_id.length; i++) {
        if (this.menu_id.value[i] == id) {
          this.read.removeAt(i)//remove from write
          this.read.insert(i, this.fb.control(1))
          return;
        }
      }
    }
    if (canRead.checked == false) {
      for (let i = 0; i < this.menu_id.length; i++) {
        if (this.menu_id.value[i] == id) {
          this.read.removeAt(i)//remove from read
          this.read.insert(i, this.fb.control(0))
          break;
        }
      }
    }
  }

  addCanWrite(canWrite, id) {
    if (canWrite.checked == true) {
      for (let i = 0; i < this.menu_id.length; i++) {
        if (this.menu_id.value[i] == id) {
          this.write.removeAt(i)//remove from write
          this.write.insert(i, this.fb.control(1))
          return;
        }
      }
    }
    if (canWrite.checked == false) {
      for (let i = 0; i < this.menu_id.length; i++) {
        if (this.menu_id.value[i] == id) {
          this.write.removeAt(i)//remove from write
          this.write.insert(i, this.fb.control(0))
          break;
        }
      }
    }
  }

  editMenuId(event, id, menuId, read, write) {
    // console.log(event.checked,id, typeId,this.menu_id.value,this.permissionId)
    if (event.checked == false) {//not checked
      for (let i = 0; i < this.menu_id.value.length; i++) {       //already added in menu_id
        if (this.menu_id.value[i] == id) {//search
          this.menu_id.removeAt(i)//remove
          this.read.removeAt(i)//remove from read
          this.write.removeAt(i)//remove from write
          break;
        }
      }
    }
    if (event.checked == true) {//checked
      for (let j = 0; j < this.menu_id.value.length; j++) {        //already added in type_id
        if (this.menu_id.value[j] == id) {//search
          this.menu_id.removeAt(j)
          break;
        }
      }
      // console.log(isNaN(typeId))
      if (isNaN(menuId) == false) {//if menuId is a number
        this.permissionId[menuId - 1] = menuId;//update permission id array
        this.menu_id.push(this.fb.control(menuId));
        console.log(read.checked, write.checked)
        if (read.checked == true) this.read.push(this.fb.control(1))
        else {
          this.read.push(this.fb.control(0))
        }
        if (write.checked == true) this.write.push(this.fb.control(1))
        else {
          this.write.push(this.fb.control(0))
        }
      } else {
        this.menu_id.push(this.fb.control(id))
      }
    }
    //  console.log(this.type_id.value,this.permissionId)
  }

  editCanRead(event, id) {
    if (event.checked == false) {//not checked
      for (let i = 0; i < this.menu_id.length; i++) {      //already exist in read
        if (this.menu_id.value[i] == id) {//search
          this.read.removeAt(i)
          this.read.insert(i, this.fb.control(0))
          break;
        }
      }
    }
    if (event.checked == true) {//checked
      for (let j = 0; j < this.menu_id.length; j++) {      //already exist in read
        if (this.menu_id.value[j] == id) {//search
          this.read.removeAt(j)//find + remove
          this.read.insert(j, this.fb.control(1))
          break;
        }
      }
    }
  }

  editCanWrite(event, id) {
    if (event.checked == false) {//not checked
      for (let i = 0; i < this.menu_id.length; i++) {      //already exist in write
        if (this.menu_id.value[i] == id) {//search
          this.write.removeAt(i)
          this.write.insert(i, this.fb.control(0))
          break;
        }
      }
    }
    if (event.checked == true) {//checked
      for (let j = 0; j < this.menu_id.length; j++) {      //already exist in write
        if (this.menu_id.value[j] == id) {//search
          this.write.removeAt(j)//find + remove
          this.write.insert(j, this.fb.control(1))
          break;
        }
      }
    }
  }

  onSubmit() {
    if (this.userTypeEdit == true) {
      console.log(this.userTypeForm.value);
      this.editUserType(this.userTypeForm.value)
    } else {
      console.log(this.userTypeForm.value);
      this.createUserType(this.userTypeForm.value);
    }
    //console.log(this.userTypeForm.value);
    //this.createUserType(this.userTypeForm.value);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
