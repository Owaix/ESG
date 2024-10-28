import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})

export class VerifyComponent implements OnInit {
  token: string | null = null;
  private mySubscription: Subscription | null = null;  // Initialized as null

  constructor(private route: ActivatedRoute, private service: ApiService) { }

  ngOnInit(): void {
    // Access the query parameter 'token'
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      let obj = {
        verification_token: this.token
      }

      this.mySubscription = this.service.verify(obj).pipe(
        catchError(err => {
          if (err.status === 400) {
            console.log(err);
          } else {
            console.log(err);
          }
          return throwError(() => new Error(err));
        })
      ).subscribe(
        response => {
          if (response.status == "SUCCESS") {
            console.log(response);
          }
        },
        error => {
          console.log('Error:', error);
        }
      );
    });
  }
  openModal() {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}