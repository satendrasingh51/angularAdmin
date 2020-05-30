import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { Observable, pipe, throwError, Observer, ObservableLike } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NewletterService {

  constructor(private http: HttpClient) { 
  }

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

subscriberlist(payload):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/subscriberList`,payload,this.httpOptionsauth()).pipe(
    map(resp=>{
     return resp
    })
  )
}
newsletterlistapi(payload):Observable<any>{
  return this.http.post(`${ENV.API_URL}/admin/newLetterList`,payload,this.httpOptionsauth()).pipe(
    map(response=>{
      return response;
    })
  )
}

deletesubscriber(userId):Observable<any>{
  return this.http.post(`${ENV.API_URL}/admin/deleteSubscriber`,{userId},this.httpOptionsauth()).pipe(
    map(response=>response)
  )
}

adminallimages(limit,page):Observable<any>{
  return this.http.post(`${ENV.API_URL}/admin/allImages`,{limit,page},this.httpOptionsauth()).pipe(
    map(resp=>resp)
  )
}

subscriberimage(email,limit,page):Observable<any>{
  return this.http.post(`${ENV.API_URL}/admin/allImagesSubscriber`,{email,limit,page},this.httpOptionsauth()).pipe(
    map(response=>{
      return response;
    })
  )
}

/********************************Below apis for sponserd Add module ***************************************** */
advertismentlists(data):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/listSponsoredAd`,data,this.httpOptionsauth()).pipe(
    map(response=>{
      return response;
    })
  )
}

viewadvertisement(id):Observable<any>{
  return this.http.get(`${ENV.API_URL}/admin/detailedSponsored?adId=${id}`,this.httpOptionsauth()).pipe(
    map(respo=>respo)
  )
}

actionadverisement(adId,action):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/actionSponsoredAd`,{adId,action},this.httpOptionsauth())
}

editadvertisement(payload):Observable<any>{
  return this.http.post<any>(`${ENV.API_URL}/admin/editSponsored`,payload,this.httpOptionsauth()).pipe(
    map(response=>response)
  )
}

/**************************export subscriberlist api ************************************************* */

/*****************||||||||||||||||||||||*************************************************************** */
}
