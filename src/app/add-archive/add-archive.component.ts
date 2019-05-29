import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { UserGroup } from '../model/userGroup';
import { FormArray } from '@angular/forms';
import { Category } from '../model/bookCategory';
import { Archive } from '../model/archive';
import { ArchiveService } from "../archive.service";
import { DatePipe } from '@angular/common'
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/model/archivePermission';

@Component({
  selector: 'app-add-archive',
  templateUrl: './add-archive.component.html',
  styleUrls: ['./add-archive.component.css']
})
export class AddArchiveComponent implements OnInit {

  archiveForm:any;
  bookCategory: Category[];
  user: UserGroup[];
  fileType: any[] = [];
  archiveData: Archive[];
  loader: boolean;
  selectedFile: File;
  ArchiveEdit: boolean;
  ArchiveId: number;
  fileTypeId: number;
  categoryId: number;
  categorytitle: string;
  archivePermission: Permission[];
  permissionId: number[] = [];
  canViewId: number[] = [];
  canDownloadId: number[] = [];
  startDate: Date;

  constructor(
    private fb: FormBuilder,
    private archiveService: ArchiveService,
    private userGroup: UserService,
    public snackBar: MatSnackBar,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.categorytitle = 'Select  category *';
   }

  ngOnInit() {
    this.loader = true;
    this.getUserGroup();
    this.fileType = [
      { type_id: 1, type: 'IRP' },
      { type_id: 2, type: 'Training Video' },
      { type_id: 3, type: 'Social Programme' },
      { type_id: 4, type: 'Pamplates' },
      { type_id: 5, type: 'Lecture' },
      { type_id: 6, type: 'Ebook' },
    ];
    if (this.route.snapshot.paramMap.get('id') !== null) {// The JavaScript (+) operator converts the string to a number
      this.ArchiveId = +this.route.snapshot.paramMap.get('id');
      this.getPermission(this.ArchiveId);
      this.ArchiveEdit = true;
      this.archiveForm = this.fb.group({
        archive_id: [''],
        title: ['', Validators.required],
        speaker: [''],
        venue: [''],
        description: [''],
        type: [''],
        url: [''],
        start_date: [''],
        end_date: [''],
        type_id: this.fb.array([]),
        can_view: this.fb.array([]),
        can_download: this.fb.array([]),
        file: [null],
      });
      this.getArchiveById(this.ArchiveId);
    } else {
      this.archiveForm = this.fb.group({
        title: ['', Validators.required],
        speaker: [''],
        venue: [''],
        description: [''],
        type: [''],
        url: [''],
        start_date: [''],
        end_date: [''],
        type_id: this.fb.array([]),
        can_view: this.fb.array([]),
        can_download: this.fb.array([]),
        file: [null],
      });
    }
  }

  getUserGroup() {
    this.userGroup.getUserGroup()
      .subscribe(data => {
        this.user = data;
        this.loader = false;
      }, error => {
        if(error.status == 400) location.reload(true);
        this.openSnackBar('Error in connection: '+error.error, 'ok');
      });
  }


  getPermission(ArchiveId) {
    this.archiveService.getArchivePermission(ArchiveId).subscribe(data => {
      this.archivePermission = data;
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
      this.openSnackBar("Internal error :"+err, "ok")
    });
  }

  getArchiveById(ArchiveId) {
    this.loader = true;
    this.archiveService.getSpecificArchive(ArchiveId)
      .subscribe(data => {
        this.fileTypeId = data[0].type;

        this.archiveForm.patchValue({
          archive_id: ArchiveId,
          title: data[0].title,
          speaker: data[0].speaker,
          venue: data[0].venue,
          description: data[0].description,
          type: data[0].type,
          url: data[0].book_url,
          start_date: new  Date(data[0].start_date),
          end_date: new  Date(data[0].end_date),
        });
        this.loader = false;
      }, error => {
        this.loader = false;
        this.openSnackBar("Internal error "+error.error, "ok")
        console.log(error);
      });
  }

  createArchive(archiveInfo) {
    this.loader = true;
    this.archiveService.createArchive(archiveInfo).subscribe(data => {
      this.archiveData = data;
      this.openSnackBar('Succesfully ' , 'ok');
      this.loader = false;
      this.router.navigate(['archive']);
    }, err => {
      console.log(err.error.message);
      if(err.error.message)this.openSnackBar('Error :' + err.error.message, 'ok');
      else this.openSnackBar('Error :' + err.error, 'ok');
    });
  }

  get can_view() {
    return this.archiveForm.get('can_view') as FormArray;
  }

  get can_download() {
    return this.archiveForm.get('can_download') as FormArray;
  }

