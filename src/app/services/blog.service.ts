import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { map, tap, catchError, } from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient, ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  httpOptionsAuth() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }
  //for application json in header 
  httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }
  getbloglist(limit, page, sortOrder, sortKey,searchString,addFromDate,addToDate,updateFromDate,updateToDate,categoryFilter): Observable<any> {
  
    return this.http.post<any>(`${ENV.API_URL}/admin/listBlog`, { limit, page, sortOrder, sortKey,searchString,addFromDate,addToDate,updateFromDate,updateToDate,categoryFilter}, this.httpOptions()).pipe(
      map(res => res),
      catchError(error => error)
    )
  }

 
  addblog(caption, description, title, categoryId, date, detail, media): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/createBlog`, { caption, description, title, categoryId, date, detail, media }, this.httpOptions()).pipe(
      map((res) => res),
      catchError(error => error)
    )
  }
  
  deleteblogapi(blogId):Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/deleteBlog`,{ blogId },this.httpOptions()).pipe(
      map(res => res),
      catchError(error=>error)
    )
  }
  // for category api 
  categorylist():Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/blogCategoryList`, {}, this.httpOptionsAuth()).pipe(
      map((res) => res)
    )
  }
 
  viewblogapi(blogId):Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/viewBlog`, {blogId}, this.httpOptions()).pipe(
      map((response)=>response),

    )
  }
  // code for update api call
  blog_update(blogId,caption,description,title,categoryId,date,detail,media):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/editBlog`,{blogId,caption,description,title,categoryId,date,detail,media},this.httpOptions()).pipe(
      map((res)=>res),
      catchError(error=>error)
    );
  }
}
