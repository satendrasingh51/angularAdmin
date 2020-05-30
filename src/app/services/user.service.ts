import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { map, tap, catchError, } from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';
import { user_list } from '../models/user_model/user_model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  //for set header json in header 
  httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }

  users_list(limit, page, sortKey, sortOrder, searchString, status, profileVisibility, fromDate, toDate,isNotification): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/userList`, { limit, page, sortKey, sortOrder, searchString, status, profileVisibility, fromDate, toDate,isNotification}, this.httpOptions()).pipe(
      catchError(error => {
        return error;
      }), map(response => response)
    );
  }

  user_details(userId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/detailedUser`, { userId }, this.httpOptions()).pipe(
      catchError(error => {
        return error;
      }),
      map(resp => resp)
    )
  }

  block_user(userId): Observable<any> {
    return this.http.post<any>((`${ENV.API_URL}/admin/blockUser`), { userId }, this.httpOptions()).pipe(
      catchError(error => {
        return error;
      }), map(response => response)
    )
  }
  unblock_user(userId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/unBlockUser`, { userId }, this.httpOptions()).pipe(
      catchError(error => {
        return error;
      }), map(respons => respons)
    )
  }
  delete_user(userId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/deleteUser`, {userId }, this.httpOptions()).pipe(
      catchError(error => {
        return error;
      })
    )
  }
exportuserlist(payload):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/userListExport`,payload,this.httpOptions()).pipe(
    catchError(error=>{
      return error;
    }),map(resp=>resp)
  )
}

managerlist(payload):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/managerList`,payload,this.httpOptions()).pipe(
    catchError(error=>error),map(response=>response)
  )
}

delete_manager(userId):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/deleteManager`,{userId},this.httpOptions()).pipe(
      map(resp=>resp)
    )
}
blockManager(userId):Observable<any>{
  return this.http.post(`${ENV.API_URL}/admin/blockManager`,{userId},this.httpOptions()).pipe(
    map(resp=>resp)
  )
}
unblockmanager(userId):Observable<any>{
  return this.http.post(`${ENV.API_URL}/admin/unBlockManager`,{userId},this.httpOptions()).pipe(
    catchError(error=>{
      alert("please try after some time.")
      return error
    }),map(resp=>resp)
  )
}
detailedManager(userId):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/detailedManager`,{userId},this.httpOptions()).pipe(
    map(resp=>resp)
  )
}

managerlistexport(payload):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/managerListExport`,payload,this.httpOptions()).pipe(
    map(resp=>resp)
  )
}

  CreateNotification(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/createNotification`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }

  getUserGraphData(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/userGraphData`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }

  getListPlantType(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/listPlantType`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }

  getPlantLogGraph(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/plantLogGraph`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }

  getPlantlistAllCitiesByCountries(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/listAllCitiesByCountries`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }

  getPlantlistAllCountries(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/listAllCountries`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }

  getProductUsedCountList(values):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/product/productUsedCountList`,values,this.httpOptions()).pipe(
      map(response=>response)
    )
  }
}