  get type_id() {
    return this.archiveForm.get('type_id') as FormArray;
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
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.type_id.removeAt(i); // remove
          this.can_view.removeAt(i); // remove from can_view
          this.can_download.removeAt(i); // remove from can_download
        }
      }
    }
  }

  addCanView(canView, id) {
    if (canView.checked == true) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_view.removeAt(i); // remove from can_download
          this.can_view.insert(i, this.fb.control(1));
          return;
        }
      }
    }
    if (canView.checked == false) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_view.removeAt(i); //remove from can_download
          this.can_view.insert(i, this.fb.control(0));
          break;
        }
      }
    }
  }

  addCanDownload(canDownload, id) {
    if (canDownload.checked == true) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_download.removeAt(i); // remove from can_download
          this.can_download.insert(i, this.fb.control(1))
          return;
        }
      }
    }
    if (canDownload.checked == false) {
      for (let i = 0; i < this.type_id.length; i++) {
        if (this.type_id.value[i] == id) {
          this.can_download.removeAt(i); // remove from can_download
          this.can_download.insert(i, this.fb.control(0));
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
    if (event.checked == true) {// checked
      for (let j = 0; j < this.type_id.value.length; j++) {        // already added in type_id
        if (this.type_id.value[j] == id) {// search
          this.type_id.removeAt(j)
          break;
        }
      }
      // console.log(isNaN(typeId))
      if (isNaN(typeId) == false) {
        this.permissionId[typeId - 1] = typeId; // update permission id array
        this.type_id.push(this.fb.control(typeId));
      } else {
        this.type_id.push(this.fb.control(id))
      }
    }
    //  console.log(this.type_id.value,this.permissionId)
  }

  handleFileInput(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSubmit() {
    if (this.ArchiveEdit == true) {
      console.log(this.archiveForm.value);
      let fd = new FormData();
      fd.append('archive_id', this.archiveForm.value.archive_id);
      fd.append('title', this.archiveForm.value.title);
      fd.append('speaker', this.archiveForm.value.speaker);
      fd.append('venue', this.archiveForm.value.venue);
      fd.append('description', this.archiveForm.value.description);
      fd.append('shelf_no', this.archiveForm.value.shelf_no);
      fd.append('row_no', this.archiveForm.value.row_no);
      fd.append('type', this.archiveForm.value.type);
      fd.append('fine', this.archiveForm.value.fine);
      fd.append('url', this.archiveForm.value.url);
      let start_date,end_date;
      if( this.archiveForm.value.start_date )start_date = this.archiveForm.value.start_date ? this.datepipe.transform(this.archiveForm.value.start_date.toDateString(), 'yyyy-MM-dd') : null;
      if( this.archiveForm.value.end_date )end_date = this.archiveForm.value.end_date ? this.datepipe.transform(this.archiveForm.value.end_date.toDateString(), 'yyyy-MM-dd') : null;
      if( this.archiveForm.value.start_date )fd.append('start_date', start_date);
      if( this.archiveForm.value.end_date )fd.append('end_date', end_date);
      fd.append('type_id', this.archiveForm.value.type_id);
      fd.append('can_view', this.archiveForm.value.can_view);
      fd.append('can_download', this.archiveForm.value.can_download);
      if (this.selectedFile) { fd.append('file', this.selectedFile, this.selectedFile.name); }
      this.UpdateArchive(fd);
    } else {
    console.log(this.archiveForm.value);
    let fd = new FormData();
    fd.append('title', this.archiveForm.value.title);
    fd.append('speaker', this.archiveForm.value.speaker);
    fd.append('venue', this.archiveForm.value.venue);
    fd.append('description', this.archiveForm.value.description);
    fd.append('shelf_no', this.archiveForm.value.shelf_no);
    fd.append('row_no', this.archiveForm.value.row_no);
    fd.append('type', this.archiveForm.value.type);
    fd.append('fine', this.archiveForm.value.fine);
    fd.append('url', this.archiveForm.value.url);
    let start_date,end_date;
    if( this.archiveForm.value.start_date )start_date = this.archiveForm.value.start_date ? this.datepipe.transform(this.archiveForm.value.start_date.toDateString(), 'yyyy-MM-dd') : null;
    if( this.archiveForm.value.end_date )end_date = this.archiveForm.value.end_date ? this.datepipe.transform(this.archiveForm.value.end_date.toDateString(), 'yyyy-MM-dd') : null;
    if( this.archiveForm.value.start_date )fd.append('start_date', start_date);
    if( this.archiveForm.value.end_date )fd.append('end_date', end_date);
    fd.append('type_id', this.archiveForm.value.type_id);
    fd.append('can_view', this.archiveForm.value.can_view);
    fd.append('can_download', this.archiveForm.value.can_download);
    if (this.selectedFile) { fd.append('file', this.selectedFile, this.selectedFile.name); }
    this.createArchive(fd);
    }
  }

  UpdateArchive(archiveInfo) {
    this.loader = true;
    this.archiveService.editArchive(archiveInfo).subscribe(data => {
      this.loader = false;
      this.archiveData = data;
      this.openSnackBar('Success ', 'ok');
      this.router.navigate(['archive']);
    }, err => {
      this.loader = false;
      this.openSnackBar('Error ', 'ok')
    });
  }

}
