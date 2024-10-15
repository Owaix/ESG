import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  users!: User;
  private mySubscription: Subscription | null = null;  // Initialized as null

  constructor(private service: ApiService) { }

  onSubmit() {
    this.mySubscription = this.service.register(this.users).subscribe(x => {
    })
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
