import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  sessionId: string = ''; 

  constructor(private storageService: StorageService, 
              private authService: AuthService, 
              private sessionService: SessionService,
              private router: Router) {}

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      const user = this.storageService.getUser();
    }
  }

  logout(): void {
    this.authService.logout();
    this.storageService.clean();
  }

  newSession(): void {
    this.sessionService.createSession().subscribe({
      next: data => {
        this.sessionId = data.id;
        this.router.navigate(['/session',this.sessionId]);
      },
      error: err => {
        console.log(err);
      }
    });
    
  }

}
