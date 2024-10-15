// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './env';
import { User } from '../models/User';

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(private http: HttpClient) { }
    register(user: User): Observable<any> {
        return this.http.post(environment.BASE_URL + 'users/Registerdealer', user);
    }

    login(user: User): Observable<any> {
        return this.http.post(environment.BASE_URL + 'users/Logindealer', user, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    GetChecks(id: number, userid: string | null): Observable<any> {
        return this.http.get<any>(environment.BASE_URL + `ddl/GetChecks/` + id + '/' + userid);
    }

    SaveChecks(user: any): Observable<any> {
        return this.http.post(environment.BASE_URL + 'ddl/SaveChecks', user);
    }

    get_profile(id: string | null): Observable<any> {
        const token = this.getToken();  // Replace this with your method of retrieving the token        
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.get(environment.BASE_URL + 'users/me/' + id, { headers });
    }

    update_profile(user: User): Observable<any> {
        const token = this.getToken();  // Replace this with your method of retrieving the token        
        user.token = token;
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.put(environment.BASE_URL + 'users/update_profile', user, { headers });
    }

    private getToken(): string {
        return localStorage.getItem('authToken') || "";
    }
}