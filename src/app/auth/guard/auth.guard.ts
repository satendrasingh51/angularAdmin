import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, CanActivateChild } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate , CanLoad , CanActivateChild{
  constructor(private router: Router) {
   }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
     let url = state.url;
    return this.checkLogin(url);
  }

  canLoad(route: Route): boolean {
    let url =route.path;
    console.log("canLoad  "+url)
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   
    return this.canActivate(route, state);
  }


  
  checkLogin(url: string){
  
    if(sessionStorage.getItem('accessToken') && url ==='/auth'){
      this.router.navigate(['/theme'])
      return false;
    }
    if(sessionStorage.getItem('accessToken')   ){
      return true;
    }
    console.log(" AuthGuard attemptedUrl ="+url)
    this.router.navigate(['/auth'],{queryParams: {attemptedUrl:url}});
    return false;
  }
}
