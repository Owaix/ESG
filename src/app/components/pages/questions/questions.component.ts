import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { DataService } from 'src/app/service/data.service';
import { EncryptionService } from 'src/app/service/encrypt.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})

export class QuestionsComponent implements OnInit {
  private mySubscription: Subscription | null = null;  // Initialized as null
  question: any = [];
  responses: string[] = [];
  noofquestions: number = 0;
  totalquestions: number = 0;
  questionsIds: string[] = [];
  answers: Answers = {
    answer: "",
    question_id: 0,
    report_id: 0
  };

  constructor(private encrypt: EncryptionService,
    private service: ApiService,
    private dataservice: DataService,
    private router: Router,
    private route: ActivatedRoute) {
    //this.responses = new Array(this.questions.length).fill('');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let encryptedData = params['id'];
      let qid = params['qid'];
      let report_id = params['report_id'];
      if (encryptedData) {
        try {
          let decryptedArray = this.encrypt.decrypt(encryptedData);
          report_id = this.encrypt.decrypt(report_id);
          this.questionsIds = decryptedArray.split(',');
          qid = this.questionsIds[qid];
          this.answers.question_id = parseInt(qid);
          this.answers.report_id = parseInt(report_id);
          this.mySubscription = this.service.get_question(qid, report_id).subscribe(
            response => {
              let x = response;
              if (x.status == "SUCCESS") {
                this.question = x.data;
              }
              console.log(x);
            },
            error => {
              console.error('Error fetching questions:', error);
            }
          );
        } catch (error) {
          console.error('Error decrypting data:', error);
        }
      }
    });
  }

  saveResponses(): void {
    this.mySubscription = this.service.SaveQuestions(this.answers).subscribe(x => {
      if (x.status == "SUCCESS") {
        let options = this.question.options.find((x: { id: string; }) => x.id == this.answers.answer);
        if (options.has_next_question != null) {
          console.log(options.next_questions);
          this.question = options.next_questions[0];
        } else {

        }
      }
    })

    // const companyAnswers = this.questions.map((q, index) => ({
    //   topic_question_id: q.id,
    //   topic_question_type: q.type,
    //   topic_answer: this.formatAnswer(q.type, this.responses[index])
    // }));

    // const payload = {
    //   report_ref_no: "ESG240930-cd7748-1",
    //   company_answers: companyAnswers
    // };
    // this.questions = [];
    // this.questions.push({
    //   "id": 1,
    //   "question": "Organisations’ legal name",
    //   "note": null,
    //   "sub_topic_id": 1,
    //   "type": "ui",
    //   "level": 1
    // });



  }

  // selectAns(obj: any) {
  //   if (obj.next_questions != null) {
  //     this.questions = [];
  //     for (let i = 0; i < obj.next_questions.length; i++) {
  //       let question = obj.next_questions[i];
  //       this.dataservice.addQuestions({
  //         "id": question.id,
  //         "question": question.question,
  //         "note": question.note,
  //         "sub_topic_id": 1,
  //         "type": question.type,
  //         "level": 1
  //       });
  //     }

  //   } else {
  //     this.route.params.subscribe(params => {
  //       let encryptedData = params['id'];
  //       let qid = params['qid'];
  //       let report_id = params['report_id'];
  //       if (encryptedData) {
  //         try {
  //           this.questions = [];
  //           this.router.navigate(['/question', encryptedData, 1, report_id]);
  //         } catch (error) {
  //           console.error('Error decrypting data:', error);
  //         }
  //       }
  //     });
  //     // let next_id = this.questionsIds[this.noofquestions + 1]
  //     // this.mySubscription = this.service.get_question(next_id).subscribe(
  //     //   response => {
  //     //     let x = response;
  //     //     if (x.status == "SUCCESS") {
  //     //       this.questions = [];
  //     //       this.questions.push(x.data);
  //     //     }
  //     //   },
  //     //   error => {
  //     //     console.error('Error fetching questions:', error);
  //     //   }
  //     // );
  //   }
  // }
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
  answer: string = '';
}
