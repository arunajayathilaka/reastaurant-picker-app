import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const SESSION_API = 'api/sessions';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) {
   }

  getSession(sessionId: string): Observable<any> {
    return this.http.get(
      SESSION_API + '/'+ sessionId,
      httpOptions
    );
  }

  isSessionEnded(sessionId: string): Observable<any> {
    return this.http.get(
      SESSION_API + '/'+ sessionId + '/' + 'isEnded',
      httpOptions
    );
  }

  getRestaurants(sessionId: string): Observable<any> {
    return this.http.get(
      SESSION_API + '/'+ sessionId + '/'+ 'restaurants',
      httpOptions
    );
  }

  createSession(): Observable<any>  {
    return this.http.post(
      SESSION_API,
      {
        name: "session" + new Date().getTime()
      },
      httpOptions
    );
  }

  joinSessin(sessionId: string) :Observable<any>  {
    return this.http.get(
      SESSION_API + '/'+ sessionId +'/join',
      httpOptions
    );
  }

  addRestaurant(sessionId: string, name: string) :Observable<any> {
    return this.http.post(
      SESSION_API + '/'+ sessionId +'/addRestaurant',
      {
        name
      },
      httpOptions
    );
  }

  endSesion(sessionId: string) :Observable<any> {
    return this.http.get(
      SESSION_API + '/'+ sessionId +'/end',
      httpOptions
    );
  }

}
