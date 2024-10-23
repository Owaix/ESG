import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-subtopics',
  templateUrl: './subtopics.component.html',
  styleUrls: ['./subtopics.component.scss']
})
export class SubtopicsComponent {
  private mySubscription: Subscription | null = null;  // Initialized as null
  cards: any[] = [];
  name: string = "";
  description: string = "";

  constructor(private service: ApiService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = +params['id']; // Convert to number
      this.mySubscription = this.service.get_subtopics(id).subscribe(x => {
        if (x.status == "SUCCESS") {
          this.cards = x.data.subtopics;
          this.description = x.data.description;
          this.name = x.data.name;
        }
      })
    });

  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}