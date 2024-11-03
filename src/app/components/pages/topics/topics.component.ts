import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})

export class TopicsComponent {
  private mySubscription: Subscription | null = null;
  cards: any[] = [];
  report_id: string = '';
  errormsg = '';
  errortitle = 'ALERT';

  constructor(
    private service: ApiService,
    private dataservice: DataService,
    private loaderService: LoaderService,
    private encrypt: EncryptionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.mySubscription = this.service.get_topics().subscribe(x => {
      if (x.status == "SUCCESS") {
        this.cards = x.data.topics;
        console.log(this.cards);
        this.report_id = this.encrypt.encrypt(x.data.report_id.toString());
      }
      this.loaderService.hide();
    })
  }

  submit() {
    let obj = { report_id: this.report_id }

    this.mySubscription = this.service.submit_report(obj).pipe(
      catchError(err => {
        if (err.status === 400) {
          this.errormsg = err.error.message;
          this.openModal();
        } else {
          this.errormsg = err.error.message;
          this.openModal();
        }
        console.log(err.error);
        return throwError(() => new Error(err));
      })
    ).subscribe(
      response => {
        if (response.status == "SUCCESS") {
          this.errormsg = '';
        }
      },
      error => {
        console.log('Error:', error);
      }
    );
  }
  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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
