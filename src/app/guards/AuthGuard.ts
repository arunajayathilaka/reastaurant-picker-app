import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { JWTTokenService } from '../_services/jwt.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private storageService: StorageService,private jwtService: JWTTokenService, private router: Router) {}

  canActivate( route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) {
    if(this.storageService.isLoggedIn() && !this.jwtService.isTokenExpired(this.storageService.getToken())) {
        return true;
    } else {
        return this.router.navigate(["/login"], {queryParams: { returnUrl : state.url }});
    }
  }
}