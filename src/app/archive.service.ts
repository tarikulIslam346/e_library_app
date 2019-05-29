import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { api } from './commonUrl';
import { HttpHeaders } from '@angular/common/http';
import { Archive } from './model/archive';
import { Permission } from './model/archivePermission';
@Injectable({
  providedIn: 'root'
})

export class ArchiveService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + localStorage.getItem('token')
    })
  };

  httpOptions2 = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) { }

  createArchive(data): Observable<Archive[]> {
    return this.http.post<Archive[]>(api + 'archive/create', data, this.httpOptions2);
  }

  getSpecificArchive(data): Observable<Archive[]> {
    return this.http.get<Archive[]>(api + 'archive/get_archive/'+ data, this.httpOptions);
  }

  archiveSearch(data): Observable<Archive[]> {
    return this.http.post<Archive[]>(api + 'archive/search', data,  this.httpOptions2);
  }

  archiveFilter(data): Observable<Archive[]> {
    return this.http.post<Archive[]>(api + 'archive/filter', data,  this.httpOptions2);
  }

  getArchivePermission(data): Observable<Permission[]> {
    return this.http.get<Permission[]>(api + 'archive/get_archive_permission/'+ data, this.httpOptions);
  }
  getArchivePermissionGroupWise(data1,data2): Observable<Permission[]> {
    return this.http.get<Permission[]>(api + 'archive/get_archive_permission/' + data1+'/'+data2, this.httpOptions);
  }
  editArchive(data): Observable<Archive[]>{
    return this.http.post<Archive[]>(api + 'archive/edit', data, this.httpOptions2);

  }
  
}
