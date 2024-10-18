import { Component, OnInit } from '@angular/core';
import { catchError, Subscription, throwError } from 'rxjs';
import { User } from 'src/app/models/User';
import { ApiService } from 'src/app/service/api.service';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  users: User = new User();
  private mySubscription: Subscription | null = null;  // Initialized as null
  constructor(private service: ApiService, private authService: AuthService, private router: Router) { }
  errormsg = '';
  ngOnInit(): void {

  }

  onSubmit() {
    if (this.users.email && this.users.password) {
      this.mySubscription = this.service.login(this.users).pipe(
        catchError(err => {
          if (err.status === 401) {
            this.errormsg = err.error.message;
          } else {
            this.errormsg = 'An error occurred. Please try again later.';
          }
          return throwError(() => new Error(err));
        })
      ).subscribe(
        response => {
          if (response.status == "SUCCESS") {
            this.errormsg = '';
            //let token_secret = process.env['token_secret'] || "";
            //const encryptedToken = CryptoJS.AES.encrypt(x.data.access_token, token_secret).toString();
            localStorage.setItem('token', response.data.access_token);
            this.mySubscription = this.service.GetProfile().subscribe(x => {
              console.log(response.data.access_token);
              //console.log(encryptedToken);
              this.authService.login(this.users.email);
              this.router.navigate(['/']); // Redirect to home or wherever after login
            })
          }
        },
        error => {
          console.log('Error:', error);
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
