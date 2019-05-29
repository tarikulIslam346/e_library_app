import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAuthorize:boolean;
  isNumber:any;
  constructor(private router: Router, private userService:UserService,private route:ActivatedRoute) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      //next.data.allowedRoles.push(this.userService.userPermission);
      let url: string = state.url;
      this.isAuthorize = this.checkLogin(url);
      //console.log(localStorage.getItem('isViewUser'))
      //check all state url for permission
      if(this.isAuthorize && 
          ( /* (localStorage.getItem('isViewDashboard') == 'true' && state.url == '')||  */
            (localStorage.getItem('isViewQuery') == 'true' && state.url == '/query-show')||  
            (localStorage.getItem('isViewChangePassword') == 'true' && state.url == '/change-password')||  

            (localStorage.getItem('isEditUser') == 'true' && state.url.match(/edit-user/)) ||
            (localStorage.getItem('isAddUser') == 'true' && state.url == '/add-user')|| 
            (localStorage.getItem('isViewUser') == 'true' && state.url == '/user') ||
            (localStorage.getItem('isAddUserType') == 'true' && state.url == '/add-user-type')||
            (localStorage.getItem('isEditUserType') == 'true' &&  state.url.match(/edit-user-type/))||
            (localStorage.getItem('isViewUserType') == 'true' && state.url == '/view-user-type')||

            (localStorage.getItem('isMember') == 'true' && state.url == '/member')||
            (localStorage.getItem('isMemberRequest') == 'true' && state.url == '/view-member-request')||

            (localStorage.getItem('isBookShow') == 'true' && state.url == '/book-show')||
            (localStorage.getItem('isVideoShow') == 'true' && state.url == '/video-show')||
            (localStorage.getItem('isPptShow') == 'true' && state.url == '/ppt-show')||
            (localStorage.getItem('isIrpShow') == 'true' && state.url == '/irp-show')||
            (localStorage.getItem('isJournalShow') == 'true' && state.url == '/journal-show')||
            (localStorage.getItem('isBookCategoryShow') == 'true' && state.url == '/book-cat-view')||
            (localStorage.getItem('isBookIssueListShow') == 'true' && state.url == '/view-book-issue-list')||
            (localStorage.getItem('isBookIssue') == 'true' && state.url == '/book-issue')||
            (localStorage.getItem('isAddBook') == 'true' && state.url == '/add-book')||
            (localStorage.getItem('isEditBook') == 'true' && state.url.match(/edit-book/))||
            (localStorage.getItem('isAddBookCategory') == 'true' && state.url == '/book-cat')||
            (localStorage.getItem('isEditBookCategory') == 'true' && state.url.match(/edit-cat/))||
            (localStorage.getItem('isAddAuthor') == 'true' && state.url == '/add-author')||
            (localStorage.getItem('isEditAuthor') == 'true' && state.url.match(/edit-author/))||
            (localStorage.getItem('isViewAuthor') == 'true' && state.url.match('/view-author'))||
            (localStorage.getItem('isAddPublisher') == 'true' && state.url == '/add-publisher')||
            (localStorage.getItem('isEditPublisher') == 'true' && state.url.match(/edit-publisher/))||
            (localStorage.getItem('isViewPublisher') == 'true' && state.url.match('view-publisher'))||

            (localStorage.getItem('isAddArchive') == 'true' && state.url == '/add-archive')||
            (localStorage.getItem('isEditArchive') == 'true' && state.url.match(/edit-archive/))||
            (localStorage.getItem('isViewArchive') == 'true' && state.url == '/archive')||

            (localStorage.getItem('isViewFine') == 'true' && state.url == '/fine-show')||

            state.url == '/'
          )
        ){
        return true;
      }
  }

  checkLogin(url: string): boolean {
    if (this.userService.isLoggedIn) {//check logged in or not
      //console.log(this.userService.redirectUrl)
      return true; 
    }
    this.userService.redirectUrl = url;// Store the attempted URL for redirecting
    //console.log(this.authService.redirectUrl)
    this.router.navigate(['/login']); // Navigate to the login page with extras
    return false;
  }

}
