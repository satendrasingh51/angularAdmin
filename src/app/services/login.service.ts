import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, tap, catchError,retry } from 'rxjs/operators';
import { environment as ENV } from '../../environments/environment';
import { Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  data;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  loggedIn: boolean = false;
  private options = {
    headers: this.headers,
  }

  constructor(
    private http: HttpClient,
  ) { }

// code of tabish
  httpOptionsAuth() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }
// end code of tabish
  // send token for api authentication
  httpAuth() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }

  private extractData(res) {
    return res || {};
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/login`, { email, password }, this.options)
      .pipe(
        map((res) => {
          return res;
        }));
  }
  //forgetPassword
  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/forgetPassword`, { email }, this.options)
      .pipe(
        map((res) => {
          return res;
        }));
  }
  //change password
  changepassword(password, oldPassword): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/changePassword`, { password, oldPassword }, this.httpOptionsAuth())
      .pipe(
        map((res) => {
          return res;
        }));
  }
  // for update profile call edit profile pai
  ediit_profile(name,profileImage):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/editProfileAdmin`,{name,profileImage},this.httpAuth()).pipe(
      tap((res)=>res),
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = ' Internet connection issue';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
      })
    )
  }
  // for reset password api
  reset_pass(password:any):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/resetPassword`,{password},this.httpAuth()).pipe(
      map((res=>res)),
      catchError(error=>error)
    )
  }
}