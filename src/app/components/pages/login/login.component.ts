import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { ApiService } from 'src/app/service/api.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  users!: User;
  private mySubscription: Subscription | null = null;  // Initialized as null
  constructor(private service: ApiService) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.users.company_email && this.users.password) {
      this.mySubscription = this.service.login(this.users).subscribe(x => {
        if (x.status == "SUCCESS") {
          let token_secret = process.env['token_secret'] || "";
          const encryptedToken = CryptoJS.AES.encrypt(x.data.access_token, token_secret).toString();
          localStorage.setItem('token', encryptedToken);
        }
      })
      alert(`Username: ${this.users.company_email}\nPassword: ${this.users.password}`);
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
