import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class DataService {
    private data: any = [];
    constructor() { }

    getData(): any[] {
        return this.data;
    }
    resetData() {
        this.data = {};
    }
    createHeader(report_ref_no: string): void {
        let header = {
            report_ref_no: report_ref_no,
            company_answers: []
        };
        this.data = header;
    }

    addQuestions(item: CompanyAnswer): void {
        const index = this.data.company_answers.findIndex((answer: CompanyAnswer) => answer.id === item.id);
        if (index !== -1) {
            this.data.company_answers[index] = { ...this.data.company_answers[index], ...item };
        } else {
            this.data.company_answers.push(item);
        }
    }

    appendData(index: number, additionalData: any): void {
        if (this.data[index]) {
            this.data[index] = { ...this.data[index], ...additionalData };
        } else {
            console.error("Index out of bounds.");
        }
    }
}

interface CompanyAnswer {
    id: number;
    question: string;
    note: string;
    sub_topic_id: number;
    type: string;
    level: number;
}