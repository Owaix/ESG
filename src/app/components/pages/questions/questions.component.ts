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
  errortitle = '';
  error: string = "Data has been saved successfully";
  question_no: string = ""
  mutilChecks: string[] = [];
  answers: Answers[] = [];
  selectedOptionsByQuestionId: { [key: number]: number[] } = {};

  constructor(private encrypt: EncryptionService,
    private service: ApiService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute, private dataService: DataService) {
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
              this.questionsList = this.addNextQuestionsAsSiblings(this.questionsList);
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

  isChecked(optionId: number, anser: number[]): boolean {
    if (anser == null || anser.length == 0) {
      return false;
    } else {
      return anser.includes(optionId);
    }
  }
  changeSelection(next_questions: any[], question_id: number) {
    const index = this.questionsList.findIndex(item => item.id === question_id && item.id !== 'mc');

    if (index !== -1) {
      if (next_questions) {
        const uniqueNextQuestions = next_questions.filter(
          newItem => !this.questionsList.some(existingItem => existingItem.id === newItem.id)
        );
        uniqueNextQuestions.map(num => num.parent_id = question_id);
        this.questionsList = [
          ...this.questionsList.slice(0, index + 1),
          ...uniqueNextQuestions,
          ...this.questionsList.slice(index + 1)
        ];
        this.questionsList[index + 1].isNextQuestion = true;
      } else {
        this.questionsList = this.questionsList.filter(item => item.parent_id !== question_id);
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
      console.log(answer);
      this.mySubscription = this.service.SaveQuestions(answer).subscribe(x => {
        this.error = "success"
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

  radio_Change(questionId: number, optionId: number) {
    if (!this.selectedOptionsByQuestionId[questionId]) {
      this.selectedOptionsByQuestionId[questionId] = [];
    }
    const index = this.selectedOptionsByQuestionId[questionId].indexOf(optionId);
    if (index === -1) {
      this.selectedOptionsByQuestionId[questionId].push(optionId);
    } else {
      this.selectedOptionsByQuestionId[questionId].splice(index, 1);
    }
    console.log(this.selectedOptionsByQuestionId);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  addNextQuestionsAsSiblings(questions: any[]) {
    let results: any[] = [];

    questions.forEach(question => {
      results.push(question);

      const userAnswerId = question.user_answer;
      const matchingOption = question.options.find((option: { id: any; }) => option.id === userAnswerId);
      if (matchingOption && matchingOption.has_next_question) {
        for (let i = 0; i < matchingOption.next_questions.length; i++) {
          let sub = matchingOption.next_questions[i];
          if (sub.type == 'mc') {
            this.selectedOptionsByQuestionId[sub.id] = JSON.parse(sub.user_answer);
          }
          sub.parent_id = question.id;
          results.push(sub);
        }
      }
    });

    return results;
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
