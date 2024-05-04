import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn: 'root'
  })
export class JWTTokenService {

    constructor() {
    }

    getExpiryTime(token: string): any {
        const decodedToken = jwtDecode(token);
        return decodedToken ? decodedToken['exp'] : null;
    }

    getUser(token: string): any {
        const decodedToken : { [key: string]: string } = jwtDecode(token);
        return decodedToken ? decodedToken['sub'] : null;
      }

    isTokenExpired(token: string): boolean {
      const expiryTime = this.getExpiryTime(token);
      if (expiryTime) {
        return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
      } else {
        return false;
      }
    }
}