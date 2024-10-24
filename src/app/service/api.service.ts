import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from './env';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(private http: HttpClient) { }
    register(user: User): Observable<any> {
        console.log(JSON.stringify(user));
        return this.http.post(environment.BASE_URL + 'auth/signup', user);
    }
    login(user: User): Observable<any> {
        return this.http.post(environment.BASE_URL + 'auth/login', user, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }
    Getcategories(): Observable<any> {
        return this.http.get(environment.BASE_URL + 'company/categories');
    }
    GetProfile(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get(environment.BASE_URL + 'company/categories', { headers });
    }
    SaveChecks(user: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'ddl/SaveChecks', user);
    }
    get_profile(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get(environment.BASE_URL + 'company/profile', { headers });
    }
    get_topics(): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get(environment.BASE_URL + 'topic/list', { headers });
    }
    get_subtopics(id: number): Observable<any> {
        const token = this.getToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get(environment.BASE_URL + 'topic/subtopics/' + id, { headers });
    }

    get_questions(numberOfCalls: string[]): Observable<any[]> {
        const token = this.getToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const apiCalls: Observable<any>[] = [];
        for (let i = 0; i < numberOfCalls.length; i++) {
            console.log(environment.BASE_URL + 'topic/question/' + numberOfCalls[i]);
            apiCalls.push(this.http.get(environment.BASE_URL + 'topic/question/' + numberOfCalls[i], { headers }));
        }
        return forkJoin(apiCalls);
    }
    update_profile(user: User): Observable<any> {
        const token = this.getToken();
        user.token = token;
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.put(environment.BASE_URL + 'users/update_profile', user, { headers });
    }
    private getToken(): string {
        return localStorage.getItem('token') || "";
    }
}