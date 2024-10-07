import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  firstname: string = '';
  lastname: string = '';
  emailAddress: string = '';
  phoneNumber: string = '';
  companyName: string = '';
  companyIndustry: number = 0;

  onSubmit() {
    // if (this.username && this.password) {
    //   alert(`Username: ${this.username}\nPassword: ${this.password}`);
    //   // Add your login logic here
    // }
  }
}
