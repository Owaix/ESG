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
  selectedOptionsByQuestionId: { [key: number]: number[] } = {};

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
        } catch (error) {
          console.error('Error decrypting data:', error);
        }
      }
    });
  }

  isChecked(optionId: string): boolean {
    return this.mutilChecks.includes(optionId);
  }
  changeSelection(event: any, next_questions: any[], question_id: number) {
    const index = this.questionsList.findIndex(item => item.id === question_id && item.id !== 'mc');

    if (index !== -1) {
      if (next_questions) {
        const uniqueNextQuestions = next_questions.filter(
          newItem => !this.questionsList.some(existingItem => existingItem.id === newItem.id)
        );

        this.questionsList = [
          ...this.questionsList.slice(0, index + 1),
          ...uniqueNextQuestions,
          ...this.questionsList.slice(index + 1)
        ];

        this.questionsList[index + 1].isNextQuestion = true;
      } else {
        this.questionsList = this.questionsList.filter(item => !item.isNextQuestion);
      }
    }
  }

  parseToInt(answer: any) {
    return parseInt(answer.user_answer)
  }

  saveResponses(): void {
    for (let i = 0; i < this.questionsList.length; i++) {
      let answer = {};
      let question = this.questionsList[i];
      let checkans = this.selectedOptionsByQuestionId[question.id];
      if (checkans !== undefined) {
        answer = {
          report_id: this.report_id,
          question_id: question.id,
          answer: checkans
        }
      } else {
        answer = {
          report_id: this.report_id,
          question_id: question.id,
          answer: question.user_answer
        }
      }
      this.mySubscription = this.service.SaveQuestions(answer).subscribe(x => {
        console.log(x);
      })
      this.openModal();
    }
  }


  isModalOpen = false;
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateCheckboxAnswers(questionId: number, optionId: number) {
    if (!this.selectedOptionsByQuestionId[questionId]) {
      this.selectedOptionsByQuestionId[questionId] = [];
    }
    const index = this.selectedOptionsByQuestionId[questionId].indexOf(optionId);
    if (index === -1) {
      this.selectedOptionsByQuestionId[questionId].push(optionId);
    } else {
      this.selectedOptionsByQuestionId[questionId].splice(index, 1);
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


}

export class Answers {
  report_id: number = 0;
  question_id: number = 0;
  answer: any = '';
}
