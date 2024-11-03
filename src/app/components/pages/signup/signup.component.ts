import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { Category, CategorySector, CategoryType, User } from 'src/app/models/User';
import { ApiService } from 'src/app/service/api.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  users: User = new User;
  private mySubscription: Subscription | null = null;  // Initialized as null
  typeList: CategoryType[] = [];
  sectorList: CategorySector[] = [];
  errormsg = '';
  showPassword = false;
  showCnfrmPassword = false;
  errortitle = 'ALERT';
  categories: Category[] = []

  constructor(
    private service: ApiService,
    private router: Router,
    private loaderService: LoaderService
  ) { }
  ngOnInit(): void {
    this.mySubscription = this.service.Getcategories().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.categories = x.data;
        console.log(this.categories);
      }
    })
  }

  onSubmit() {
    if (this.users.email && this.users.password) {
      this.loaderService.show();
      this.mySubscription = this.service.register(this.users).pipe(
        catchError(err => {
          if (err.status === 400) {
            this.errormsg = err.error.message;
            this.openModal();
          } else {
            this.errormsg = err.error.message;
            this.openModal();
          }
          return throwError(() => new Error(err));
        })
      ).subscribe(
        response => {
          if (response.status == "SUCCESS") {
            this.errormsg = '';
            //localStorage.setItem('token', response.data.access_token);
            console.log(response);
            // this.authService.login(this.users.email);
            this.router.navigate(['/everif']);
          }
        },
        error => {
          console.log('Error:', error);
        }
      );
    }

  }
  oncategoryChange(event: any): void {
    const id = event.target.value;
    let cate = this.categories.find(y => y.id == id);
    console.log(cate?.types);
    this.typeList = cate!.types;
    this.sectorList = cate!.sectors;
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  get passwordMismatch() {
    return this.users.password !== this.users.confirm_password;
  }
}
