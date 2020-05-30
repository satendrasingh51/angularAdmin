import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSub= new Subject<string>();
  constructor() { }
  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next('changed');
  }
  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSub.next('changed');
   
  }

  getItem(key:string){
    return localStorage.getItem(key);
}

}
