import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Subscription, throwError } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
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
  questionsList: any[] = [];
  noofquestions: number = 0;
  totalquestions: number = 0;
  questionsIds: string[] = [];
  encryptedData: string = "";
  isComplete = true;
  topic_id: string = "";
  report_id: string = "";
  errormsg = '';
  title = '';
  errortitle = 'SAVED';
  error: string = "Data has been saved successfully";
  question_no: string = ""
  mutilChecks: string[] = [];
  answers: Answers[] = [];

  constructor(private encrypt: EncryptionService,
    private service: ApiService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loaderService.show();
    this.route.params.subscribe(params => {
      this.encryptedData = params['id'];
      this.title = params['qid'];
      let reportid = params['report_id'];
      this.topic_id = params['topic_id'];
      if (this.encryptedData) {
        try {
          let decryptedArray = this.encrypt.decrypt(this.encryptedData);
          this.report_id = this.encrypt.decrypt(reportid);
          this.questionsIds = decryptedArray.split(',');
          this.mySubscription = this.service.get_questions(this.questionsIds, this.report_id).subscribe(
            response => {
              for (let i = 0; i < response.length; i++) {
                let ques = response[i].data;
                ques.index = i + 1;
                if (ques.type == 'co') {
                  ques.user_answer = parseInt(ques.user_answer);
                }
                this.questionsList.push(ques);
              }
              this.loaderService.hide();
              console.log(this.questionsList);
            },
            error => {
              this.loaderService.hide();
              console.error('Error fetching questions:', error);
            }
          )


          // this.mySubscription = this.service.get_question(qid, reportid).subscribe(
          //   response => {
          //     let x = response;
          //     if (x.status == "SUCCESS") {
          //       console.log(x.data);
          //       this.question = x.data;
          //       this.question_no = "Question " + no + " of " + this.questionsIds.length;
          //       if (x.data.type == "co") {
          //         x.data.user_answer = isNaN(x.data.user_answer) ? 0 : x.data.user_answer;
          //         x.data.user_answer = parseInt(x.data.user_answer);
          //       }
          //       if (x.data.type == "ui") {
          //         x.data.user_answer = isNaN(x.data.user_answer) ? '' : x.data.user_answer;
          //       }
          //       this.answers.answer = x.data.user_answer;
          //     }
          //   },
          //   error => {
          //     this.loaderService.hide();
          //     console.error('Error fetching questions:', error);
          //   }
          // );
        } catch (error) {
          console.error('Error decrypting data:', error);
        }
      }
    });
  }

  isChecked(optionId: string): boolean {
    return this.mutilChecks.includes(optionId);
  }
  changeSelection(event: any, next_questions: any) {
    console.log(next_questions)
    // this.mySubscription = this.service.get_question(qid, this.report_id).subscribe(
    //   response => {
    //     let x = response;
    //     if (x.status == "SUCCESS") {

    //     }
    //   })
  }

  parseToInt(answer: any) {
    return parseInt(answer.user_answer)
  }

  saveResponses(): void {
    for (let i = 0; i < this.questionsList.length; i++) {
      let question = this.questionsList[i];
      let answer = {
        report_id: this.report_id,
        question_id: question.id,
        answer: question.user_answer
      }
      console.log(answer);
      this.mySubscription = this.service.SaveQuestions(answer).subscribe(x => {
        console.log(x);
      })
      this.openModal();
    }
    return;
    if (false) {
      if (this.question.type == "ui") {
        this.error = "Please write an answer to the question";
      } else {
        this.error = "Please choose an answer to the question";
      }
    } else {
      this.error = "";
      // this.mySubscription = this.service.SaveQuestions(this.answers).subscribe(x => {
      //   if (x.status == "SUCCESS") {
      //     if (this.question.type == "co") {
      //       console.log(x);
      //       console.log(this.questionsIds);
      //       let options = this.question.options.find((x: { id: string; }) => x.id == this.answers.answer);
      //       let result = this.questionsIds.filter(num => num > this.answers.question_id.toString());
      //       let incomingValues: string[] = [];
      //       if (options.has_next_question == true) {
      //         for (let i = 0; i < options.next_questions.length; i++) {
      //           let sub = options.next_questions[i];
      //           incomingValues.push(sub.id.toString());
      //         }
      //         result = incomingValues.concat(result);
      //       }
      //       let encryptArray = this.encrypt.encrypt(result.join(','));
      //       this.router.navigate(['/question', encryptArray, result[0], this.report_id, this.topic_id]);
      //     } else if (this.question.type == "ui") {
      //       let qid = this.getNextValue(this.questionsIds, this.answers.question_id.toString());
      //       this.router.navigate(['/question', this.encryptedData, qid, this.report_id, this.topic_id]);
      //     }
      //   } else {
      //     alert("Answer cannot be empty! Please select an answer!")
      //   }
      // })
    }
  }


  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateCheckboxAnswers(questionId: number, optionId: string) {
    // if (!this.answers[questionId]) {
    //   this.answers[questionId] = [];
    // }

    // if (checked) {
    //   this.answers[questionId].push(optionId);
    // } else {
    //   this.answers[questionId] = this.answers[questionId].filter(id => id !== optionId);
    // }
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


}

export class Answers {
  report_id: number = 0;
  question_id: number = 0;
  answer: any = '';
}
