import { BookIssueList } from './model/bookIssueList';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from './commonUrl';
import { HttpHeaders } from '@angular/common/http';
import { Book } from './model/book';
import { BookIssue } from './model/bookIssue';
import { Permission } from './model/bookPermission';
import { Category } from './model/bookCategory';
import { IssueDetails } from './model/bookIsssuDetail';
import { BookWiseUserIssuList } from './model/bookWiseUserIssuList';
import { Author } from './model/author';
import { Publisher } from './model/publisher';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  httpOptions2 = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) {}

  bookSearch(bookName,type?,page?): Observable<Book[]> {
    return this.http.post<Book[]>(api + 'book/search', { book_name: bookName,type:type,page:page},  this.httpOptions);
  }

  createBook(data): Observable<Book[]> {
    return this.http.post<Book[]>(api + 'book/create', data, this.httpOptions2);
  }

  createAuthor(data): Observable<Author[]> {
    return this.http.post<Author[]>(api + 'book/author/create', data, this.httpOptions2);
  }

  createPublisher(data): Observable<Publisher[]> {
    return this.http.post<Publisher[]>(api + 'book/publisher/create', data, this.httpOptions2);
  }

  getAuthor(): Observable<Author[]> {
    return this.http.get<Author[]>(api + 'book/author/view', this.httpOptions2);
  }

  getPublisher(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(api + 'book/publisher/view', this.httpOptions2);
  }

  getSpecificAuthor(data): Observable<Author[]> {
    return this.http.get<Author[]>(api + 'book/author/'+data, this.httpOptions2);
  }

  getSpecificPublisher(data): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(api + 'book/publisher/'+data, this.httpOptions2);
  }

  searchAuthor(data): Observable<Author[]> {
    return this.http.post<Author[]>(api + 'book/author/search',data, this.httpOptions2);
  }

  searchPublisher(data): Observable<Publisher[]> {
    return this.http.post<Publisher[]>(api + 'book/publisher/search',data, this.httpOptions2);
  }

  authorUpdate(data): Observable<Author[]> {
    return this.http.post<Author[]>(api + 'book/author/update', data, this.httpOptions2);
  }

  publisherUpdate(data): Observable<Publisher[]> {
    return this.http.post<Publisher[]>(api + 'book/publisher/update', data, this.httpOptions2);
  }

  bookUpdate(data): Observable<Book[]> {
    return this.http.post<Book[]>(api + 'book/edit', data, this.httpOptions2);
  }

  getBookPermission(data): Observable<Permission[]> {
    return this.http.get<Permission[]>(api + 'book/get_book_permission/' + data, this.httpOptions);
  }

  getGroupWiseBookPermission(data1,data2): Observable<Permission[]> {
    return this.http.get<Permission[]>(api + 'book/get_book_permission/' + data1+'/'+data2, this.httpOptions);
  }

  getSpecificbook(data): Observable<Book[]> {
    return this.http.get<Book[]>(api + 'book/get_book/' + data, this.httpOptions);
  }

  getBookIssueList(data): Observable<Book[]> {
    return this.http.get<Book[]>(api + 'book/issue_list/' + data, this.httpOptions);
  }

  bookCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(api + 'category/list', this.httpOptions);
  }

  libraryBookIssue(data): Observable<BookIssue[]> {
    return this.http.post<BookIssue[]>(api + 'book/issue', { user_id: data.user_id, book_id: data.book_id, return_date: data.return_date }, this.httpOptions);
  }

  categoryCreate(data): Observable<Category[]> {
    return this.http.post<Category[]>(api + 'category/create', JSON.stringify(data), this.httpOptions);
  }

  getSpecificCategory(data): Observable<Category[]> {
    return this.http.get<Category[]>(api + 'category/get_category/' + data, this.httpOptions);
  }

  editCategory(data): Observable<Category[]> {
    return this.http.post<Category[]>(api + 'category/update', data, this.httpOptions2);
  }

  bookIssueList(): Observable<BookIssueList[]> {
    return this.http.get<BookIssueList[]>(api + 'book/issue_list', this.httpOptions);
  }

  bookIssueListSearch(data): Observable<BookIssueList[]> {
    return this.http.post<BookIssueList[]>(api + 'book/issue_list/search', {searchData:data},  this.httpOptions);
  }

  bookIssueListFilter(data): Observable<BookIssueList[]> {
    return this.http.post<BookIssueList[]>(api + 'book/issue_list/filter', data,  this.httpOptions2);
  }

  bookIssueDetailsList(data):  Observable<IssueDetails[]> {
    return this.http.get<IssueDetails[]>(api + 'book/issue/details/'+data, this.httpOptions);
  }
  
  bookIssueWiseUserList(data):  Observable<BookWiseUserIssuList[]> {
    return this.http.get<BookWiseUserIssuList[]>(api + 'book/book_issue_list/'+data, this.httpOptions);
  }

  perticularUserBookIssuList(data):Observable<BookIssueList[]> {
    return this.http.post<BookIssueList[]>(api + 'book/user_issue_list',{user_id:data}, this.httpOptions);
  }

  bookReturn(data):Observable<BookIssueList[]>{
    return this.http.post<BookIssueList[]>(api + 'book/return',{issue_id:data}, this.httpOptions);
  }

  bookReissue(data):Observable<BookIssueList[]>{
    return this.http.post<BookIssueList[]>(api + 'book/reissue',{issue_id:data}, this.httpOptions);
  }

  selectedBookReturn(data){
    return this.http.post(api +'book/selected',{issue_id:data}, this.httpOptions);
  }



}
