import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-subtopics',
  templateUrl: './subtopics.component.html',
  styleUrls: ['./subtopics.component.scss']
})

export class SubtopicsComponent {
  private mySubscription: Subscription | null = null;  // Initialized as null
  cards: any[] = [];
  name: string = "";
  errormsg = '';
  errortitle = 'ALERT';
  topic_id: number = 0;
  description: string = "";
  report_id: string = "";

  constructor(
    private loaderService: LoaderService,
    private encrypt: EncryptionService, private service: ApiService, private router: Router, private route: ActivatedRoute
    , private dataService: DataService
  ) { }
  ngOnInit(): void {
    this.loaderService.show();
    this.route.params.subscribe(params => {
      this.topic_id = +params['id']; // Convert to number
      this.report_id = params['report_id'];
      this.mySubscription = this.service.get_subtopics(this.topic_id).subscribe(x => {
        if (x.status == "SUCCESS") {
          this.cards = x.data.subtopics;
          this.description = x.data.description;
          this.name = x.data.name;
        }
        this.loaderService.hide();
      })
    });
  }

  showQues(id: number[], name: string) {
    if (id.length > 0) {
      let encryptedArray = this.encrypt.encrypt(id.join(','));
      this.router.navigate(['/question', encryptedArray, name, this.report_id, this.topic_id]);
    }
  }
  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  complete() {
    let obj = {
      "report_id": parseInt(this.encrypt.decrypt(this.report_id)),
      "topic_id": this.topic_id
    }
    console.log(obj);
    this.mySubscription = this.service.complete_report(obj).pipe(
      catchError(err => {
        if (err.status === 422) {
          this.errormsg = err.error.message;
          this.openModal();
        } else {
          this.errormsg = err.error.message;
          this.openModal();
        }
        return throwError(() => console.log(err));
      })
    ).subscribe({
      next: (response) => {
        if (response.status === "SUCCESS") {
          this.errormsg = "Topic Completed Successfully";
          this.errortitle = "SUCCESS";
          this.openModal();
        }
      },
      error: (error) => {
        console.log('Error:', error);
      }
    })
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
