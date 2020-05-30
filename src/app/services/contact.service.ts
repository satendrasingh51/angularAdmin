import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
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

  //for application json in header 
  httpOptionsauth() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }

  conatct_list(limit, page, sortOrder, sortKey, searchString, status, fromDate, toDate, userType): Observable<any> {

    return this.http.post<any>(`${ENV.API_URL}/admin/listContactUs`, { limit, page, sortOrder, sortKey, searchString, status, fromDate, toDate, userType }, this.httpOptionsauth()).pipe(
      map(resp => resp),
      catchError(error => error)
    )
  }

  request_view(contactId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/contactUsView`, { contactId }, this.httpOptionsauth()).pipe(
      map(resp => resp),
      catchError(error => {
        if (error.status === 400 || error.status === 404) {
          // handle error
        }
        return throwError(error)
      })
    )
  }

  delete_contact(contactId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/contactUsDelete`, { contactId }, this.httpOptionsauth()).pipe(
      map(resp => resp),
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
  contact_resolved(contactId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/contactUsResolved`, { contactId }, this.httpOptionsauth()).pipe(
      catchError(error => {
        return error;
      }),
      map(resp => resp)
    )
  }
  export_conact({ ...payload }): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/contactUsListExport`, { ...payload }, this.httpOptionsauth()).pipe(
      map(response => response)
    )
  }
}
