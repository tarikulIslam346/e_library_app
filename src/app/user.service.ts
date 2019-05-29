import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './model/user';
import { Fine } from './model/fine';
import { UserGroup } from './model/userGroup';
import { Member } from './model/member';
import { User_type } from './model/user-type';
import { GroupPermission } from './model/userGroupPermission';
import { Observable } from 'rxjs';
import { api } from './commonUrl';
import { HttpHeaders } from '@angular/common/http';
import {Menu} from './model/menu';
import { Query } from './model/query';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLoggedIn :boolean=false;
  isMember:boolean=false;
  loggedInUser:User[];
  redirectUrl:string;
  userPermission:string[]=[];
  //Dashboard
isViewDashboardPermission:boolean = false; 
isViewQueryShowPermission:boolean = false; 
isViewPasswordChangePermission:boolean = false; 

  //user menu
  isAddUserPermission:boolean = false;
  isEditUserPermission:boolean = false;
  isViewUserPermission:boolean = false;
  isAddUserTypePermission:boolean = false;
  isEditUserTypePermission:boolean = false;
  isViewUserTypePermission:boolean = false;
  //member menu
  isMemberPermission:boolean = false;
  isMemberRequestPermission:boolean = false;
  //book menu
  isBookShowPermission:boolean = false;
  isVideoShowPermission:boolean = false;
  isPptShowPermission:boolean = false;
  isIrpShowPermission:boolean = false;
  isJournalShowPermission:boolean = false;
  isBookCategoryShowPermission:boolean = false;
  isBookIssueListShowPermission:boolean = false;
  isBookIssuePermission:boolean = false;
  isAddBookPermission:boolean = false;
  isEditBookPermission:boolean = false;
  isAddBookCategoryPermission:boolean = false;
  isEditBookCategoryPermission:boolean = false;
  isAddAuthorPermission:boolean = false;
  isEditAuthorPermission:boolean = false;
  isAuthorShowPermission:boolean = false;
  isAddPublisherPermission:boolean = false;
  isEditPublisherPermission:boolean = false;
  isPublisherShowPermission:boolean = false;
  //archive
  isAddArchivePermission:boolean = false;
  isViewArchivePermission:boolean = false;
  isEditArchivePermission:boolean = false;
  //fine
  isViewFinePermission:boolean = false;
  isEditFinePermission:boolean = false;



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  httpOptions2 = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer' + localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(api + 'user/get_users', this.httpOptions);
  }
  
  getMembers(): Observable<User[]> {
    return this.http.get<User[]>(api + 'user/get_members', this.httpOptions);
  }

  getUserTypes(): Observable<User_type[]> {
    return this.http.get<User_type[]>(api + 'user/get_user_types', this.httpOptions);
  }

  getUserTypeByTypeId(data): Observable<GroupPermission[]> {
    return this.http.get<GroupPermission[]>(api + 'user_type/menus'+'/'+ data, this.httpOptions);
  }
  
  editUserTypeByTypeId(data): Observable<User_type[]> {
    return this.http.post<User_type[]>(api + 'userType/edit', JSON.stringify(data), this.httpOptions);
  }
 
  createUser(data): Observable<User[]> {
    return this.http.post<User[]>(api + 'user/create',data,this.httpOptions2);
  }

  editUser(data): Observable<User[]> {
    return this.http.post<User[]>(api + 'user/edit',data, this.httpOptions2);
  }

  getUser(data): Observable<User[]> {
    return this.http.get<User[]>(api + 'user/get_user' + '/' + data, this.httpOptions);
  }

  createUserType(data): Observable<User_type[]> {
    return this.http.post<User_type[]>(api + 'userType/create', JSON.stringify(data), this.httpOptions);
  }

  searchMember(data): Observable<User[]> {
    return this.http.post<User[]>(api + 'member/search', { name: data }, this.httpOptions);
  }

  getUserGroup(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(api + 'user/get_user_types', this.httpOptions);
  }

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(api + 'user/get_menus', this.httpOptions);
  }

  loginUser(data):Observable<User[]> {
    return this.http.post<User[]>(api + 'login', data, this.httpOptions2);
  }
  
  userSearch(data):Observable<User[]> {
    return this.http.post<User[]>(api + 'user/search', { name: data }, this.httpOptions);
  }

  registrationRequest(data):Observable<User[]>{
    return this.http.post<User[]>(api + 'user/registration_request', data, this.httpOptions2); 
  }
  getUserRequest():Observable<User[]>{
    return this.http.get<User[]>(api + 'user/registration_requests', this.httpOptions); 
  }

  UserRegistrationApproval(data):Observable<User[]>{
    return this.http.get<User[]>(api + 'user/registration_approval'+'/'+ data, this.httpOptions); 
  }

  UserRegistrationReject(data):Observable<User[]>{
    return this.http.get<User[]>(api + 'user/registration_reject'+'/'+ data, this.httpOptions); 
  }

  UserActivation(data){
    return this.http.post(api +'user/change_status', data, this.httpOptions2); 
  }

  FineStatusUpdate(data){
    return this.http.post(api +'member/fine/pay',  { fine_id: data }, this.httpOptions); 
  }

  ChagnePassword(data){
    return this.http.post(api +'user/password_reset',  data, this.httpOptions2); 
  }

  getAllFine():Observable<Fine[]>{
    return this.http.get<Fine[]>(api +'member/fine',  this.httpOptions); 
  }

  FineListSearch(data):Observable<Fine[]>{
    return this.http.post<Fine[]>(api +'member/fine/search',  { course_no: data }, this.httpOptions); 
  }

  bookPermissionRequest(data):Observable<Query[]>{
    return this.http.post<Query[]>(api +'user/book_permission_request',  data, this.httpOptions2); 
  }

  getBookRequestQuery(data):Observable<Query[]>{
    return this.http.get<Query[]>(api +'user/book_permission_query/'+data, this.httpOptions); 
  }
  getallBookRequestQuery():Observable<Query[]>{
    return this.http.get<Query[]>(api +'user/book_permission_query', this.httpOptions); 
  }
 
}
