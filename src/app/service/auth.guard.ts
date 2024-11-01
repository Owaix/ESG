// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    isLoggedIn = false;
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: any): boolean {
        const isAuthRoute = route.url[0].path === 'login' || route.url[0].path === 'signup';
        console.log(isAuthRoute);
        this.authService.isAuthenticated.subscribe((isAuth) => {
            this.isLoggedIn = isAuth;
            console.log("this.isLoggedIn ", this.isLoggedIn);
        });
        if (this.isLoggedIn) {
            if (isAuthRoute) {
                this.router.navigate(['/']);
                return false;
            }
        } else {
            if (!isAuthRoute) {
                // Redirect unauthenticated users to login
                this.router.navigate(['/']);
                return false;
            }
        }

        return true;
    }
}
