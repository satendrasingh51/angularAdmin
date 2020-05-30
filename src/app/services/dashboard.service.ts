import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

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
  getdatshboarddata(fromDate, toDate): Observable<any> {
    return this.http.get(`${ENV.API_URL}/admin/adminDashboard?fromDate=${fromDate}&toDate=${toDate}`, this.httpOptionsauth()).pipe(
      catchError(error => {
        console.log("dashboard api error", error);
        return error;
      }), map(response => response)
    )
  }
 
}
