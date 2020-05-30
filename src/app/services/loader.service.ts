import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new Subject<boolean>();
  public loaderState = this.loaderSubject.asObservable();
  constructor() { }
  show() {
    setTimeout(() => {
      this.loaderSubject.next(true);
    }, 0);  
  }
  
  hide() {
    setTimeout(() => {
      this.loaderSubject.next(false);
    }, 0);
  }
}
