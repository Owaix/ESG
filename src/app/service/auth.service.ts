import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authenticated = new BehaviorSubject<boolean>(false);
    private email: string | null = null;

    isAuthenticated = this.authenticated.asObservable();

    login(email: string) {
        this.email = email;
        this.authenticated.next(true);
    }

    logout() {
        this.email = null;
        this.authenticated.next(false);
    }

    getUserEmail(): string | null {
        return this.email;
    }
}
