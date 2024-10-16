import { Component, OnInit, Type } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, CategorySector, CategoryType, User } from 'src/app/models/User';
import { ApiService } from 'src/app/service/api.service';

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
  categories: Category[] = []

  constructor(private service: ApiService) { }
  ngOnInit(): void {
    this.mySubscription = this.service.Getcategories().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.categories = x.data;
        console.log(this.categories);
      }
    })
  }

  onSubmit() {
    console.log(this.users);
    // this.mySubscription = this.service.register(this.users).subscribe(x => {
    //   console.log(x);
    // })
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

  get passwordMismatch() {
    return this.users.password !== this.users.confirm_password;
  }
}
