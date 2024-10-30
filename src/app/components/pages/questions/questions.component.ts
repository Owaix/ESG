import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})

export class QuestionsComponent implements OnInit, OnDestroy {
  private mySubscription: Subscription | null = null;  // Initialized as null
  question: any = [];
  responses: string[] = [];
  noofquestions: number = 0;
  totalquestions: number = 0;
  questionsIds: string[] = [];
  encryptedData: string = "";
  isComplete = true;
  topic_id: string = "";
  report_id: string = "";
  error: string = "";
  question_no: string = ""
  mutilChecks: string[] = [];
  answers: Answers = { answer: "", question_id: 0, report_id: 0 };

  constructor(private encrypt: EncryptionService,
    private service: ApiService,
    private dataservice: DataService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loaderService.show();
    this.route.params.subscribe(params => {
      this.encryptedData = params['id'];
      let qid = params['qid'];
      this.report_id = params['report_id'];
      this.topic_id = params['topic_id'];
      if (this.encryptedData) {
        try {
          let decryptedArray = this.encrypt.decrypt(this.encryptedData);
          let reportid = this.encrypt.decrypt(this.report_id);
          this.questionsIds = decryptedArray.split(',');

          let Question = this.getNextValue(this.questionsIds, qid.toString());
          if (Question == null) {
            this.isComplete = false;
          }

          console.log(this.questionsIds);
          this.answers.question_id = parseInt(qid);
          let no = this.questionsIds.indexOf(qid) + 1;
          this.question_no = "Question " + no + " of " + this.questionsIds.length;
          this.answers.report_id = parseInt(reportid);
          this.mySubscription = this.service.get_question(qid, reportid).subscribe(
            response => {
              let x = response;
              this.loaderService.hide();
              if (x.status == "SUCCESS") {
                this.question = x.data;
                this.answers.answer = this.question.user_answer;
              }
              console.log(x);
            },
            error => {
              this.loaderService.hide();
              console.error('Error fetching questions:', error);
            }
          );
        } catch (error) {
          console.error('Error decrypting data:', error);
        }
      }
    });
  }

  isChecked(optionId: string): boolean {
    return this.mutilChecks.includes(optionId);
  }
  changeSelection(event: any, option: any) {
    const checked = event.target.checked;
    const optionId = option.id;

    if (checked) {
      this.mutilChecks.push(optionId);
    } else {
      this.mutilChecks = this.mutilChecks.filter(id => id !== optionId);
    }
    console.log('Checked IDs:', this.mutilChecks);
  }

  saveResponses(): void {
    console.log(this.answers);
    if (false) {
      if (this.question.type == "ui") {
        this.error = "Please write an answer to the question";
      } else {
        this.error = "Please choose an answer to the question";
      }
    } else {
      this.error = "";
      this.mySubscription = this.service.SaveQuestions(this.answers).subscribe(x => {
        if (x.status == "SUCCESS") {
          if (this.question.type == "co") {
            let options = this.question.options.find((x: { id: string; }) => x.id == this.answers.answer);
            let result = this.questionsIds.filter(num => num > this.answers.question_id.toString());
            let incomingValues: string[] = [];
            if (options.has_next_question == true) {
              for (let i = 0; i < options.next_questions.length; i++) {
                let sub = options.next_questions[i];
                incomingValues.push(sub.id.toString());
              }
              result = incomingValues.concat(result);
            }
            let encryptArray = this.encrypt.encrypt(result.join(','));
            this.router.navigate(['/question', encryptArray, result[0], this.report_id, this.topic_id]);
          } else if (this.question.type == "ui") {
            console.log(this.answers.question_id);
            console.log(this.questionsIds);
            let qid = this.getNextValue(this.questionsIds, this.answers.question_id.toString());
            this.router.navigate(['/question', this.encryptedData, qid, this.report_id, this.topic_id]);
          }
        } else {
          alert("Answer cannot be empty! Please select an answer!")
        }
      })
    }
  }

  getNextValue(arr: string[], currentValue: string) {
    const index = arr.indexOf(currentValue);
    if (index !== -1 && index < arr.length - 1) {
      return arr[index + 1];
    } else {
      return null;
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  formatAnswer(type: string, answer: string): any {
    if (type === 'ui' || type === 'co') {
      return answer !== '' ? answer : null;
    }
    if (type === 'cm') {
      return answer !== '' ? `[${answer.split(',').map(x => x.trim())}]` : null;
    }
    return null;
  }

  complete() {
    let obj = {
      "report_id": this.answers.report_id,
      "topic_id": this.topic_id
    }

    this.mySubscription = this.service.complete_report(obj).pipe(
      catchError(err => {
        if (err.status === 422) {
          this.error = err.error.message;
          this.openModal();
        } else {
          this.error = err.error.message;
          this.openModal();
        }
        return throwError(() => new Error(err));
      })
    ).subscribe(
      response => {
        if (response.status == "SUCCESS") {
          this.error = '';
          console.log(response);
        }
      },
      error => {
        console.log('Error:', error);
      }
    );
  }
  openModal() {
    throw new Error('Method not implemented.');
  }
}

export class Answers {
  report_id: number = 0;
  question_id: number = 0;
  answer: any = '';
}
