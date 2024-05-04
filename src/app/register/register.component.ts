import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  errorMessage = '';
  isSuccessful = false;
  isSignUpFailed = false;

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) {}

  
  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    const { username, password } = this.form;

    this.authService.register(username, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
