import { Component, OnInit } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'restaurant-picker-app';

  username?: string;

  constructor(private storageService: StorageService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      const user = this.storageService.getUser();

      this.username = user.username;
    }
  }

  logout(): void {
    this.authService.logout();
    this.storageService.clean();
    this.router.navigate(['/login']);
  }
}
