import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { EncryptionService } from 'src/app/service/encrypt.service';

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
  report_id: string = "";

  constructor(private encrypt: EncryptionService, private service: ApiService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = +params['id']; // Convert to number
      this.report_id = params['report_id'];
      this.mySubscription = this.service.get_subtopics(id).subscribe(x => {
        if (x.status == "SUCCESS") {
          this.cards = x.data.subtopics;
          this.description = x.data.description;
          this.name = x.data.name;
        }
      })
    });
  }

  showQues(id: number[]) {
    if (id.length > 0) {
      let qid = id[0];
      let encryptedArray = this.encrypt.encrypt(id.join(','));
      this.router.navigate(['/question', encryptedArray, qid, this.report_id]);
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
