import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent {
  private mySubscription: Subscription | null = null;  // Initialized as null
  cards: any[] = [];
  
  constructor(private service: ApiService, private router: Router) { }
  ngOnInit(): void {
    this.mySubscription = this.service.get_topics().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.cards = x.data.topics;
        console.log(x);
      }
    })
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
