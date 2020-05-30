import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment as ENV } from '../../environments/environment';
import { map, tap, catchError, } from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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
  httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
        'accessToken': sessionStorage.getItem('accessToken')
      })
    };
  }

  pr_category(): Observable<any> {
    return this.http.get<any>(`${ENV.API_URL}/product/productCategoryList`, this.httpOptions()).pipe(
      tap(resp => resp),
      catchError(error => error)
    )
  }
  // subcategory
  sub_category(categoryId): Observable<any> {
    return this.http.get<any>(`${ENV.API_URL}/product/productSubCategoryList?categoryId=${categoryId}`, this.httpOptions()).pipe(
      map(res => res),
      catchError(error => error),
    )
  }
  product_add(name, brand, directionOfUse, categoryId, subCategoryId, date, description, media, logoUrl): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/product/createProduct`, { name, brand, directionOfUse, categoryId, subCategoryId, date, description, media, logoUrl }, this.httpOptions()).pipe(
      map(resp => resp),
      catchError(error => error)
    )

  }
  product_list(limit, page, sortOrder, sortKey, searchString, category, fromDate, toDate,): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/product/listProduct`, { limit, page, sortOrder, sortKey, searchString, category, fromDate, toDate }, this.httpOptions()).pipe(
      tap(resp => resp),
      catchError(error => error)
    )
  }
  view_product(productId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/product/viewProduct`, { productId }, this.httpOptions()).pipe(
      map(res => res),
      catchError(error => error)
    )
  }
  delete_product(productId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/product/deleteProduct`, { productId }, this.httpOptions()).pipe(
      tap(resp => resp),
      catchError(error => error)
    )
  }

  edit_procut_api(productId, name, brand, directionOfUse, categoryId, subCategoryId, date, description, media, logoUrl): Observable<any> {
    return this.http.post(`${ENV.API_URL}/product/editProduct`, { productId, name, brand, directionOfUse, categoryId, subCategoryId, date, description, media, logoUrl }, this.httpOptions()).pipe(
      map(res => res),
      catchError(error => error)
    )
  }

  product_export(data: any): Observable<any> {
    return this.http.post(`${ENV.API_URL}/admin/productListExport`, { ...data }, this.httpOptions()).pipe(
      map(response => response)
    )
  }

  //  code are used for subscriptio component*******************************************************************//
  createsubscription(title, cost, description, privilage): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/createSubscription`, { title, cost, description, privilage }, this.httpOptions()).pipe(
      map(resp => resp)
    )
  }

  subscriptionlist(): Observable<any> {
    return this.http.get<any>(`${ENV.API_URL}/admin/listSubscription`, this.httpOptions()).pipe(
      map(resp => resp)
    )
  }

  subscriptiondetail(subscriptionId): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/detailedSubscription`, { subscriptionId }, this.httpOptions()).pipe(
      map(res => res)
    )
  }

  editsubscription(subscriptionId,type,title,cost,description,privilage): Observable<any> {
    return this.http.post<any>(`${ENV.API_URL}/admin/editSubscription`, { subscriptionId,type,title,cost,description,privilage }, this.httpOptions()).pipe(
      map(resp => resp)
    )
  }
// subscriptionId,limit,page,searchString,sortKey,sortOrder,subscriptionStartFromDate
  subscriptionuser(payload):Observable<any>{
   
    return this.http.post<any>(`${ENV.API_URL}/admin/listSubscriptionUser`,payload,this.httpOptions()).pipe(
      map(response=>response)
    )
  }
  
  deletesubscription(subscriptionId):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/deleteSubscription`,{subscriptionId},this.httpOptions()).pipe(
      map(resp=>resp)
    )
  }


  /** ********************************************* code end *********************************************** */

  /** code for brand name api call***************************************************** */

  brandname():Observable<any>{
    return this.http.get<any>( `${ENV.API_URL}/manager/listBrandName`).pipe(
      map(resp=>resp)
    )
  }
  /*************end code for brand anme api call********************************************** */
  deleteReviewRating(payload:any):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/deleteReviewRating`,payload,this.httpOptions()).pipe(
      map(resp=>resp)
    )
  }

  importcsv(link):Observable<any>{
    return this.http.post<any>(`${ENV.API_URL}/admin/importCSVProduct`,{link},this.httpOptions()).pipe(
      map(resp=>resp)
    )
  }

  /*================================== code for get format ======================================================*/

 
}

