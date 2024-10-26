import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})

export class TopicsComponent {
  private mySubscription: Subscription | null = null;
  cards: any[] = [];
  report_id: string = '';

  constructor(
    private service: ApiService,
    private dataservice: DataService,
    private encrypt: EncryptionService,
    private router: Router) { }

  ngOnInit(): void {
    this.mySubscription = this.service.get_topics().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.cards = x.data.topics;
        console.log(this.cards);
        this.report_id = this.encrypt.encrypt(x.data.report_id.toString());
        this.dataservice.createHeader(x.data.report_ref_no);
      }
    })
  }

  subtopics(id: number) {
    this.router.navigate(['/subtopics', id, this.report_id]);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
