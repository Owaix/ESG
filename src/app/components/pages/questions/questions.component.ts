import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import * as CryptoJS from 'crypto-js';
import { EncryptionService } from 'src/app/service/encrypt.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  private mySubscription: Subscription | null = null;  // Initialized as null
  questions: any[] = [];
  responses: string[] = [];

  constructor(private encrypt: EncryptionService,
    private service: ApiService,
    private router: Router,
    private route: ActivatedRoute) {
    this.responses = new Array(this.questions.length).fill('');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let encryptedData = params['id'];
      console.log(encryptedData);
      if (encryptedData) {
        try {
          let decryptedArray = this.encrypt.decrypt(encryptedData);
          let decrypted = decryptedArray.split(',');
          this.mySubscription = this.service.get_questions(decrypted).subscribe(
            response => {
              for (let i = 0; i < response.length; i++) {
                let x = response[i];
                if (x.status == "SUCCESS") {
                  this.questions.push(x.data);
                }
              }

              console.log(response);
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
    const companyAnswers = this.questions.map((q, index) => ({
      topic_question_id: q.id,
      topic_question_type: q.type,
      topic_answer: this.formatAnswer(q.type, this.responses[index])
    }));

    const payload = {
      report_ref_no: "ESG240930-cd7748-1",
      company_answers: companyAnswers
    };

    this.mySubscription = this.service.SaveQuestions(payload).subscribe(x => {
      alert(x);
    })

  }

  selectAns(id: number) {
    alert(id);
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
