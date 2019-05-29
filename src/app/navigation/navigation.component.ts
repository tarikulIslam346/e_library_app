import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { fileUpload } from '../commonUrl';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') myDrawer;
  user: User[];
  url = fileUpload;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    public userService: UserService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {

    this.navigationPermission();

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  logout(drawer): void {
    if(drawer.opened === true){
       drawer.toggle();
      }
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    this.userService.isLoggedIn = false;
    this.router.navigate(['login']);
    this.userService.userPermission = []; // reset user permission array
    this.resetLocalstorage(); // reset loaclstorage
    location.reload()// reload browser
  }

  ngOnInit() {
    this.userService.isLoggedIn = localStorage.getItem('token') ? true : false;
    if (this.userService.isLoggedIn) { this.getSpecificUser(); }
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getSpecificUser() {
    const id = localStorage.getItem('user_id');
    this.userService.getUser(id)
      .subscribe(data => {
        this.user = data;
      }, error => {
        console.log(error);
      });
  }

  autoHide(drawer) {
    if (this.userService.isLoggedIn) {
      drawer.toggle();
    }
  }

  navigationPermission() {
     //dashboard nav menu
  /*    if (localStorage.getItem('isViewDashboard') == 'true') {
      this.userService.isViewDashboardPermission = true
    } */
    //user
    if (localStorage.getItem('isViewUser') == 'true') {
      this.userService.isViewUserPermission = true
    }
    if (localStorage.getItem('isAddUser') == 'true') {
      this.userService.isAddUserPermission = true
    }
    if (localStorage.getItem('isViewUserType') == 'true') {
      this.userService.isViewUserTypePermission = true
    }
    if (localStorage.getItem('isAddUserType') == 'true') {
      this.userService.isAddUserTypePermission = true
    }
    // member
    if (localStorage.getItem('isMember') == 'true') {
      this.userService.isMemberPermission = true
    }
    if (localStorage.getItem('isMemberRequest') == 'true') {
      this.userService.isMemberRequestPermission = true
    }
    // books & others
    if (localStorage.getItem('isBookShow') == 'true') {
      this.userService.isBookShowPermission = true
    }
    if (localStorage.getItem('isVideoShow') == 'true') {
      this.userService.isVideoShowPermission = true
    }
    if (localStorage.getItem('isPptShow') == 'true') {
      this.userService.isPptShowPermission = true
    }
    if (localStorage.getItem('isIrpShow') == 'true') {
      this.userService.isIrpShowPermission = true
    }
    if (localStorage.getItem('isJournalShow') == 'true') {
      this.userService.isJournalShowPermission = true
    }
    if (localStorage.getItem('isBookCategoryShow') == 'true') {
      this.userService.isBookCategoryShowPermission = true
    }
    if (localStorage.getItem('isBookIssueListShow') == 'true') {
      this.userService.isBookIssueListShowPermission = true
    }
    if (localStorage.getItem('isBookIssue') == 'true') {
      this.userService.isBookIssuePermission = true
    }
    if (localStorage.getItem('isAddBook') == 'true') {
      this.userService.isAddBookPermission = true
    }
    if (localStorage.getItem('isAddAuthor') == 'true') {
      this.userService.isAddAuthorPermission = true
    }
    if (localStorage.getItem('isViewAuthor') == 'true') {
      this.userService.isAuthorShowPermission = true
    }
    if (localStorage.getItem('isAddPublisher') == 'true') {
      this.userService.isAddPublisherPermission = true
    }
    if (localStorage.getItem('isViewPublisher') == 'true') {
      this.userService.isPublisherShowPermission = true
    }
    // archive
    if (localStorage.getItem('isAddArchive') == 'true') {
      this.userService.isAddArchivePermission = true
    }
    if (localStorage.getItem('isEditArchive') == 'true') {
      this.userService.isEditArchivePermission = true
    }
    if (localStorage.getItem('isViewArchive') == 'true') {
      this.userService.isViewArchivePermission = true
    }
    //fine
    if (localStorage.getItem('isViewFine') == 'true') {
      this.userService.isViewFinePermission = true
    }
  }

  resetLocalstorage() {
    //dashboard nav menu
   /*  localStorage.setItem('isViewDashboard', 'false'); */
   localStorage.setItem('isViewQuery', 'false');
   localStorage.setItem('isViewChangePassword', 'false');
    // user nav menu
    localStorage.setItem('isViewUser', 'false');
    localStorage.setItem('isAddUser', 'false');
    localStorage.setItem('isEditUser', 'false');
    localStorage.setItem('isViewUserType', 'false');
    localStorage.setItem('isAddUserType', 'false');
    localStorage.setItem('isEditUserType', 'false')
    // member nav menu
    localStorage.setItem('isMember', 'false');
    localStorage.setItem('isMemberRequest', 'false');
    // book & others nav menu
    localStorage.setItem('isBookShow', 'false');
    localStorage.setItem('isVideoShow', 'false');
    localStorage.setItem('isPptShow', 'false');
    localStorage.setItem('isIrpShow', 'false');
    localStorage.setItem('isJournalShow', 'false');
    localStorage.setItem('isBookCategoryShow', 'false');
    localStorage.setItem('isBookIssueListShow', 'false');
    localStorage.setItem('isBookIssue', 'false');
    localStorage.setItem('isAddBook', 'false');
    localStorage.setItem('isEditBook', 'false');
    localStorage.setItem('isAddBookCategory', 'false');
    localStorage.setItem('isEditBookCategory', 'false');
    localStorage.setItem('isAddPublisher', 'false');
    localStorage.setItem('isEditPublisher', 'false');
    localStorage.setItem('isViewPublisher', 'false');
    localStorage.setItem('isAddAuthor', 'false');
    localStorage.setItem('isEditAuthor', 'false');
    localStorage.setItem('isViewAuthor', 'false');
    // archive nav menu
    localStorage.setItem('isAddArchive', 'false');
    localStorage.setItem('isEditArchive', 'false');
    localStorage.setItem('isViewArchive', 'false');
    //fine
    localStorage.setItem('isViewFine', 'false');
    localStorage.setItem('isEditFine', 'false');
  }
}
